import { BaseError } from './BaseError.js'

export class ValidationError extends BaseError {
  constructor(message = 'Validation Error', details) {
    super(message, 400, 'VALID_ERR', details);
  }
}

export const ValidationSchema = {
  $id: 'VALID_ERR',
  description: 'Validation Error',
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['error'] },
    statusCode: { type: 'integer', description: 'HTTP status code of the response', examples: [401] },
    code: { type: 'string', description: 'Application-specific error identifier', examples: ['UNAUTHORIZED_ERR'] },
    message: { type: 'string', description: 'Explanation of why Valisation Failed' },
    details: {
      type: 'array',
      items: [{
        type: 'object',
        properties: {
          why: { type: 'string', description: 'keyword why validation failed' },
          fields: { type: 'string', description: 'field name invalid' },
          message: { type: 'string', description: 'Eplanation of why field are invalid' }
        }
      }]
    }
  }
}
