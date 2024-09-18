const express = require('express');
const redis = require("redis");
const cors = require('cors');

const app = express();
const host = 'localhost'; // Use 0.0.0.0 to listen on all interfaces
const port = 8001;

const REDISURL = process.env.REDISURL || "redis://127.0.0.1";
const client = redis.createClient({ url: REDISURL });

client.on('error', (err) => {
    console.error('Redis error:', err);
});

(async () => {
    await client.connect();
    console.log('Connected to Redis');
})();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: 'http://localhost:3001', // Autoriser uniquement les requêtes provenant de ce domaine
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', // Méthodes HTTP autorisées
    credentials: true, // Autoriser les cookies et les en-têtes d'autorisation
    allowedHeaders: ['Content-Type', 'Authorization', 'Cache-Control', 'Pragma', 'Expires'] // Ajouter les en-têtes spécifiques
}));

/**
 * Extract temperature from redis and send back to client
 * 
 * @param {*} nameSonde name (from url)
 * @param {*} res object to reply to client
 */
async function getTemp(nameSonde, res) {
    console.log("Query name ", nameSonde);

    try {
        let reply = await client.get(nameSonde);
        let date = await client.get(nameSonde + "_date");
        let value = await client.get(nameSonde + "_value");
        let smax = await client.get(nameSonde + "_smax");
        let smin = await client.get(nameSonde + "_smin");
        let nameCulture = await client.get(nameSonde + "_name_culture");
        let dateDebut = await client.get(nameSonde + "_dateDebut");
        let codeError = await client.get(nameSonde + "_code_erreur");
        let errorLog = await client.get(nameSonde + "_log_erreur");
        let Vmax = await client.get(nameSonde + "_Vmax");
        let Vmin = await client.get(nameSonde + "_Vmin");
        let duration = await client.get(nameSonde + "_duration");
        let cycle = await client.get(nameSonde + "_cycle");

        if (reply != null) {
            console.log("Reply:", reply);
            res.status(200).json({
                "name": reply,
                "TimeStamp": date,
                "value": value,
                "smax": smax,
                "smin": smin,
                "nameCulture": nameCulture,
                "dateDebut": dateDebut,
                "codeError": codeError,
                "errorLog": errorLog,
                "Vmax": Vmax,
                "Vmin": Vmin,
                "duration": duration,
                "cycle": cycle
            });
        } else {
            res.status(404).json({
                "name": "",
                "TimeStamp": "",
                "value": "",
                "smax": "",
                "smin": "",
                "nameCulture": "",
                "dateDebut": "",
                "codeError": "",
                "errorLog": "",
                "Vmax": "",
                "Vmin": "",
                "duration": "",
                "cycle": "0"
            });
        }
    } catch (err) {
        console.error('Error during Redis operations:', err);
        res.status(500).send('Internal Server Error');
    }
}

// Handle 404
function f404(data, res) {
    res.status(404);
    if (data) {
        console.log("Unknown name", data);
        res.end(JSON.stringify({ "error": -1, "message": "Unknown name " + data }));
    } else {
        console.log("Unknown page");
        res.end(JSON.stringify({ "error": -1, "message": "404" }));
    }
}

async function getAllData(res) {
    try {
        // Get all keys
        let keys = await client.keys('*');
        
        // Get the values for these keys
        let data = {};
        for (let key of keys) {
            let value = await client.get(key);
            data[key] = value;
        }

        res.status(200);
        res.json(data); // send back all data
    } catch (error) {
        console.error('Error during Redis operations:', error);
        res.status(500).send('Internal Server Error');
    }
}

function run() {
    // route
    app.get('/temp/:nameSonde', (req, res) => {
        // req.params.name is the name name
        getTemp(req.params.nameSonde, res);
    });
    app.get('/alldata', (req, res) => {
        getAllData(res);
    });
    // Handle all other route to 404
    app.get('/*', (req, res) => {
        console.log("GET 404", req.originalUrl);
        f404(null, res);
    });
    app.post('/*', (req, res) => {
        console.log("POST 404", req.originalUrl);
        f404(null, res);
    });
    app.listen(port, host, () => {
        console.log(`Server is running at http://${host}:${port}`);
    });
}

process.on('SIGINT', async () => {
    await client.disconnect();
    console.log('Disconnected from Redis');
    process.exit(0);
});

exports.run = run;