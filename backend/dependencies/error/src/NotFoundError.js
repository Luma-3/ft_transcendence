import { BaseError } from './BaseError.js'

export class NotFoundError extends BaseError {
  constructor(resource = 'Resource', details) {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERR', details)
  }
}

export const NotFoundSchema = {
  $id: 'NOT_FOUND_ERR',
  description: 'Resource not found',
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['error'] },
    statusCode: { type: 'integer', description: 'HTTP status code of the response', examples: [404] },
    code: { type: 'string', description: 'Application-specific error identifier', examples: ['NOT_FOUND_ERR'] },
    message: { type: 'string', description: 'Description of the missing resource' },
  },
  required: ['status', 'message', 'statusCode', 'code']
}
