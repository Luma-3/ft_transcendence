FROM base

COPY package*.json ./
COPY nodemon.json ./
COPY tsconfig.json ./
# COPY ./cert/ ./cert

RUN npm install
CMD ["npm", "run", "dev"]
