import { UnauthorizedError } from "@transcenduck/error";
import { v4 as uuidv4 } from 'uuid';

export class SessionService {
  constructor({ models, utils }) {
    this.UserModel = models.UserModel;
    this.SessionModel = models.SessionModel;
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

    const [{ refreshToken, jti }, accessToken] = await Promise.all([
      this.createRefreshToken(user.id),
      this.createAccessToken(user),
    ]);

    await this.SessionModel.create(user.id, jti);

    return { refreshToken, accessToken };
  }

  async removeSession(userID) {
    this.SessionModel.delete(userID);
  }

  async createRefreshToken(userID) {
    const jti = uuidv4();
    const refreshTokenPayload = {
      jti: jti,
      udserID: userID,
    }

    const refreshTokenOpts = this.jwt.options;
    refreshTokenOpts.expirsIn = '7d';
    const refreshToken = this.jwt.sign(refreshTokenPayload, refreshTokenOpts);

    return { refreshToken, jti };
  }

  async createAccessToken(user) {
    const accessTokenPayload = {
      userID: user.id,
      username: user.username,
      email: user.email,
    }

    const accessTokenOpts = this.jwt.options;
    accessTokenOpts.expiresIn = '15m';
    const accessToken = this.jwt.sign(accessTokenPayload, accessTokenOpts);

    return accessToken;
  }


}


