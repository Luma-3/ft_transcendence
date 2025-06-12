FROM base

WORKDIR /app

COPY package*.json ./
COPY tsconfig.json ./
COPY nodemon.json ./
RUN npm install

CMD ["npm", "run", "dev"]
