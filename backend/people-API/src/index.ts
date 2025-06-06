import { redisSub } from "./utils/redis"
import { peopleModel } from './models/peopleModel';
import { FriendsServices } from './services/friendsServices';
import { friendRoute } from './routes/friends';
import { PeopleServices } from './services/peopleServices';
import { peopleRoute } from './routes/people';
import { blockedRoute } from './routes/blocked';
import { BlockedServices } from './services/blockedServices';
import server from './fastify';
import { type PeoplesEventRedisType } from './schema/people.schema';
import process from 'node:process'
import { AddressInfo } from 'node:net';

server.decorate("friendsServices", new FriendsServices());
server.decorate("peopleServices", new PeopleServices());
server.decorate("blockedServices", new BlockedServices());

server.register(blockedRoute);
server.register(friendRoute);
server.register(peopleRoute);


redisSub.subscribe('api.people.in', (message, channel) => {
  try {
	const { userId, action, payload = {} } = JSON.parse(message) as PeoplesEventRedisType;
	console.log(`[WS][Redis] <- ${channel} -> client ${userId}`);
	console.log(`[WS][Redis] Action: ${action}`);
	console.log(`[WS][Redis] Payload: ${JSON.stringify(payload)}`);

	if(action == "create" && payload.username) {
		peopleModel.create(userId, payload.username)
		  .then(() => {
			console.log(`User ${userId} created successfully.`);
		  })
		  .catch(err => {
			console.error(`Error creating user ${userId}:`, err);
		  });
	}else if(action == "update" && payload.username) {
		peopleModel.updateUsername(userId, payload.username)
		.then(() => {
			console.log(`User ${userId} updated successfully.`);
		})
		.catch(err => {
			console.error(`Error updating user ${userId}:`, err);
		});
	}else if(action === "delete") {
		peopleModel.delete(userId)
		  .then(() => {
			console.log(`User ${userId} deleted successfully.`);
		  })
		  .catch(err => {
			console.error(`Error deleting user ${userId}:`, err);
		  });
	}
  }
  catch (err) {
	console.error('Error when handle outgoing message', err);
  }
});

const start = async () => {
  try {
	await server.listen({ port: 3004, host: '0.0.0.0' })
	console.log(`Server listening on ${(server.server.address() as AddressInfo).port}`)
  } catch (err) {
	console.error(err)
	process.exit(1)
  }
}

start()
