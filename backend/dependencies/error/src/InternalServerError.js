import { BaseError } from './BaseError.js'

export class InternalServerError extends BaseError {
  constructor(message = 'Internal Server Error', details) {
    super(message, 500, 'INT_SERV_ERR', details)
  }
}

export const InternalServerErrorSchema = {
  $id: 'INT_SERV_ERR',
  description: 'Internal Server error',
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['error'] },
    statusCode: { type: 'integer', description: 'HTTP status code of the response', examples: [500] },
    code: { type: 'string', description: 'Application-specific error identifier', examples: ['INT_SERV_ERR'] },
    message: { type: 'string', description: 'Generic error message for unexpected server failures' },
  },
  required: ['status', 'message', 'statusCode', 'code']
}
