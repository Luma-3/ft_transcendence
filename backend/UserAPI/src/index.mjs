import Fastify from 'fastify'
import cors from '@fastify/cors'
import knex from '../plugins/Knex.mjs'
import config_knex from '../config/knex.config.mjs'
import bcrypt from 'fastify-bcrypt'
import UserRoutes from './routes/UserRoutes.mjs'
import jwt from '@fastify/jwt'
import { createError } from './utils/errors.mjs'


const fastify = Fastify({
	logger: true
});

fastify.register(cors, {
	origin: '*'
});

fastify.register(knex, config_knex);

fastify.register(bcrypt, {
	saltWorkFactor: 12
});
  

fastify.setErrorHandler((error, request, reply) => {
	if (error.validation) {
		reply.status(400).send({
			status: 'error',
			status: 400,
			message: "Validation Error",
			details: error.validation
		});
	}
	else {
		reply.status(error.statusCode || 500).send({
			status: 'error',
			message: error.message || "Internal Server Error",
			details: error.details
		});
	}
})

fastify.addHook("preSerialization", async (request, reply, payload) => {
	if (payload && typeof(payload) === 'object' && "status" in payload) {
		return payload;
	}

  if (reply.statusCode >= 400) {
    return {
      status: "error",
      message: payload?.message || "",
      details: payload?.details || {},
    };
  }

  return {
    status: "success",
		message: payload?.message || "Ok",
    data: payload?.data || {},
  };
})

fastify.register(UserRoutes);

fastify.register(jwt, {
	secret: 'duckdev'
});

fastify.addHook("onRequest", async (request, reply) => {
	fastify.log.info(request.url);
	if (request.url !== '/user/new') {
		try {
			await request.jwtVerify();
		}
		catch (error) {
			reply.code(error.statusCode).send(createError(error.message, error))
		}
	}
})




const start = async () => {
	try {
		await fastify.listen({ port: 3000, host: '0.0.0.0'})
		console.log(`Server listening on ${fastify.server.address().port}`)
	} catch (err) {
		fastify.log.error(err)
		process.exit(1)
	}
}

start()