import { UnauthorizedError } from "@transcenduck/error";

export async function postSession(req, rep) {
  const { username, password } = req.body;

  const { refreshToken, accessToken } = await this.SessionService.createSession(username, password);

  return rep.code(201)
    .setCookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE,
      sameSite: process.env.NODE_ENV == 'production' ? 'node' : undefined,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 3 jours
    })
    .setCookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE,
      sameSite: process.env.NODE_ENV == 'production' ? 'node' : undefined,
      path: '/',
      maxAge: 60 * 15, // 15min 
    })
    .send({ message: 'Session Created' });
}

export async function deleteSession(req, rep) {
  const accessToken = req.cookies.accessToken;

  if (!accessToken) {
    throw new UnauthorizedError('Token undefined');
  }

  await this.SessionService.removeSession(accessToken);

  return rep.code(200)
    .clearCookie("accessToken", { path: '/' })
    .clearCookie("refreshToken", { path: '/' })
    .send({ message: 'Session Successfully Removed' });
}

export async function refreshSession(req, rep) {
  const oldRefreshToken = req.cookies.refreshToken;

  if (!oldRefreshToken) {
    throw new UnauthorizedError('Token undefined');
  }

  const { refreshToken, accessToken } = await this.SessionService.refreshSession(oldRefreshToken);

  return rep.code(200)
    .setCookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE,
      sameSite: process.env.NODE_ENV == 'production' ? 'node' : undefined,
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 3 jours
    })
    .setCookie("accessToken", accessToken, {
      httpOnly: true,
      secure: process.env.COOKIE_SECURE,
      sameSite: process.env.NODE_ENV == 'production' ? 'node' : undefined,
      path: '/',
      maxAge: 60 * 15, // 15min 
    })
    .send({ message: 'Session Successfully Refreshed' });
}

export async function verifyAccessToken(req, rep) {
  const accessToken = req.cookies.accessToken;
  await this.SessionService.verifyAccessToken(accessToken);
  return rep.code(200).send({ message: 'Ok' });
}

export async function verifyRefreshToken(req, rep) {
  const refreshToken = req.cookies.refreshToken;
  await this.SessionService.verifyRefreshToken(refreshToken);
  return rep.code(200).send({ message: 'Ok' });
}

