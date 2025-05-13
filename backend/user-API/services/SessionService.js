import { UnauthorizedError } from "@transcenduck/error";
import { v4 as uuidv4 } from 'uuid';

export class SessionService {
  constructor({ models, utils }) {
    this.UserModel = models.UserModel;
    this.SessionModel = models.SessionModel;
    this.bcrypt = utils.bcrypt;
    this.jwt = utils.jwt;
  }

  async createSession(username, password) {
    const user = await this.UserModel.findByUsername(username, ['password', 'id'])
    if (!user) {
      throw new UnauthorizedError('Login or password incorrect');
    }

    const isMatch = await this.bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedError('Login or password incorrect');
    }

    const [{ refreshToken, jti }, accessToken] = await Promise.all([
      this.createRefreshToken(user.id),
      this.createAccessToken(user),
    ]);

    await this.SessionModel.create(user.id, jti);

    return { refreshToken, accessToken };
  }

  async removeSession(accessToken) {
    const accessTokenDecode = await this.jwt.decode(accessToken);

    this.SessionModel.delete(accessTokenDecode.userID);
  }

  async createRefreshToken(userID) {
    const jti = uuidv4();
    const refreshTokenPayload = {
      jti: jti,
      userID: userID,
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

  async refreshSession(refreshToken) {
    const decodeToken = await this.jwt.decode(refreshToken);
    const session = await this.SessionModel.findByUserID(decodeToken.userID);

    if (decodeToken.jti !== session.jti) {
      throw new UnauthorizedError('Token Revoked');
    }

    const user = await this.UserModel.findByID(decodeToken.userID);

    const [{ newRefreshToken, jti }, accessToken] = await Promise.all([
      this.createRefreshToken(user.id),
      this.createAccessToken(user),
    ]);

    console.log(jti, user);
    await this.SessionModel.update(user.id, jti);

    return { newRefreshToken, accessToken };
  }
}


