import Fastify from "fastify";
import dotenv from 'dotenv'
import fs from 'fs'

import config from './config/fastify.config.js'

dotenv.config()
const fastify = Fastify({
    logger: true,
    https: {
        key: fs.readFileSync(process.env.SSL_KEY),
        cert: fs.readFileSync(process.env.SSL_CERT),
    },
});

await config(fastify);

const start = async () => {
    try {
        await fastify.listen({ port:3003, host: '0.0.0.0' })
        console.log(`Server listening on ${fastify.server.address().port}`)
    } catch (err) {
        console.error(err)
        process.exit(1)
    }
}

start()