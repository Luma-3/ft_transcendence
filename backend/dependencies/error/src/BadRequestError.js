import { BaseError } from './BaseError.js'

export class BadRequestError extends BaseError {
  constructor(message = 'Bad Request', details) {
    super(message, 400, 'BAD_REQ_ERR', details)
  }
}

export const BadRequestSchema = {
  $id: 'BAD_REQ_ERR',
  description: 'Bad Request error',
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['error'] },
    statusCode: { type: 'integer', description: 'HTTP status code of the response', examples: [400] },
    code: { type: 'string', description: 'Application-specific error identifier', examples: ['BAD_REQ_ERR'] },
    message: { type: 'string', description: 'Human-readable explanation of the error' },
    details: {
      type: 'object',
      description: 'Additional context about validation or input errors',
      examples: [{
        field: 'email',
        issue: 'Invalid format'
      }]
    }
  },
  required: ['status', 'message', 'statusCode', 'code']
}

