const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const redis = require("redis");
const { ArgumentParser } = require('argparse');

const writeFile = promisify(fs.writeFile);
const mkdir = promisify(fs.mkdir);
const readFile = promisify(fs.readFile);

const REDISURL = process.env.REDISURL || "redis://127.0.0.1";
const client = redis.createClient({ url: REDISURL });

const SEUILTOLERANCE = 0.5;

async function fetchAndDisplaySensorData(nameSonde) {
    const keys = [
        `${nameSonde}_value`,
        `${nameSonde}_date`,
        `${nameSonde}_smax`,
        `${nameSonde}_smin`,
        `${nameSonde}_name_culture`,
        `${nameSonde}_dateDebut`,
        `${nameSonde}_code_erreur`,
        `${nameSonde}_log_erreur`
    ];

    const values = await Promise.all(keys.map(key => client.get(key)));

    if (values[0]) { // Assurez-vous qu'il y a au moins la valeur avant d'écrire dans le fichier
        const [value, timestamp, smax, smin, nameCulture, dateDebut, codeError, errorLog] = values;
    
        const csvLine = `${value},${timestamp},${smax},${smin},${codeError},${errorLog}, \n`;
        const dirPath = path.join('csv/brut/', nameSonde);
        const filePath = path.join(dirPath, `${nameSonde}_${nameCulture}_${dateDebut}.csv`);

        try {
            await mkdir(dirPath, { recursive: true }); // Crée le dossier s'il n'existe pas

            let lastLine = '';
            if (fs.existsSync(filePath)) {
                const fileContent = await readFile(filePath, 'utf8');
                const lines = fileContent.trim().split('\n');
                lastLine = lines[lines.length - 1];
            }
            if (csvLine.trim() !== lastLine) {
                await writeFile(filePath, csvLine, { flag: 'a' }); // Écrit dans le fichier, le crée s'il n'existe pas
                console.log(`Data written to ${filePath}`);
            } else {
                console.log(`Duplicate line detected, not writing to ${filePath}`);
            }
        } catch (error) {
            console.error("Error writing to CSV:", error);
        }
    } 
}

async function run() {
    const parser = new ArgumentParser({
        description: 'writeToCsv parameters'
    });

    parser.add_argument('-s', '--sonde', { help: 'sonde', required: true });

    const args = parser.parse_args();

    const nameSonde = args.sonde;

    try {
        await client.connect();
        console.log(`Fetching data for sensor: ${nameSonde}`);

        // Remplacer la souscription par un interval de 1 seconde
        setInterval(() => fetchAndDisplaySensorData(nameSonde), 10000);

        // Ici, vous pouvez continuer à exécuter d'autres tâches si nécessaire
    } catch (error) {
        console.error("Error fetching data from Redis:", error);
    }
}

exports.run = run;