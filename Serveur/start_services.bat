@echo off
echo Ouverture de Docker Desktop...
powershell -ExecutionPolicy Bypass -File "launch_docker.ps1"
timeout /T 10

echo Lancement du front-end sur le port 3001...
cd C:\Users\hello\Documents\REGENIX\Client2\client-regenix
set PORT=3001
start /B npm run start

echo Lancement de RabbitMQ...
start /B docker run --rm --name rabbitmq -p 5672:5672 -p 15672:15672 rabbitmq:3-management
timeout /T 10

echo Lancement de Redis...
start /B docker run --rm --name redis -p 6379:6379 redis --timeout 0
timeout /T 10

echo Lancement de PM2 avec ecosystem.config.js...
cd C:\Users\hello\Documents\REGENIX\Serveur
start /B pm2 start ecosystem.config.js

echo Lancement de du serveur http pour stocker csv...
cd C:\Users\hello\Documents\REGENIX\Serveur\csv
start /B http-server -p 8080 --cors -c-1

echo Tous les services et microservices sont lancés.
pause