import * as Controller from '../controllers/userController';
import { FastifyPluginAsync } from 'fastify';

import { ResponseSchema } from '../utils/schema';
import { ConflictResponse } from '@transcenduck/error';

import {
  UserPublicResponse,
  UserCreateBody,
  UserQueryGet,
} from '../schema/user.schema';


const route: FastifyPluginAsync = async (fastify) => {

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
  }, Controller.postUser);

  fastify.delete('/users/me', {
    schema: {
      summary: 'delete currents user',
      description: 'Endpoint to delete current user and all its ressources',
      tags: ['Users'],
      response: {
        200: ResponseSchema(undefined, 'User deleted successfully'),
        404: { $ref: 'NOT_FOUND_ERR' },
        401: { $ref: 'UNAUTHORIZED_ERR' }
      }
    }
  }, Controller.deleteUser);

  fastify.get('/users/:userID', {
    schema: {
      summary: 'Public information of user',
      description: 'Endpoint to retrieve public informations of a user',
      tags: ['Users'],
      response: {
        200: { $ref: 'userInfoPublicBase' },
        404: { $ref: 'NOT_FOUND_ERR' }
      }
    }
  }, Controller.getUser);

  fastify.get('/users/me', {
    schema: {
      summary: 'Get current user private information',
      description: 'Endpoint to retrieve current user private informations',
      tags: ['Users'],
      response: {
        200: { $ref: 'userInfoPrivateBase' },
        404: { $ref: 'NOT_FOUND_ERR' },
        401: { $ref: 'UNAUTHORIZED_ERR' }
      }
    }
  }, Controller.getMe);

  fastify.patch('/users/me/password', {
    schema: {
      summary: 'Update current user password',
      description: 'Endpoint to update current user password',
      tags: ['Users'],
      body: { $ref: 'userPasswordValidation' },
      response: {
        200: { $ref: 'userInfoPrivateBase' },
        404: { $ref: 'NOT_FOUND_ERR' },
        403: { $ref: 'FORBIDDEN_ERR' },
        401: { $ref: 'UNAUTHORIZED_ERR' }
      }
    }
  }, Controller.updateMePassword);

  fastify.patch('/users/me/email', {
    schema: {
      summary: 'Update current user email',
      description: 'Endpoint to update current user email',
      tags: ['Users'],
      body: { $ref: 'userEmailValidation' },
      response: {
        200: { $ref: 'userInfoPrivateBase' },
        404: { $ref: 'NOT_FOUND_ERR' },
        409: { $ref: 'CONFLICT_ERR' },
        401: { $ref: 'UNAUTHORIZED_ERR' }
      }
    }
  }, Controller.updateMeEmail);

  fastify.patch('/users/me/username', {
    schema: {
      summary: 'Update current user username',
      description: 'Endpoint to update current user username',
      tags: ['Users'],
      body: { $ref: 'userUsernameValidation' },
      response: {
        200: { $ref: 'userInfoPrivateBase' },
        404: { $ref: 'NOT_FOUND_ERR' },
        409: { $ref: 'CONFLICT_ERR' },
        401: { $ref: 'UNAUTHORIZED_ERR' }
      }
    }
  }, Controller.updateMeUsername);
}

export default route;
