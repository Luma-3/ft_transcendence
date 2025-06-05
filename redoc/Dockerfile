FROM node:22-alpine

# Installer Redoc CLI
RUN npm install -g redoc-cli && apk add --no-cache bash curl 

# Créer le répertoire de travail
WORKDIR /app

# Copier le script dans le conteneur
COPY ./entrypoint.sh ./

# Rendre le script exécutable
RUN chmod +x ./entrypoint.sh

# Commande de démarrage
CMD ["bash", "./entrypoint.sh"]
