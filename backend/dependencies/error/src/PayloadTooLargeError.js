import { BaseError } from './BaseError.js'

export class PayloadTooLargeError extends BaseError {
  constructor(message = 'Payload Too Large', details) {
    super(message, 413, 'PAYLOAD_TOO_LARGE_ERR', details)
  }
}

export const PayloadTooLargeSchema = {
  $id: 'PAYLOAD_TOO_LARGE_ERR',
  description: 'Payload Too Large',
  type: 'object',
  properties: {
    status: { type: 'string', enum: ['error'] },
    statusCode: { type: 'integer', description: 'HTTP status code of the response', examples: [413] },
    code: { type: 'string', description: 'Application-specific error identifier', examples: ['PAYLOAD_TOO_LARGE_ERR'] },
    message: { type: 'string', description: 'Explanation of why request is rejected' },
  },
  required: ['status', 'message', 'statusCode', 'code']
}

