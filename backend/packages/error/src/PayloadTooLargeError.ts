import { Type } from '@sinclair/typebox'
import { BaseError } from './BaseError.js'
import { Static } from '@sinclair/typebox'

export class PayloadTooLargeError extends BaseError {
  constructor(message = 'Payload Too Large') {
    super(message, 413, 'PAYLOAD_TOO_LARGE_ERR')
  }
}

export const PayloadTooLargeResponse = Type.Object({
  status: Type.Literal('error'),
  statusCode: Type.Literal(413),
  code: Type.Literal('PAYLOAD_TOO_LARGE_ERR'),
  message: Type.String({ description: 'Explanation of why request is rejected' })
})

export type PayloadTooLargeType = Static<typeof PayloadTooLargeResponse>;
