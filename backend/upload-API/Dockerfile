FROM base

COPY package.json ./
COPY tsconfig.json ./ 
COPY ./src ./src/
COPY ./uploads/avatar/ /tmp/uploads/avatar/
COPY ./uploads/banner/ /tmp/uploads/banner/

RUN npm i -g knex && \
    npm install && \
    npm run build

ENTRYPOINT ["bash", "-c", "cp -r /tmp/uploads/avatar/* ./uploads/avatar/ && cp -r /tmp/uploads/banner/* ./uploads/banner/ && npm run start"]

