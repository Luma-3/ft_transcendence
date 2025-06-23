import { BaseError } from '@transcenduck/error'
import { FastifyReply, FastifyRequest } from 'fastify';

type FastifyCustomError = Error & {
  validation?: any;
  statusCode: number;
  code?: string;
  details?: any;
};

export default function errorformater(err: BaseError | FastifyCustomError, _: FastifyRequest, rep: FastifyReply) {
  if (err instanceof BaseError || err.validation!) {
    return rep.status(err.statusCode).send({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
      code: err.code,
      details: err.details
    });
  }

  console.error(err);
  return rep.status(500).send({
    status: 'error',
    statusCode: 500,
    message: 'internal server error',
    code: 'int_serv_err',
  });
}
