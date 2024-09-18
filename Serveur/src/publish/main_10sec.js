const routingdb = require("../db/routingdb");
const redis = require("redis");
const { ArgumentParser } = require('argparse');
const path = require('path'); // Ajout de l'importation du module path
const { error } = require("console");

const REDISURL = process.env.REDISURL || "redis://127.0.0.1";
const client = redis.createClient({ url: REDISURL });

const stingDO = "DO";
const stingPH = "PH";
const StingTEMP = "TEMP";

let i = 1;

async function updateValues(nameSonde, averagetFloat) {
     
    // Récupérer les valeurs actuelles de Vmax et Vmin depuis Redis
    let VmaxFloat = parseFloat(await client.get(nameSonde + "_Vmax")) || 0;
    let VminFloat = parseFloat(await client.get(nameSonde + "_Vmin")) || 0;

    if(VmaxFloat === 0 && VminFloat === 0){ // init value pour Vmax et Vmin
        VmaxFloat = averagetFloat;
        VminFloat = averagetFloat;
    }
    if(averagetFloat > VmaxFloat){
        VmaxFloat = averagetFloat;
    }
    if(averagetFloat < VminFloat){
        VminFloat = averagetFloat;
    }

    // Enregistrer les nouvelles valeurs dans Redis
    await client.set(nameSonde + "_Vmax", VmaxFloat);
    await client.set(nameSonde + "_Vmin", VminFloat);

}


async function run() {
    const parser = new ArgumentParser({
        description: 'Client parameters'
    });

    parser.add_argument('-q', '--queue', { help: 'Queue', type: "int", required: true });
    parser.add_argument('-a', '--smax', { help: 'seuil max', required: true });
    parser.add_argument('-i', '--smin', { help: 'seuil max', required: true });
    parser.add_argument('-n', '--name', { help: 'name', required: true });
    parser.add_argument('-d', '--date', { help: 'date', required: true });
    parser.add_argument('-f', '--duration', { help: 'duration', required: true });
    parser.add_argument('-c', '--cycle', { help: 'cycle de culture', required: true });
    
    const args = parser.parse_args();

    const queue = args.queue;
    const smax = args.smax;
    const smin = args.smin;
    const nameCulture = args.name;
    const dateDebut = args.date;
    const duration = args.duration;
    const cycle = args.cycle;

    let Vmax = 0;
    let Vmin = 0;

    let smaxFloat = parseFloat(smax);
    let sminFloat = parseFloat(smin);    

    let values = []; 


    // Launch Redis connection
    await client.connect();

    // getting queue name from routingdb
    let queue_name = routingdb.routingdb[parser.parse_args().queue];

    console.log("publish to redis");
    var amqp = require('amqplib/callback_api');

    const IP = process.env.IP || "127.0.0.1";
    const username = process.env.user || 'guest';
    const password = process.env.password || 'guest';

    const opt = { credentials: require('amqplib').credentials.plain(username, password) };

    let cptDuration = duration;

    amqp.connect('amqp://' + IP, opt, function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }

            channel.assertQueue(queue_name, {
                durable: true
            });

            console.log(" [*] Waiting for messages in %s. To exit press CTRL+C", queue_name);
            channel.consume(queue_name, async function (msg) {
                console.log(" [" + i++ + "] Received %s", msg.content.toString());
                let data = JSON.parse(msg.content.toString());
                let nameSonde = data.name.toLowerCase();
                let timestamp = data.date;
                let value = data.value;
                let codeError = 0;
                let errorLog = "valeur ok"; 
                
                cptDuration--;

                values.push(value);

                if (values.length === 10) {

                    console.log("La liste values contient : ", values);


                     // Calculer la moyenne des valeurs
                    let sum = values.reduce((acc, curr) => acc + curr, 0);
                    let average = (sum / values.length).toFixed(2); // Limiter à 2 chiffres après la virgule

                    let averagetFloat = parseFloat(average);    
                    
                    console.log("La moyenne des valeurs est : " + average);

                    // Réinitialiser la liste values après le calcul
                    values = [];

                        // Convertir smax et smin en flottants

                    await updateValues(nameSonde, averagetFloat);

                    if (averagetFloat > smaxFloat) {
                        codeError = 1;
                        errorLog = "value above the max threshold";
                    } else if (averagetFloat < sminFloat) {
                        codeError = 2;
                        errorLog = "value below the min threshold";
                    } else if (averagetFloat > sminFloat && averagetFloat > smaxFloat) {
                        codeError = 0;
                        errorLog = "value OK";
                    }
    
                    console.log("Set in redis:", data);
                    console.log("Set in redis:", nameSonde + "_date", data.date);
    
                    await client.set(nameSonde, nameSonde);
                    await client.set(nameSonde + "_value", averagetFloat);
                    await client.set(nameSonde + "_date", timestamp);
                    await client.set(nameSonde + "_smax", smaxFloat);
                    await client.set(nameSonde + "_smin", sminFloat);
                    await client.set(nameSonde + "_name_culture", nameCulture);
                    await client.set(nameSonde + "_dateDebut", dateDebut);
                    await client.set(nameSonde + "_duration", cptDuration);
                    await client.set(nameSonde + "_cycle", cycle);
                    await client.set(nameSonde + "_code_erreur",codeError);
                    await client.set(nameSonde + "_log_erreur", errorLog);
                 
                }

            }, {
                noAck: true
            });
        });
    });
}

exports.run = run;