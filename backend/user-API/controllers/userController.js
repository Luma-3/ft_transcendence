import { createUser, getUserbyID } from "../services/userService.js";
import * as userSchema from '../schema/user.schema.js'

export async function postUser(req, rep) {
  const { username, password, email } = req.body;

  const user = await createUser(username, password, email);

  return rep.code(201).send({ message: 'User Created', data: user });
}

export async function deleteUser(req, rep) {

}

export async function getUser(req, rep) {
  const { userId: userID } = req.params;

  const user = await getUserbyID(userID, Object.keys(userSchema.userInfoPublic.properties)) // TODO : refacto Schema

  return rep.code(200).send({ message: 'Ok', data: user })
}

export async function getMe(req, rep) {
  const userID = req.headers['x-user-id']

  const user = await getUserbyID(userID);
  return rep.code(200).send({ message: 'Ok', data: user });
}

// export async function (req, rep) {
//
// }

