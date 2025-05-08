import { SessionService } from '../services/SessionService.js'

export async function postSession(req, rep) {
  const { username, password } = req.body;

  const token = SessionService.createSession(username, password);

  return rep.code(201).setCookie("token", token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE,
    sameSite: process.env.NODE_ENV == 'production' ? 'node' : undefined,
    path: '/',
    maxAge: 60 * 60 * 24 * 3, // 3 jours
  }).send({ message: 'Session Created' });
}

export async function deleteSession(req, rep) {
  // TODO:
}

export async function refreshSession(req, rep) {
  // TODO: 
}


