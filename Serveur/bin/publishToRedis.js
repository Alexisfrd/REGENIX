require('dotenv').config();
const main = require("../src/publish/main_10sec");

console.log("Starting publishing to Redis");

async function start() {
  await main.run();
}

// Fonction pour gérer l'arrêt propre du processus
function handleExit(signal) {
  console.log(`Received ${signal}. Exiting...`);
  // Vous pouvez ici appeler des fonctions de nettoyage si nécessaire
  process.exit();
}

// Écoute des signaux pour un arrêt propre
process.on('SIGINT', handleExit);  // Signal envoyé par Ctrl+C
process.on('SIGTERM', handleExit); // Signal de terminaison

// Démarrer le script principal
start();