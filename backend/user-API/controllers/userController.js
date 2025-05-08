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

export async function updateMePassword(req, rep) {
  const userID = req.headers['x-user-id'];
  const { oldPassword, password } = req.body;

  const user = await this.UserService.updateUserPassword(userID, oldPassword, password, {
    user: this.extractDbKeys(userSchema.userInfoPrivate),
    preferences: this.extractDbKeys(preferencesSchema.preferencesPrivate)
  });

  return rep.code(200).send({ message: 'Ok', data: user });
}

export async function updateMeEmail(req, rep) {
  const userID = req.headers['x-user-id'];
  const { email } = req.body;

  const user = await this.UserService.updateUserEmail(userID, email, {
    user: this.extractDbKeys(userSchema.userInfoPrivate),
    preferences: this.extractDbKeys(preferencesSchema.preferencesPrivate)
  });

  return rep.code(200).send({ message: 'Ok', data: user });
}

export async function updateMeUsername(req,rep) {
  const userID = req.headers['x-user-id'];
  const { username } = req.body;

  const user = await this.UserService.updateUserUsername(userID, username, {
    user: this.extractDbKeys(userSchema.userInfoPrivate),
    preferences: this.extractDbKeys(preferencesSchema.preferencesPrivate)
  });
  return rep.code(200).send({ message: 'Ok', data: user });
}


