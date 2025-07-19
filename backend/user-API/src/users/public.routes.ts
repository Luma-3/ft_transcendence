import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import { UserService } from './service.js';

import { USER_PRIVATE_COLUMNS, USER_PUBLIC_COLUMNS } from './model.js';
import { PREFERENCES_PRIVATE_COLUMNS, PREFERENCES_PUBLIC_COLUMNS } from '../preferences/model.js';

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
  UsersQueryGetAll
} from './schema.js';
import { SearchResponseSchema } from '../search/schema.js';
import { UserStatus } from '../preferences/status.js';

// ======================= ROUTE DEFINITION =======================
const route: FastifyPluginAsyncTypebox = async (fastify) => {

  // ---------- GET ALL USERS ----------
  fastify.get('/users', {
    schema: {
      summary: 'Get all users (public)',
      description: 'Endpoint to retrieve all users public informations with options to filter by blocked, friends, pending status and hydration',
      tags: ['Users', 'Search'],
      headers: UserHeaderAuthentication,
      querystring: UsersQueryGetAll,
      response: {
        201: ResponseSchema(SearchResponseSchema, 'All User result for the given query'),
        409: ConflictResponse,
      }
    }
  }, async (req, rep) => {
    const userId = req.headers['x-user-id'];
    const { blocked, friends, pending, page = 1, limit = 10, hydrate } = req.query;
    const users = await UserService.getAllUsers(userId, blocked, friends, pending, page, limit, hydrate);
    return rep.code(200).send({
      message: 'All User result for the given query', data: {
        page,
        limit,
        total: users.length,
        users: users.map(user => ({
          ...user,
          online: UserStatus.isUserOnline(user.id)
        }))
      }
    });
  });

  // ---------- GET USER BY ID ----------
  fastify.get('/users/:id', {
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
    return rep.code(200).send({ message: 'Ok', data: { ...user, online: UserStatus.isUserOnline(id) } })
  });

  // ---------- GET CURRENT USER ----------
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

    let data;
    try {
      data = await UserService.getUserByID(id, includePreferences,
        USER_PRIVATE_COLUMNS, PREFERENCES_PRIVATE_COLUMNS, true);
    }
    catch (error) {
      rep.clearCookie('accessToken').clearCookie('refreshToken');
      throw error;
    }
    return rep.code(200).send({ message: 'Ok', data: data });
  });

  // ---------- CREATE USER ----------
  fastify.post('/users', {
    schema: {
      summary: 'Create a user',
      description: 'Endpoint to create a user ressources and retrieve public informations',
      tags: ['Users'],
      body: UserCreateBody,
      querystring: UserQueryGet,
      response: {
        200: ResponseSchema(),
        409: ConflictResponse,
      }
    }
  }, async (req, rep) => {
    await UserService.createUser(req.body);
    return rep.code(200).send({ message: 'User created successfully, verification email sent' });
  });

  // ---------- DELETE CURRENT USER ----------
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
    return rep.code(200).send({ message: `user ${delId} has been deleted` }).clearCookie('accessToken').clearCookie('refreshToken');
  });

  // ---------- UPDATE PASSWORD ----------
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

  // ---------- UPDATE EMAIL ----------
  fastify.patch('/users/me/email', {
    schema: {
      summary: 'Update current user email',
      description: 'Endpoint to update current user email',
      tags: ['Users'],
      headers: UserHeaderAuthentication,
      body: UserEmailUpdateBody,
      response: {
        200: ResponseSchema(),
        404: NotFoundResponse,
        409: ConflictResponse,
        401: UnauthorizedResponse
      }
    }
  }, async (req, rep) => {
    const id = req.headers['x-user-id'];
    const { email } = req.body;

    await UserService.updateUserEmail(id, email);

    return rep.code(200).send({ message: 'Email verification sent' });
  });

  // ---------- UPDATE USERNAME ----------
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

}
// ======================= END ROUTE DEFINITION =======================

export default route;
