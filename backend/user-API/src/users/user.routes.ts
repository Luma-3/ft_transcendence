import { FastifyPluginAsyncTypebox, Type } from '@fastify/type-provider-typebox';

import { UserService } from './user.service.js';

import { USER_PRIVATE_COLUMNS, USER_PUBLIC_COLUMNS } from './user.model.js';
import { PREFERENCES_PRIVATE_COLUMNS, PREFERENCES_PUBLIC_COLUMNS } from '../preferences/preferences.model.js';

import { ResponseSchema } from '../utils/schema.js';
import {
  ConflictResponse,
  NotFoundResponse,
  UnauthorizedResponse,
  ForbiddenResponse,
  InternalServerErrorResponse
} from '@transcenduck/error';

import {
  UserPublicResponse,
  UserPrivateResponse,
  UserCreateBody,
  UserCreateBodyInternal,
  UserQueryGet,
  UserHeaderAuthentication,
  UserParamGet,
  UserPasswordUpdateBody,
  UserEmailUpdateBody,
  UserUsernameUpdateBody,
  VerifyCredentials,
  UsersQueryGetAll,
  User2faStatus,
  User2faInfos,
  UserActivateAccountParams,
  UserCreateRedis
} from './user.schema.js';
import { SearchResponseSchema } from '../search/search.schema.js';


const route: FastifyPluginAsyncTypebox = async (fastify) => {

  fastify.post('/users', {
    schema: {
      summary: 'Create a user',
      description: 'Endpoint to create a user ressources and retrieve public informations',
      tags: ['Users'],
      body: UserCreateBody,
      querystring: UserQueryGet,
      response: {
        200: ResponseSchema(UserPublicResponse, 'User created successfully, verification email sent successfully'),
        409: ConflictResponse,
      }
    }
  }, async (req, rep) => {
    const user = await UserService.createUser(req.body);
    return rep.code(200).send({ message: 'User Created, verification email sent', data: user });
  });

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

  fastify.post('/internal/createUser', {
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
    const {blocked, friends, pending, page = 1, limit = 10, hydrate} = req.query;
    const users = await UserService.getAllUsers(userId, blocked, friends, pending, page, limit, hydrate);
    return rep.code(200).send({ message: 'All User result for the given query', data: {
                page,
                limit,
                total: users.length,
                users
            } });
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
    return rep.code(200).send({ message: `user ${delId} has been deleted` }).clearCookie('accessToken').clearCookie('refreshToken');
  });

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
    return rep.code(200).send({ message: 'Ok', data: user })
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
        200: ResponseSchema(UserPrivateResponse, 'Credentials verified successfully'),
        401: UnauthorizedResponse,
      } // No NotFoundResponse here for security reasons 
    }
  }, async (req, rep) => {
    const { username, password } = req.body;
    const user = await UserService.verifyCredentials(username, password);
    return rep.code(200).send({ message: 'Credentials verified successfully', data: user });
  });

  fastify.post('/users/internal/oauth2', {
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
      console.log(user);
      return rep.code(201).send({ message: 'User created from OAuth2', data: user });
    }

    return rep.code(201).send({ message: 'User created from OAuth2', data: find });
  });

  // ========================= 2FA Routes ========================

  fastify.patch('/users/internal/activeAccount/:email', {
    schema: {
      summary: 'Active account of a user',
      description: 'Endpoint to activate user account after verifying his e-mail',
      tags: ['2FA'],
      params: UserActivateAccountParams,
      response: {
        200: ResponseSchema(User2faStatus, 'Ok')
      }
    }
  }, async (req, rep) => {
    const email = req.params.email;
    await UserService.activateUserAccount(email);
    return rep.code(200).send({ message: 'Ok' });
  })

  fastify.get('/users/2fa', {
    schema: {
      summary: 'Get 2fa infos for a user',
      description: 'Endpoint to get the 2 Factor Authentification informations',
      tags: ['2FA'],
      headers: UserHeaderAuthentication,
      response: {
        200: ResponseSchema(User2faStatus, 'Ok')
      }
    }
  }, async(req, rep) => {
    const userId = req.headers['x-user-id'];
    const twoFaStatus = await UserService.get2faStatus(userId);
    return rep.code(200).send({ message: 'Ok', data: twoFaStatus });
  });

  fastify.put('/users/2fa', {
    schema: {
      summary: 'Start enable 2fa for a user',
      description: 'Endpoint to start enablation of 2 Factor Authentification',
      tags: ['2FA'],
      headers: UserHeaderAuthentication,
      response: {
        200: ResponseSchema(),
        500: InternalServerErrorResponse
      }
    }
  }, async(req, rep) => {
    const userId = req.headers['x-user-id'];
    await UserService.enable2FA(userId);
    return rep.code(200).send({ message: "waiting for validation" });
  });

  fastify.delete('/users/2fa', {
    schema: {
      summary: 'Start disable 2fa for a user',
      description: 'Endpoint to start disablation of 2 Factor Authentification',
      tags: ['2FA'],
      headers: UserHeaderAuthentication,
      response: {
        200: ResponseSchema(),
        500: InternalServerErrorResponse
      }
    }
  }, async(req, rep) => {
    const userId = req.headers['x-user-id'];
    await UserService.disable2FA(userId);
    return rep.code(200).send({ message: "waiting for validation" });
  });

  fastify.patch('/internal/users/2fa/activate', {
    schema: {
      summary: 'Disable 2fa for a user',
      description: 'Endpoint to disable the 2 Factor Authentification',
      tags: ['2FA'],
      body: UserCreateRedis,
      response: {
        200: ResponseSchema()
      }
    }
  }, async(req, rep) => {
    const message = await UserService.update2FA(req.body.userID);
    return rep.code(200).send({ message: message })
  })

}

export default route;
