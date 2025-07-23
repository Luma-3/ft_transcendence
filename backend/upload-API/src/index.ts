import dotenv from 'dotenv';;
import { AddressInfo } from 'net';
import server from './fastify.js';
import uploadRoute from './routes/upload.js';
import cluster from 'node:cluster';
const numClusterWorkers = 5;
if (cluster.isPrimary) {
  for (let i = 0; i < numClusterWorkers; i++) {
    cluster.fork();
  }

  cluster.on("exit", (worker, code, signal) => console.log(`worker ${worker.process.pid} died`));
} else {
  dotenv.config()
  await server.register(uploadRoute);

  const start = async () => {
    try {
      await server.listen({ port: 3002, host: '0.0.0.0' });
      console.log(`Server listen on ${(server.server.address() as AddressInfo).port}`);
    } catch (error) {
      console.log("error:", error);
      process.exit(1);
    }
  }
  start();
}
