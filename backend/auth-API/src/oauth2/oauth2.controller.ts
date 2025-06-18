import { FastifyRequest, FastifyReply } from "fastify";

import { Oauth2Service } from "./oauth2.service.js";
import { QueryCallbackType } from "./oauth2.schema.js";

export class Oauth2Controller {
  static getAuthorizationUrl = async (_: FastifyRequest, rep: FastifyReply) => {
    const authorizationUrl = Oauth2Service.getGoogleAuthUrl();
    rep.redirect(authorizationUrl);
  }

  static callback = async (req: FastifyRequest<{ Querystring: QueryCallbackType }>, rep: FastifyReply) => {
    const query = req.query;
    const { tokens } = await Oauth2Service.callback(query);

    rep.send({ message: "OAuth2 callback successful" });
  }
}

