import { BaseError } from './BaseError.js'

export class InvalidTypeError extends BaseError {
  constructor(message = 'InvalidType', details) {
    super(message, 415, 'INVALID_TYPE_ERR', details)
  }
}

export const InvalidTypeSchema = {
  $id: 'INVALID_TYPE_ERR',
  description: 'Invalid Type Error',
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['error'] },
    statusCode: { type: 'integer', description: 'HTTP status code of the response', examples: [415] },
    code: { type: 'string', description: 'Application-specific error identifier', examples: ['INVALID_TYPE_ERR'] },
    message: { type: 'string', description: 'Explanation of why request is rejected' },
  },
  required: ['status', 'message', 'statusCode', 'code']
}

