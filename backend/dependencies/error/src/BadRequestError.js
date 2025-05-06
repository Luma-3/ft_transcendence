import { BaseError } from './BaseError.mjs'

export class BadRequestError extends BaseError {
  constructor(message = 'Bad Request', details) {
    super(message, 400, 'BAD_REQ_ERR', details)
  }
}

export const BadRequestSchema = {
  $id: 'BAD_REQ_ERR',
  type: 'object',
  properties: {
    message: { type: 'string', description: 'Human-readable explanation of the error' },
    statusCode: { type: 'integer', description: 'HTTP status code of the response', examples: [400] },
    code: { type: 'string', description: 'Application-specific error identifier', examples: ['BAD_REQ_ERR'] },
    details: {
      type: 'object',
      description: 'Additional context about validation or input errors',
      examples: [{
        field: 'email',
        issue: 'Invalid format'
      }]
    }
  }
}

