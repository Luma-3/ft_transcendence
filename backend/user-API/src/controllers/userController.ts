import { FastifyRequest, FastifyReply } from 'fastify';

import {
  UserCreateBodyType,
  UserEmailUpdateBodyType,
  UserParamGetType,
  UserPasswordUpdateBodyType,
  UserQueryGetType,
  UserUsernameUpdateBodyType
} from '../schema/user.schema';

import { UserService } from '../services/userService';
import { USER_PRIVATE_COLUMNS, USER_PUBLIC_COLUMNS } from '../models/userModel';
import { PREFERENCES_PRIVATE_COLUMNS, PREFERENCES_PUBLIC_COLUMNS } from '../models/preferencesModel';

export async function postUser(
  req: FastifyRequest<{ Body: UserCreateBodyType }>, rep: FastifyReply
) {
  const user = await UserService.createUser(req.body);

  console.log(user);
  return rep.code(201).send({ message: 'User Created', data: user });
}

export async function deleteUser(
  req: FastifyRequest<{ Headers: { 'x-user-id': string } }>, rep: FastifyReply
) {
  const userId = req.headers['x-user-id'];

  const delID = await UserService.deleteUser(userId);

  return rep.code(200).send({ message: `user ${delID} has been deleted` });
}

export async function getUser(
  req: FastifyRequest<{ Params: UserParamGetType, Querystring: UserQueryGetType }>, rep: FastifyReply
) {
  const { id } = req.params;
  const { includePreferences } = req.query;

  const user = await UserService.getUserByID(id, includePreferences, USER_PUBLIC_COLUMNS, PREFERENCES_PUBLIC_COLUMNS);

  return rep.code(200).send({ message: 'Ok', data: user })
}

export async function getMe(
  req: FastifyRequest<{ Headers: { 'x-user-id': string }, Querystring: UserQueryGetType }>, rep: FastifyReply
) {
  const id = req.headers['x-user-id'];
  const { includePreferences } = req.query;

  const user = await UserService.getUserByID(id, includePreferences,
    USER_PRIVATE_COLUMNS, PREFERENCES_PRIVATE_COLUMNS);
  return rep.code(200).send({ message: 'Ok', data: user });
}

export async function updateMePassword(
  req: FastifyRequest<{ Body: UserPasswordUpdateBodyType, Headers: { 'x-user-id': string } }>, rep: FastifyReply
) {
  const id = req.headers['x-user-id'];
  const { oldPassword, password } = req.body;

  const user = await UserService.updateUserPassword(id, oldPassword, password);

  return rep.code(200).send({ message: 'Ok', data: user });
}

export async function updateMeEmail(
  req: FastifyRequest<{ Body: UserEmailUpdateBodyType, Headers: { 'x-user-id': string } }>, rep: FastifyReply
) {
  const id = req.headers['x-user-id'];
  const { email } = req.body;

  const user = await UserService.updateUserEmail(id, email);

  return rep.code(200).send({ message: 'Ok', data: user });
}

export async function updateMeUsername(
  req: FastifyRequest<{ Body: UserUsernameUpdateBodyType, Headers: { 'x-user-id': string } }>, rep: FastifyReply
) {
  const id = req.headers['x-user-id'];
  const { username } = req.body;

  const user = await UserService.updateUserUsername(id, username);

  return rep.code(200).send({ message: 'Ok', data: user });
}


