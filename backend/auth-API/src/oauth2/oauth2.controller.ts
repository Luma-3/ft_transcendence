import { FastifyRequest, FastifyReply } from "fastify";

import { Oauth2Service } from "./oauth2.service.js";
import { QueryCallbackType } from "./oauth2.schema.js";
import { SessionService } from "../session/session.service.js";
import { UnauthorizedError } from "@transcenduck/error";
import { UAParser } from "ua-parser-js";
export class Oauth2Controller {
  static getAuthorizationUrl = async (_: FastifyRequest, rep: FastifyReply) => {
    const authorizationUrl = Oauth2Service.getGoogleAuthUrl();
    rep.redirect(authorizationUrl);
  }

  static callback = async (req: FastifyRequest<{ Querystring: QueryCallbackType, Headers: {'x-forwarded-for': string} }>, rep: FastifyReply) => {
    const query = req.query;
    const dataUser = await Oauth2Service.callback(query);
    if(!dataUser.email || !dataUser.name)
      throw new UnauthorizedError('No user data returned from OAuth2 callback');

    const userAgent = req.headers["user-agent"] ?? "unknown";
    if(userAgent === "unknown")
      throw new UnauthorizedError('User-Agent header is required');

    const parser = new UAParser(userAgent);
    const { accessToken, refreshToken } = await SessionService.login({
      username: dataUser.name!,
      email: dataUser.email!
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
      path: '/',
    }).setCookie(
      "refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : undefined,
      path: '/'
    }
    ).redirect(`${process.env.REDIRECT_URI}/dashboard`);
  }
}

