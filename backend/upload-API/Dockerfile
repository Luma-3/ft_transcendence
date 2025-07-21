FROM base

COPY package.json ./
COPY tsconfig.json ./ 
COPY ./src ./src/

RUN npm i -g knex && \
    npm install && \
    npm run build

ENTRYPOINT ["bash", "-c", "npm run start"]

