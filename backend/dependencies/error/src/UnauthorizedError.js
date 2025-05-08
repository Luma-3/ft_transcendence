import { BaseError } from './BaseError.js'

export class UnauthorizedError extends BaseError {
  constructor(message = 'Unauthorized', details) {
    super(message, 401, 'UNAUTHORIZED_ERR', details)
  }
}

export const UnauthorizedSchema = {
  $id: 'UNAUTHORIZED_ERR',
  description: 'Unauthorized errror',
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['error'] },
    statusCode: { type: 'integer', description: 'HTTP status code of the response', examples: [401] },
    code: { type: 'string', description: 'Application-specific error identifier', examples: ['UNAUTHORIZED_ERR'] },
    message: { type: 'string', description: 'Explanation of why authentication failed' },
  },
  required: ['status', 'message', 'statusCode', 'code']
}
