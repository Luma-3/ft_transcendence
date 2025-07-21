import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';
import { Type } from '@sinclair/typebox';

import { ResponseSchema } from '../utils/schema.js';

import { USER_PRIVATE_COLUMNS } from './model.js';
import { PREFERENCES_PUBLIC_COLUMNS } from '../preferences/model.js';

import {
  UserPublicResponse,
  UserPrivateResponse,
  UserCreateBodyInternal,
  UserQueryGet,
  UserParamGet,
  VerifyCredentials,
  User2faInfos,
  UserCreateRedis
} from './schema.js';

import {
  ConflictResponse,
  NotFoundResponse,
  UnauthorizedResponse
} from '@transcenduck/error';

import { UserService } from './service.js';

const route: FastifyPluginAsyncTypebox = async (fastify) => {
	fastify.post('/internal/users', {
		schema: {
			summary: 'Create a user (Internal)',
			description: 'Endpoint to create a user ressources and retrieve public informations for internal use only (used by auth service for module Oauth2)',
			tags: ['Users'],
			body: UserCreateBodyInternal,
			response: {
				201: ResponseSchema(UserPublicResponse, 'User created successfully'),
				409: ConflictResponse,
			}
		}
	}, async (req, rep) => {
		const user = await UserService.createUserInternal(req.body);
		return rep.code(201).send({ message: 'User Created', data: user });
	});
	
	fastify.post('/internal/user', {
		schema: {
			summary: 'Create a user (Internal)',
			description: 'Endpoint to create a user ressources and retrieve public informations for internal use only (used by auth service for module 2fa)',
			tags: ['Users'],
			body: UserCreateRedis,
			response: {
				201: ResponseSchema(UserPublicResponse, 'User created successfully'),
				409: ConflictResponse,
			}
		}
	}, async (req, rep) => {
		const userID = req.body.userID;
		const user = await UserService.createUserRedis(userID);
		return rep.code(201).send({ message: 'User Created', data: user });
	});
	
	fastify.patch('/internal/email', {
		schema: {
			summary: 'Update current user email (Internal)',
			description: 'Endpoint to create a user ressources and retrieve public informations for internal use only (used by auth service for module 2fa)',
			tags: ['Users'],
			body: UserCreateRedis,
			response: {
				201: ResponseSchema(UserPublicResponse, 'User created successfully'),
				409: ConflictResponse,
			}
		}
	}, async (req, rep) => {
		const userID = req.body.userID;
		const user = await UserService.updateUserEmailRedis(userID);
		return rep.code(201).send({ message: 'User Created', data: user });
	});
	
	fastify.get('/internal/users/:id', {
		schema: {
			summary: 'Private information of user',
			description: 'Endpoint to retrieve private informations of a user',
			tags: ['Users'],
			params: UserParamGet,
			querystring: UserQueryGet,
			response: {
				200: ResponseSchema(User2faInfos, 'Ok'),
				404: NotFoundResponse,
			}
		}
	}, async (req, rep) => {
		const { id } = req.params;
		const { includePreferences } = req.query;

		const user = await UserService.getUserByID(id, includePreferences, USER_PRIVATE_COLUMNS, PREFERENCES_PUBLIC_COLUMNS);
		return rep.code(200).send({ message: 'Ok', data: user })
	});

	fastify.post('/internal/users/authentications', {
		schema: {
			summary: 'Verify user Credentials (Internal)',
			description: 'Endpoint to verify user credentials for internal Service use only',
			tags: ['Users'],
			body: VerifyCredentials,
			response: {
				200: ResponseSchema(UserPrivateResponse, 'Credentials verified successfully'),
				401: UnauthorizedResponse,
			} // No NotFoundResponse here for security reasons 
		}
	}, async (req, rep) => {
		const { username, password } = req.body;
		const user = await UserService.verifyCredentials(username, password);
		return rep.code(200).send({ message: 'Credentials verified successfully', data: user });
	});

	fastify.post('/internal/users/oauth2', {
		schema: {
			summary: 'Create user from OAuth2',
			description: 'Endpoint to create a user from OAuth2 credentials',
			tags: ['Users'],
			body: Type.Object({
				username: Type.String(),
				email: Type.String(),
				avatar: Type.Optional(Type.String({format: 'uri'}))
			}),
			response: {
				201: ResponseSchema(UserPrivateResponse, 'User created from OAuth2'),
				409: ConflictResponse,
			}
		}
	}, async (req, rep) => {
	const find = await UserService.getUserByEmail(req.body.email, [...USER_PRIVATE_COLUMNS]);
		if (!find) {
			const user = await UserService.createUserO2Auth({
				username: req.body.username,
				email: req.body.email,
				avatar: req.body.avatar ?? '',
			});
			return rep.code(201).send({ message: 'User created from OAuth2', data: user });
		}

		return rep.code(201).send({ message: 'User created from OAuth2', data: find });
	});
}

export default route;