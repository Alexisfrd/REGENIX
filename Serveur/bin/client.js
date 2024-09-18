const axios = require('axios');
const { SerialPort } = require('serialport');
const { ReadlineParser } = require('@serialport/parser-readline');
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

// Configuration du port série
const port = new SerialPort({
    path: 'COM3',
    baudRate: 115200
});

const parser = port.pipe(new ReadlineParser({ delimiter: '\n' }));
console.log('Listening on port COM3');
parser.on('data', (data) => {
    //data
    console.log(data);
    const regex = /DO:\s*([\d.]+),\s*pH:\s*([\d.]+),\s*Temperature:\s*([\d.]+),\s*debit:\s*([\d.]+)/;
    const match = data.match(regex);

    if (match) {
        const doValue = parseFloat(match[1]);
        const phValue = parseFloat(match[2]);
        const tempValue = parseFloat(match[3]);
        const debitValue = parseFloat(match[4]);
        let date = moment().tz('America/Toronto');
        date.set({ millisecond: 0 });
        let dateString = date.format('YYYY-MM-DDTHH:mm:ss');

        if (derniereDate !== dateString) {
            derniereDate = dateString;

            // Envoyer les données pour les trois sondes
            handleLoginAndSendData("DO", doValue, dateString, "DO", "pass",0);
            handleLoginAndSendData("PH", phValue, dateString, "PH", "pass1",1);
            handleLoginAndSendData("TEMP", tempValue, dateString, "TEMP", "pass2",2);
            handleLoginAndSendData("DEBIT", debitValue, dateString, "DEBIT", "pass3", 3);
        }
    }
});