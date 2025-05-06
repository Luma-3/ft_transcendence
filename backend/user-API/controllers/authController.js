import createSession from '../services/authService.js'
import { BadRequestError } from '@transcenduck/error'

export async function login(req, rep) {
  const { username, password } = req.body;

  if (!username || !password) {
    throw new BadRequestError("username and password are required");
  }

  const token = createSession(username, password);

  return rep.code(200).setCookie("token", token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE,
    sameSite: process.env.NODE_ENV == 'production' ? 'node' : undefined,
    path: '/',
    maxAge: 60 * 60 * 24 * 3, // 3 jours
  }).send({});
}

export async function register(req, rep) {
  const { username, password, email } = req.body;

  if (!username || !password) {
    throw new BadRequestError("username and password are required");
  }



}
