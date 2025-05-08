import * as userSchema from '../schema/user.schema.js'
import * as preferencesSchema from '../schema/preferences.schema.js'
export async function postUser(req, rep) {
  const { username, password, email, preferences } = req.body;

  const user = await this.UserService.createUser(username, password, email, preferences?.lang);

  console.log(user);
  return rep.code(201).send({ message: 'User Created', data: user });
}

export async function deleteUser(req, rep) {
  const userID = req.headers['x-user-id'];

  const delID = await this.UserService.deleteUser(userID);

  return rep.code(200).send({ message: `user ${delID} has been deleted` });
}

export async function getUser(req, rep) {
  const { userID } = req.params;

  const user = await this.UserService.getUserbyID(userID, {
    user: this.extractDbKeys(userSchema.userInfoPublic),
    preferences: this.extractDbKeys(preferencesSchema.preferencesPublic)
  });

  return rep.code(200).send({ message: 'Ok', data: user })
}

export async function getMe(req, rep) {
  const userID = req.headers['x-user-id']

  const user = await this.UserService.getUserbyID(userID, {
    user: this.extractDbKeys(userSchema.userInfoPrivate),
    preferences: this.extractDbKeys(preferencesSchema.preferencesPrivate)
  });
  return rep.code(200).send({ message: 'Ok', data: user });
}

// export async function (req, rep) {
//
// }

