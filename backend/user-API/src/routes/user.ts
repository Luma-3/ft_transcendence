import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import { UserService } from '../services/userService.js';

import { USER_PRIVATE_COLUMNS, USER_PUBLIC_COLUMNS } from '../models/userModel.js';
import { PREFERENCES_PRIVATE_COLUMNS, PREFERENCES_PUBLIC_COLUMNS } from '../models/preferencesModel.js';

import { ResponseSchema } from '../utils/schema.js';
import {
  ConflictResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  ForbiddenResponse
} from '@transcenduck/error';

import {
  UserPublicResponse,
  UserPrivateResponse,
  UserCreateBody,
  UserQueryGet,
  UserHeaderAuthentication,
  UserParamGet,
  UserPasswordUpdateBody,
  UserEmailUpdateBody,
  UserUsernameUpdateBody,
  VerifyCredentials,
} from '../schema/user.schema.js';


const route: FastifyPluginAsyncTypebox = async (fastify) => {

  fastify.post('/users', {
    schema: {
      summary: 'Create a user',
      description: 'Endpoint to create a user ressources and retrieve public informations',
      tags: ['Users'],
      body: UserCreateBody,
      querystring: UserQueryGet,
      response: {
        201: ResponseSchema(UserPublicResponse, 'User created successfully'),
        409: ConflictResponse,
      }
    }
  }, async (req, rep) => {
    const user = await UserService.createUser(req.body);
    return rep.code(201).send({ message: 'User Created', data: user });
  });

  fastify.delete('/users/me', {
    schema: {
      summary: 'delete currents user',
      description: 'Endpoint to delete current user and all its ressources',
      tags: ['Users'],
      headers: UserHeaderAuthentication,
      response: {
        200: ResponseSchema(undefined, 'User deleted successfully'),
        404: NotFoundResponse,
        401: UnauthorizedResponse,
      }
    }
  }, async (req, rep) => {
    const userId = req.headers['x-user-id'];
    const delId = await UserService.deleteUser(userId);
    return rep.code(200).send({ message: `user ${delId} has been deleted` });
  });

  fastify.get('/users/:userID', {
    schema: {
      summary: 'Public information of user',
      description: 'Endpoint to retrieve public informations of a user',
      tags: ['Users'],
      params: UserParamGet,
      querystring: UserQueryGet,
      response: {
        200: ResponseSchema(UserPublicResponse, 'Ok'),
        404: NotFoundResponse,
      }
    }
  }, async (req, rep) => {
    const { id } = req.params;
    const { includePreferences } = req.query;

    const user = await UserService.getUserByID(id, includePreferences, USER_PUBLIC_COLUMNS, PREFERENCES_PUBLIC_COLUMNS);

    return rep.code(200).send({ message: 'Ok', data: user })
  });

  fastify.get('/users/me', {
    schema: {
      summary: 'Get current user private information',
      description: 'Endpoint to retrieve current user private informations',
      tags: ['Users'],
      headers: UserHeaderAuthentication,
      querystring: UserQueryGet,
      response: {
        200: ResponseSchema(UserPrivateResponse, 'Ok'),
        404: NotFoundResponse,
        401: UnauthorizedResponse,
      }
    }
  }, async (req, rep) => {
    const id = req.headers['x-user-id'];
    const { includePreferences } = req.query;

    const user = await UserService.getUserByID(id, includePreferences,
      USER_PRIVATE_COLUMNS, PREFERENCES_PRIVATE_COLUMNS);
    return rep.code(200).send({ message: 'Ok', data: user });
  });

  fastify.patch('/users/me/password', {
    schema: {
      summary: 'Update current user password',
      description: 'Endpoint to update current user password',
      tags: ['Users'],
      headers: UserHeaderAuthentication,
      body: UserPasswordUpdateBody,
      response: {
        200: ResponseSchema(undefined, 'Password updated successfully'),
        404: NotFoundResponse,
        403: ForbiddenResponse,
        401: UnauthorizedResponse,
      }
    }
  }, async (req, rep) => {
    const id = req.headers['x-user-id'];
    const { oldPassword, password } = req.body;

    const user = await UserService.updateUserPassword(id, oldPassword, password);

    return rep.code(200).send({ message: 'Password upated successfully', data: user });
  });

  fastify.patch('/users/me/email', {
    schema: {
      summary: 'Update current user email',
      description: 'Endpoint to update current user email',
      tags: ['Users'],
      headers: UserHeaderAuthentication,
      body: UserEmailUpdateBody,
      response: {
        200: ResponseSchema(UserPublicResponse, 'Email updated successfully'),
        404: NotFoundResponse,
        409: ConflictResponse,
        401: UnauthorizedResponse
      }
    }
  }, async (req, rep) => {
    const id = req.headers['x-user-id'];
    const { email } = req.body;

    const user = await UserService.updateUserEmail(id, email);

    return rep.code(200).send({ message: 'Email updated successfully', data: user });
  });

  fastify.patch('/users/me/username', {
    schema: {
      summary: 'Update current user username',
      description: 'Endpoint to update current user username',
      tags: ['Users'],
      headers: UserHeaderAuthentication,
      body: UserUsernameUpdateBody,
      response: {
        200: ResponseSchema(UserPublicResponse, 'Username updated successfully'),
        404: NotFoundResponse,
        409: ConflictResponse,
        401: UnauthorizedResponse
      }
    }
  }, async (req, rep) => {
    const id = req.headers['x-user-id'];
    const { username } = req.body;

    const user = await UserService.updateUserUsername(id, username);

    return rep.code(200).send({ message: 'Ok', data: user });
  });

  fastify.post('/users/internal/authentications', {
    schema: {
      summary: 'Verify user Credentials (Internal)',
      description: 'Endpoint to verify user credentials for internal Service use only',
      tags: ['Users'],
      body: VerifyCredentials,
      response: {
        200: ResponseSchema(UserPublicResponse, 'Credentials verified successfully'),
        401: UnauthorizedResponse,
      } // No NotFoundResponse here for security reasons 
    }
  }, async (req, rep) => {
    const { username, password } = req.body;
    console.log('password', password, 'username', username);
    const user = await UserService.verifyCredentials(username, password);
    return rep.code(200).send({ message: 'Credentials verified successfully', data: user });
  });
}

export default route;
