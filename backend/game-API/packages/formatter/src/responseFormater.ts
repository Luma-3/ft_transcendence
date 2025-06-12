import { InternalServerError } from '@transcenduck/error'
import { FastifyReply, FastifyRequest } from 'fastify';

export default async function responseFormater(_: FastifyRequest, __: FastifyReply, payload: any) {

  if (typeof payload === 'object' && (payload?.swagger || payload?.status || payload?.openapi)) {
    return payload;
  }

  const isValid = (typeof payload === 'object' && payload !== null);

  if (isValid) {
    return {
      status: 'success',
      message: payload?.message || 'OK',
      data: payload.data,
      ...(payload.meta && { meta: payload.meta }),
    }
  }

  throw new InternalServerError('Format Response not respected', {
    info: "Payload must be a non-null object (e.g. { message, data })"
  });
};
