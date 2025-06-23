import server from './fastify.js';
import dotenv from 'dotenv'

import roomRoute from './room/room.route.js';

// import { handlerEvent } from './room/room.route.js';

dotenv.config();

server.register(roomRoute);

// await handlerEvent();

const start = async () => {
	server.listen({ port: 3003, host: '0.0.0.0' }).then((address) => {
		console.log(`Server listening on ${address}`)
		}).catch((err) => {
		console.error(err)
		process.exit(1)
	});
}

start()