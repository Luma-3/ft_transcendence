import dotenv from 'dotenv';;
import { AddressInfo } from 'net';
import server from './fastify.js';
import uploadRoute from './routes/upload.js';

dotenv.config()
await server.register(uploadRoute);

const start = async () => {
  try {
    await server.listen({ port: 3002, host: '0.0.0.0' });
    console.log(`Server listen on ${(server.server.address() as AddressInfo).port}`);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}
start();
