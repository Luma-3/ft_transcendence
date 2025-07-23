import { FastifyRequest, FastifyReply } from "fastify";

import { Oauth2Service } from "./service.js";
import { QueryCallbackType } from "./schema.js";
import { SessionService } from "../session/service.js";
import { TwoFaError, UnauthorizedError } from "@transcenduck/error";
import { UAParser } from "ua-parser-js";
export class Oauth2Controller {
  static getAuthorizationUrl = async (_: FastifyRequest, rep: FastifyReply) => {
    const authorizationUrl = Oauth2Service.getGoogleAuthUrl();
    rep.redirect(authorizationUrl);
  }

  static callback = async (req: FastifyRequest<{ Querystring: QueryCallbackType, Headers: { 'x-forwarded-for': string } }>, rep: FastifyReply) => {
    const query = req.query;
    const dataUser = await Oauth2Service.callback(query);
    if (!dataUser.email || !dataUser.name)
      throw new UnauthorizedError('No user data returned from OAuth2 callback');

    const userAgent = req.headers["user-agent"] ?? "unknown";
    if (userAgent === "unknown")
      throw new UnauthorizedError('User-Agent header is required');

    const parser = new UAParser(userAgent);
    try {
      const { accessToken, refreshToken } = await SessionService.login({
        username: dataUser.name!,
        email: dataUser.email!,
        googleId: dataUser.id ?? undefined,
        avatar: dataUser.picture ?? undefined
      }, {
        ip_address: req.headers['x-forwarded-for'] ?? req.ip,
        user_agent: userAgent,
        device_id: parser.getOS().toString(),
      }, true);
      rep.setCookie(
        "accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : undefined,
        path: '/'
      }).setCookie(
        "refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: process.env.NODE_ENV === 'production' ? 'none' : undefined,
        path: '/'
      }
      ).redirect(`https://localhost:5173/dashboard`);
    } catch (error) {
      if (error instanceof TwoFaError) {
        rep.redirect(`https://localhost:5173/2FA`);
      } else {
        throw error;
      }
    }
  }
}

