import { BaseError } from '@transcenduck/error'

export default function errorformater(err, req, rep) {

  if (err instanceof BaseError || err.validation) {
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
    statuscode: 500,
    message: 'internal server error',
    code: 'int_serv_err',
  });
}
