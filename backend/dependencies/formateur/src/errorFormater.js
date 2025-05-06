import { BaseError } from '@transcenduck/error'

export default async function errorFormater(err, req, rep) {
  if (err instanceof BaseError || err.validation) {
    return rep.code(err.statusCode).send({
      status: 'error',
      message: err.message,
      code: err.code,
      ...(err.details || { details: err.details })
    });
  }

  console.error(err);
  return rep.code(500).send({
    status: 'error',
    code: 'INT_SERV_ERR',
    message: 'Internal Server Error',
  });
}
