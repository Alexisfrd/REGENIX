@echo off

echo Arrêt de RabbitMQ...
docker stop rabbitmq

echo Arrêt de Redis...
docker stop redis

echo Arrêt de PM2...
pm2 delete all

echo Arrêt du serveur http pour stocker csv...
taskkill /F /IM http-server.exe

echo Arrêt du front-end React...
taskkill /F /IM node.exe

echo Tous les services et microservices sont arrêtés.
pause