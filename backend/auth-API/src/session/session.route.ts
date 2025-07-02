// import { UAParser } from "ua-parser-js";
import { UnauthorizedError } from '@transcenduck/error'
import { FastifyPluginAsyncTypebox, Type } from "@fastify/type-provider-typebox";

import { SessionPostBody, UserHeaderAuthentication, FamilyId, FamiliesResponse, twoFaBody } from "./session.schema.js";

import { SessionService } from "./session.service.js";

import { ResponseSchema } from "../utils/schema.js";
import { UAParser } from 'ua-parser-js';

const route: FastifyPluginAsyncTypebox = async (fastify) => {
  // ! Public
  fastify.post('/session', {
    schema: {
      summary: 'Create a new user session',
      description: 'This endpoint allows users to create a new session by providing their credentials.',
      tags: ['Sessions'],
      body: SessionPostBody,
      headers: Type.Object({
        "x-forwarded-for": Type.String()
      }),
      response: {
        201: ResponseSchema(undefined, 'Session created successfully')
      }
    }
  }, async (req, rep) => {
    const { username, password } = req.body;
    const userAgent = req.headers["user-agent"] ?? "unknown";
    if(userAgent === "unknown")
      throw new UnauthorizedError('User-Agent header is required');

    const parser = new UAParser(userAgent);
    const { accessToken, refreshToken } = await SessionService.login({username, password}, {
      ip_address: req.headers['x-forwarded-for'] ?? req.ip,
      // user_agent: parser.getBrowser().toString(),
      // device_id: parser.getDevice().toString(),
      user_agent: userAgent,
      device_id: parser.getOS().toString(),

    }, false);

    rep.code(201).send({
      message: 'Session created successfully',
    }).setCookie(
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
  });

  fastify.delete('/session', {
    schema: {
      summary: 'Delete current user session',
      description: 'This endpoint allows users to delete their current session.',
      tags: ['Sessions'],
      headers: UserHeaderAuthentication,
      response: {
        200: ResponseSchema(undefined, 'Session deleted successfully')
      }
    }
  }, async (req, rep) => {
    const tokenId = req.cookies.refreshToken;
    if (!tokenId) throw new UnauthorizedError();
    await SessionService.logout(tokenId);
    return rep.send({ message: 'Session deleted successfully' }).clearCookie("accessToken").clearCookie("refreshToken").redirect(`${process.env.REDIRECT_URI}`);
  });

  fastify.post('/session/2fa', {
    schema: {
      summary: 'Create a new user session after 2fa verification',
      description: 'This endpoint allows users to create a new session by providing their credentials after 2fa verification.',
      tags: ['Sessions', '2FA'],
      body: twoFaBody,
      response: {
        201: ResponseSchema(undefined, 'Session created successfully')
      }
    }
  }, async (req, rep) => {
    const { accessToken, refreshToken } = await SessionService.login2FA(req.body.code, {
      ip_address: req.ip,
      // user_agent: parser.getBrowser().toString(),
      // device_id: parser.getDevice().toString(),
      user_agent: req.headers['user-agent'] || 'unknown',
      device_id: 'unknown',
    });
    
    rep.code(201).send({
      message: 'Session created successfully',
    }).setCookie(
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
    );
  })

  // ! Private
  fastify.get('/session', {
    schema: {
      summary: 'Get current user session',
      description: 'This endpoint retrieves the current user session information.',
      tags: ['Sessions'],
      headers: UserHeaderAuthentication,
      response: {
        200: ResponseSchema(FamiliesResponse, 'Ok')
      }
    }
  }, async (req, rep) => {
    const userId = req.headers['x-user-id'];
    const families = await SessionService.getFamilies(userId);
    return rep.code(200).send({ message: 'Ok', data: families })
  });

  fastify.get('/session/:familyId', {
    schema: {
      summary: 'Get session by family ID',
      description: 'This endpoint retrieves the session information for a specific family ID.',
      tags: ['Sessions'],
      headers: UserHeaderAuthentication,
      params: FamilyId,
      response: {
        200: ResponseSchema(FamiliesResponse, 'Ok')
      }
    }
  }, async (req, rep) => {
    const familyID = req.params.familyId;
    const families = await SessionService.getFamilyById(familyID);
    return rep.code(200).send({ message: 'Ok', data: families })
  });


  // ! Private
  fastify.delete('/session/:familyId', {
    schema: {
      summary: 'Delete current user session',
      description: 'This endpoint allows users to delete their current session.',
      tags: ['Sessions'],
      headers: UserHeaderAuthentication,
      params: FamilyId,
      response: {
        200: ResponseSchema(undefined, 'Session deleted successfully')
      }
    }
  }, async (req, rep) => {
    const familyID = req.params.familyId;
    await SessionService.deleteFamily(familyID);
    rep.code(200).send({ message: 'Session deleted successfully' })
  });

  // ! Public ( TODO Move )
  fastify.get('/session/accessToken', {
    schema: {
      summary: 'Verify Access token',
      description: 'This endpoint retrieves the access token from the cookies.',
      tags: ['Sessions'],
      headers: UserHeaderAuthentication,
      response: {
        200: ResponseSchema(undefined, 'Still eating cookies')
      }
    }
  }, async (_, rep) => {
    rep.code(200).send({ message: 'Still eating cookies' });
  });


  // ! Public ( TODO Move )
  // fastify.get('session/refreshToken', {
  //   schema: {
  //     summary: 'Verify Refresh token',
  //     description: 'This endpoint retrieves the refresh token from the cookies.',
  //     tags: ['Sessions'],
  //     headers: UserHeaderAuthentication,
  //     response: {
  //       200: ResponseSchema(undefined, 'Still eating cookies')
  //     }
  //   }
  // }, async (_, rep) => {
  //   rep.code(200).send({message: 'Still eating cookies'});
  // });

  fastify.put('/session', {
    schema: {
      summary: 'Update current user session and Token',
      description: 'This endpoint allows users to update their current session tokens.',
      tags: ['Sessions'],
      response: {
        200: ResponseSchema(undefined, 'Session updated successfully')
      }
    },
  }, async (req, rep) => {
    const tokenId = req.cookies.refreshToken;
    if (!tokenId) throw new UnauthorizedError();

    const { accessToken, refreshToken } = await SessionService.refreshToken(tokenId);


    rep.code(200)
      .send({ message: 'Session updated successfully' })
      .setCookie(
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
      );
  })

}

export default route;
