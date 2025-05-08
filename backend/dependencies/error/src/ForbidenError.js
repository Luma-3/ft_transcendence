import { BaseError } from './BaseError.js'

export class ForbidenError extends BaseError {
  constructor(message = 'Forbiden', details) {
    super(message, 403, 'FORBIDEN_ERR', details)
  }
}

export const ForbiddenSchema = {
  $id: 'FORBIDEN_ERR',
  description: 'Forbiden Error',
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['error'] },
    statusCode: { type: 'integer', description: 'HTTP status code of the response', examples: [403] },
    code: { type: 'string', description: 'Application-specific error identifier', examples: ['FORBIDEN_ERR'] },
    message: { type: 'string', description: 'Explanation of why access is denied' },
  },
  required: ['status', 'message', 'statusCode', 'code']
}
