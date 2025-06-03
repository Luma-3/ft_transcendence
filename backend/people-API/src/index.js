import Fastify from 'fastify'
import dotenv from 'dotenv'

import { config_dev, registerPlugin } from '#transcenduck/config/config.js'
import { redisSub } from '#transcenduck/config/redis.js';
import { PeopleModel } from './models/peopleModel.js';
import { FriendsServices } from './services/friendsServices.js';
import { friendRoute } from './routes/friends.js';
import { PeopleServices } from './services/peopleServices.js';
import { peopleRoute } from './routes/people.js';

dotenv.config()
const fastify = Fastify(config_dev);

await registerPlugin(fastify);

fastify.decorate('extractDbKeys', (schema) => {
  return Object.entries(schema.properties)
	.filter(([_, val]) => val.db !== false)
	.map(([key]) => key);
});
const peopleModel = new PeopleModel(fastify.knex);
fastify.decorate("peopleModel",  peopleModel);
fastify.decorate("friendsServices", new FriendsServices(peopleModel));
fastify.decorate("peopleServices", new PeopleServices(peopleModel));

fastify.register(friendRoute);
fastify.register(peopleRoute);


redisSub.subscribe('api.people.in', (message, channel) => {
  try {
	const { userId, action, payload = {} } = JSON.parse(message);
	console.log(`[WS][Redis] <- ${channel} -> client ${userId}`);
	console.log(`[WS][Redis] Action: ${action}`);
	console.log(`[WS][Redis] Payload: ${JSON.stringify(payload)}`);

	if(action == "create") {
		fastify.peopleModel.create(userId, {
			username: payload.username
		})
		  .then(() => {
			console.log(`User ${userId} created successfully.`);
		  })
		  .catch(err => {
			console.error(`Error creating user ${userId}:`, err);
		  });
	}else if(action == "update" && payload.username) {
		fastify.peopleModel.updateUsername(userId, payload.username)
		.then(() => {
			console.log(`User ${userId} updated successfully.`);
		})
		.catch(err => {
			console.error(`Error updating user ${userId}:`, err);
		});
	}else if(action === "delete") {
		fastify.peopleModel.delete(userId)
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
	await fastify.listen({ port: 3004, host: '0.0.0.0' })
	console.log(`Server listening on ${fastify.server.address().port}`)
  } catch (err) {
	console.error(err)
	process.exit(1)
  }
}

start()
