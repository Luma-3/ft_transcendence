FROM base

COPY package.json ./
COPY tsconfig.json ./ 
COPY ./src ./src/
COPY ./migrations ./migrations/
COPY ./knexfile.ts ./knexfile.ts

RUN npm i -g knex && \
    npm install && \
    npm run build

ENTRYPOINT ["bash", "-c", "npm run migrate && npm run start"]

