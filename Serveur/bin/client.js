const axios = require('axios');
const moment = require('moment-timezone');

let derniereDate = null; // Initialisation de derniereDate

function POST(jdata, url, callback) {
    axios.post('http://localhost:3000' + url, jdata)
        .then((res) => {
            callback(res.data);
        }).catch((err) => {
            if (err && "response" in err && err.response && "data" in err.response) {
                console.error(err.response.data);
            } else {
                console.error("Other Error", err);
            }
        });
}

function sendData(sensorName, sensorValue, dateString, token, target) {
    let data = { 
        name: sensorName,
        value: sensorValue,
        date: dateString
    };

    POST({ token: token, data: data, target: target }, "/pushdata", d => {
        console.log(d);
    });
}

function handleLoginAndSendData(sensorName, sensorValue, dateString, login, password, target) {
    POST({ login: login, password: password }, "/login", d => {
        console.log(d);
        let token = d.token;
        sendData(sensorName, sensorValue, dateString, token, target);
    });
}

// Fonction pour générer des valeurs aléatoires
function generateRandomData() {
    const doValue = parseFloat((Math.random() * 10).toFixed(2));
    const phValue = parseFloat((Math.random() * 14).toFixed(2));
    const tempValue = parseFloat((Math.random() * 40).toFixed(2));
    const debitValue = parseFloat((Math.random() * 100).toFixed(2));
    let date = moment().tz('America/Toronto');
    date.set({ millisecond: 0 });
    let dateString = date.format('YYYY-MM-DDTHH:mm:ss');

    if (derniereDate !== dateString) {
        derniereDate = dateString;

        // Envoyer les données pour les trois sondes
        handleLoginAndSendData("DO", doValue, dateString, "DO", "pass", 0);
        handleLoginAndSendData("PH", phValue, dateString, "PH", "pass1", 1);
        handleLoginAndSendData("TEMP", tempValue, dateString, "TEMP", "pass2", 2);
        handleLoginAndSendData("DEBIT", debitValue, dateString, "DEBIT", "pass3", 3);
    }
}

// Appeler generateRandomData toutes les 5 secondes
setInterval(generateRandomData, 1000);