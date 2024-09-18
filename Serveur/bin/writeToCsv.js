require('dotenv').config();

const main = require("../src/writeToCsv/main");

console.log("Starting publishing to Redis");

main.run();
