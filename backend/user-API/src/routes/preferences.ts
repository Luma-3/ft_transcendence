import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

import { PreferencesService } from '../services/preferencesService.js';
import { PREFERENCES_PRIVATE_COLUMNS, PREFERENCES_PUBLIC_COLUMNS } from '../models/preferencesModel.js';

import { PreferencesGetType, PreferencesPublicResponse } from '../schema/preferences.schema.js';

import { ResponseSchema } from '../utils/schema.js';
import {
  NotFoundResponse,
  UnauthorizedResponse,
} from '@transcenduck/error';

import { UserHeaderAuthentication } from '../schema/user.schema.js';
import { PreferencesUpdateBody } from '../schema/preferences.schema.js';
import { updateAvatarPreferences, updateBannerPreferences } from '../controllers/preferencesController.js';


const route: FastifyPluginAsyncTypebox = async (fastify) => {

  fastify.get('/users/me/preferences', {
    schema: {
      summary: 'Get current user preferences',
      description: 'Endpoint to retrieve current user preferences',
      headers: UserHeaderAuthentication,
      tags: ['Preferences'],
      response: {
        200: ResponseSchema(PreferencesPublicResponse, 'Ok'),
        401: UnauthorizedResponse,
      }
    }
  }, async (req, rep) => {
    const user_id = req.headers['x-user-id'];
    const preferences = await PreferencesService.getPreferences(user_id, PREFERENCES_PRIVATE_COLUMNS);
    return rep.code(200).send({ message: 'Ok', data: preferences });
  });

  fastify.patch('/users/me/preferences', {
    schema: {
      summary: 'Update current user preferences',
      description: 'Endpoint to update current user preferences',
      tags: ['Preferences'],
      headers: UserHeaderAuthentication,
      response: {
        200: ResponseSchema(PreferencesPublicResponse, 'Preferences updated successfully'),
        401: UnauthorizedResponse,
      }
    }
  }, async (req, rep) => {
    const user_id = req.headers['x-user-id'];
    const preferences = await PreferencesService.updatePreferences(user_id, req.body, PREFERENCES_PRIVATE_COLUMNS);
    return rep.code(200).send({ message: 'Preferences updated successfully', data: preferences });
  });

  fastify.patch('/users/me/preferences/avatar', {
    schema: {
      summary: 'Update current user avatar preferences',
      description: 'Endpoint to update current user avatar preferences',
      tags: ['Preferences'],
      headers: UserHeaderAuthentication,
      response: {
        200: ResponseSchema(PreferencesPublicResponse, 'Ok'),
      }
    }
  }, updateAvatarPreferences);

  fastify.patch('/users/me/preferences/banner', {
    schema: {
      summary: 'Update current user banner preferences',
      description: 'Endpoint to update current user banner preferences',
      tags: ['Preferences'],
      headers: UserHeaderAuthentication,
      response: {
        200: ResponseSchema(PreferencesPublicResponse, 'Ok'),
      }
    }
  }, updateBannerPreferences );  


  fastify.get('/users/:userID/preferences', {
    schema: {
      summary: 'Get user preferences',
      description: 'Endpoint to retrieve user preferences',
      tags: ['Preferences'],
      params: PreferencesGetType,
      response: {
        200: ResponseSchema(PreferencesPublicResponse, 'Ok'),
        404: NotFoundResponse
      }
    }
  }, async (req, rep) => {
    const { user_id } = req.params;
    const preferences = await PreferencesService.getPreferences(user_id, PREFERENCES_PUBLIC_COLUMNS);
    return rep.code(200).send({ message: 'Ok', data: preferences });
  });
}

export default route;
