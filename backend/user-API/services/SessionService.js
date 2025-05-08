import { UnauthorizedError } from "@transcenduck/error";

export class SessionService {
  constructor({ models, utils }) {
    this.UserModel = models.UserModel;
    this.bcrypt = utils.bcrypt;
  }

  async createSession(username, password) {
    const user = await this.UserModel.findByUsername(username,)
    if (!user) {
      throw UnauthorizedError('Login or password incorrect');
    }

    const isMatch = await this.bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw UnauthorizedError('Login or password incorrect');
    }

    const userPayload = {
      id: user.id,
      username: username,
      email: user.email
    }

    return this.jwt.sign(userPayload, this.jwt.options.sign);
  }

  async removeSession() {
    // TODO : Redis or Sqlite for invalid token 
  }

}


