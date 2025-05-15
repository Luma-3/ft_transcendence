import { NotFoundError, UnauthorizedError } from "@transcenduck/error";
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

    const session = await this.SessionModel.findByUserID(user.id);
    if (session) {
      await this.SessionModel.delete(user.id);
    }

    await this.SessionModel.create(user.id, jti);

    return { refreshToken, accessToken };
  }

  async removeSession(accessToken) {
    const accessTokenDecode = await this.jwt.decode(accessToken);

    await this.SessionModel.delete(accessTokenDecode.userID);
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

  async refreshSession(oldRefreshToken) {
    const decodeToken = await this.jwt.decode(oldRefreshToken);
    const session = await this.SessionModel.findByUserID(decodeToken.userID);

    if (!session) {
      throw new NotFoundError('Session');
    }

    if (decodeToken.jti !== session.jti) {
      throw new UnauthorizedError('Token Revoked');
    }

    const user = await this.UserModel.findByID(decodeToken.userID);

    const [{ refreshToken, jti }, accessToken] = await Promise.all([
      this.createRefreshToken(user.id),
      this.createAccessToken(user),
    ]);

    await this.SessionModel.update(user.id, jti);

    return { refreshToken, accessToken };
  }

  async verifyAccessToken(accessToken) {
    if (!accessToken) {
      throw new UnauthorizedError('No Token');
    }

    try {
      await this.jwt.verify(accessToken);
    } catch (err) {
      throw new UnauthorizedError(err.message);
    }
  }

  async verifyRefreshToken(refreshToken) {
    if (!refreshToken) {
      throw new UnauthorizedError('No Token');
    }

    let refreshTokenDecode;
    try {
      refreshTokenDecode = this.jwt.verify(refreshToken);
    } catch (err) {
      throw new UnauthorizedError(err.message);
    }

    const session = await this.SessionModel.findByUserID(refreshTokenDecode.userID);
    if (!session) {
      throw new NotFoundError('Session');
    }

    if (refreshTokenDecode.jti !== session.jti) {
      throw new UnauthorizedError('Session revoked or invalid');
    }
  }
}

