import server from './fastify.js';
import dotenv from 'dotenv'

import roomRoute from './room/room.route.js';
import pendingRoute from './pending/public.routes.js';
import { UserStatus } from './utils/status.js';

// import { handlerEvent } from './room/room.route.js';

dotenv.config();

server.register(roomRoute);
server.register(pendingRoute);

// await handlerEvent();

const start = async () => {
	server.listen({ port: 3003, host: '0.0.0.0' }).then((address) => {
		console.log(`Server listening on ${address}`)
		UserStatus.listenToUserStatusChanges();
		}).catch((err) => {
		console.error(err)
		process.exit(1)
	});
}

start()