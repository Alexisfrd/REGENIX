const express = require('express')
const jwt = require('jsonwebtoken');
const app = express();
const cors = require('cors');
const amqp = require('amqplib/callback_api');
const { execFile } = require('child_process'); 
const { exec } = require('child_process'); 
const redis = require('redis');
const bodyParser = require('body-parser');

var validate = require('jsonschema').validate;
// Import our schemas
const schemas = require("../schemas");
const authdb = require("../db/authdb");
const path = require('path');

const port = 3000
const ACCESS_TOKEN_SECRET = "123456789";
const ACCESS_TOKEN_LIFE = 3600;
const queue = 'from_backend';

// Rabbitmq channel to communicate with rabbitmq
var from_backend_channel;

// Adding a middleware to handle json data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

/*redis*/
const client = redis.createClient();

app.use(bodyParser.json());

client.on('error', function (error) {
  console.error('ERROR', error);
});

client.connect();

/**
 * Send a message to rabbitmq
 * 
 * @param {*} data to send to queu
 * @param {*} decoded_jwt token data (normally include user login) 
 */
function push_to_queue(data, decoded_jwt) {
    let d = data;
    d.jwt = decoded_jwt;
    from_backend_channel.sendToQueue(queue, Buffer.from(JSON.stringify(d)));
    console.log(" [x] Sent %s", d);
}

/**
 * Check password validity
 * @param {*} login to check
 * @param {*} password to check
 * @returns {boolean} true if password is valid
 */
function check_password(login, password) {
    let fnd = authdb.authdb.find(element => {
        return element.login == login && element.password == password;
    });

    return !!fnd;
}

/**
 * login action for /login route
 * 
 * @param {*} req from express
 * @param {*} res from express
 */
function login(req, res) {
    let validation = validate(req.body, schemas.login_schema);
    if (validation.valid) {
        if (req.body.login && req.body.password && check_password(req.body.login, req.body.password)) {
            let token = jwt.sign({ login: req.body.login }, ACCESS_TOKEN_SECRET, { expiresIn: ACCESS_TOKEN_LIFE, algorithm: 'HS512' });
            res.send({ token: token });
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(400);
    }
}

/**
 * pushdata action for /pushdata route
 * 
 * @param {*} req from express
 * @param {*} res from express
 * @returns 
 */
function pushdata(req, res) {
    let validation = validate(req.body, schemas.postdata_schema);
    if (validation.valid) {
        if (req.body.token && req.body.data) {
            try {
                let result = jwt.verify(req.body.token, ACCESS_TOKEN_SECRET);
                console.log("Data:", req.body);
                push_to_queue(req.body, result);
                res.sendStatus(201);
            } catch (err) {
                res.sendStatus(401);
            }
        } else {
            res.sendStatus(401);
        }
    } else {
        res.sendStatus(400);
    }
}

var action_iter = 0;
const action_array = [{ type: "print", data: "Bonjour" },
{ type: "print", data: "tout" },
{ type: "print", data: "le" },
{ type: "print", data: "monde" },
{ type: "end" },
];

function pull(req, res) {
    let validation = validate(req.body, schemas.pull_schema);
    if (validation.valid) {
        jwt.verify(req.body.token, ACCESS_TOKEN_SECRET, function (err, decoded) {
            if (err) {
                res.sendStatus(401);
            } else {
                res.status(201).send({ data: action_array[action_iter++ % action_array.length] });
            }
        });
    } else {
        res.sendStatus(400);
    }
}

// Chemin complet vers l'exécutable PM2
//const pm2Path = 'C:\\Users\\alexi\\AppData\\Roaming\\npm\\pm2.cmd'; // Remplacez par le chemin correct

function startCulture(req, res) {
    const { script, args } = req.body;
    const scriptPath = path.resolve(__dirname, script);
    const argsString = args.join(' ');
    const command = `"pm2 start "${scriptPath}" -f -- ${argsString}`;

    exec(command, { windowsHide: true }, (error, stdout, stderr) => {
        if (error || stderr) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
}

function startClient(req, res) {
    const { script } = req.body;
    const scriptPath = path.resolve(__dirname, script);
    const command = `"${pm2Path}" start "${scriptPath}" -f`;

    exec(command, { windowsHide: true }, (error, stdout, stderr) => {
        if (error || stderr) {
            res.sendStatus(500);
        } else {
            res.sendStatus(200);
        }
    });
}

function killCulture(req, res) {
    const processes = ['publishToRedis', 'client'];

    processes.forEach((process) => {
        const command = `"${pm2Path}" delete ${process}`;

        exec(command, { windowsHide: true }, (error, stdout, stderr) => {
            if (error || stderr) {
                res.sendStatus(500);
            }
        });
    });

    res.sendStatus(200);
}
/*
function exportCsv(req, res) {
    const csvDirectory = '\Serveur\csv\brut'; // Remplacez par le chemin réel de votre répertoire CSV

    exec(`explorer "${csvDirectory}"`, { windowsHide: true }, (error, stdout, stderr) => {
        if (error) {
            console.error(`Error opening directory: ${error.message}`);
            return res.sendStatus(500);
        }
        if (stderr) {
            console.error(`stderr: ${stderr}`);
            return res.sendStatus(500);
        }
        console.log(`stdout: ${stdout}`);
        res.sendStatus(200);
    });
}
*/
/**
 * Run express application (routes and listen)
 */
function run_express() {
    console.log("Starting express");
    app.get('/', (req, res) => {
        res.send('Hello World!')
    })

    app.post('/login', (req, res) => {
        login(req, res);
    })

    app.post('/pushdata', (req, res) => {
        pushdata(req, res);
    });

    app.post('/pull', (req, res) => {
        pull(req, res);
    });

    app.post('/startCulture', (req, res) => {
        startCulture(req, res);
    });

    app.post('/startClient', (req, res) => {
        startClient(req, res)
    });

    app.post('/killCulture', (req, res) => {
        killCulture(req, res);
    });
    
    app.post('/updateCycle', async (req, res) => {
        const { stop } = req.body;

        try {
            let keys = await client.keys('*');
            for (let key of keys) {
                await client.set(key, stop);
            }
            res.sendStatus(200);
        } catch (error) {
            res.sendStatus(500);
        }
    });

    app.post('/ignoreError/:nameSonde', async (req, res) => {
        const { Vmin, Vmax } = req.body;
        const { nameSonde } = req.params;
        console.log('Received request to ignore error for:', nameSonde);
        console.log('Request body:', req.body);

        try {
            await client.set(`${nameSonde}_Vmin`, Vmin);
            await client.set(`${nameSonde}_Vmax`, Vmax);
            res.sendStatus(200);
        } catch (error) {
            res.sendStatus(500);
        }
    });
/*
    app.post('/exportCsv', (req, res) => {
        exportCsv(req, res);
    });
*/
    app.get("/*", (req, res) => {
        res.sendStatus(404);
    });

    app.listen(port, () => {
        console.log(`Server listening on port ${port}`)
    })
}

/**
 * Define the main function for main module
 * localhost => rabbitmq
 */
function run() {
    //const IP = process.env.IP || "localhost";
    const IP = process.env.IP || "rabbitmq";
    const username = process.env.user || 'guest';
    const password = process.env.password || 'guest';
    const opt = { credentials: require('amqplib').credentials.plain(username, password) };

    amqp.connect('amqp://' + IP, opt, function (error0, connection) {
        if (error0) {
            throw error0;
        }
        connection.createChannel(function (error1, channel) {
            if (error1) {
                throw error1;
            }
            channel.assertQueue(queue, {
                durable: true
            });
            from_backend_channel = channel;
            run_express();
        });
    });
}

// Export this function outside
exports.run = run;