import { FastifyRequest, FastifyReply } from "fastify";

import { Oauth2Service } from "./oauth2.service.js";
import { QueryCallbackType } from "./oauth2.schema.js";
import { SessionService } from "../session/session.service.js";
import { UnauthorizedError } from "@transcenduck/error";
export class Oauth2Controller {
  static getAuthorizationUrl = async (_: FastifyRequest, rep: FastifyReply) => {
    const authorizationUrl = Oauth2Service.getGoogleAuthUrl();
    rep.redirect(authorizationUrl);
  }

  static callback = async (req: FastifyRequest<{ Querystring: QueryCallbackType }>, rep: FastifyReply) => {
    const query = req.query;
    const dataUser = await Oauth2Service.callback(query);
    if(!dataUser.data)
      throw new UnauthorizedError('No user data returned from OAuth2 callback');

    const { accessToken, refreshToken } = await SessionService.login(dataUser.data.id, undefined, {
      ip_address: req.ip,
      // user_agent: parser.getBrowser().toString(),
      // device_id: parser.getDevice().toString(),
      user_agent: req.headers['user-agent'] || 'unknown',
      device_id: 'unknown',
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
    }
    ).redirect(`${process.env.REDIRECT_URI}/dashboard`);
  }
}

