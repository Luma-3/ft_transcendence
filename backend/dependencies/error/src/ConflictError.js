import { BaseError } from './BaseError.js'

export class ConflictError extends BaseError {
  constructor(message = 'Conflict', details) {
    super(message, 409, 'CONFLICT_ERR', details)
  }
}

export const ConflictSchema = {
  $id: 'CONFLICT_ERR',
  description: 'Conflict error',
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['error'] },
    statusCode: { type: 'integer', description: 'HTTP status code of the response', examples: [409] },
    code: { type: 'string', description: 'Application-specific error identifier', examples: ['CONFLICT_ERR'] },
    message: { type: 'string', description: 'Explanation of the conflict (e.g. duplicate resource)' },
    details: {
      type: 'object',
      description: 'Additional information about the conflict',
      examples: [{
        field: 'username',
        conflict: 'Already taken'
      }]
    }
  },
  required: ['status', 'message', 'statusCode', 'code']
}
