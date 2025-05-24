import Fastify from 'fastify'
import dotenv from 'dotenv'
//import uplaodRoute from './handler/Routes.mjs'

dotenv.config()

const fastify = Fastify({
  logger: true,
});

const start = async () => {
  try {
    await fastify.listen({ port: 3002, host: '0.0.0.0' });
    console.log(`Server listen on ${fastify.server.address().port}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
start();
