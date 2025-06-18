import { BaseError } from './BaseError.js'
import { Type, Static } from '@sinclair/typebox'

export class InvalidTypeError<T = unknown> extends BaseError<T> {
  constructor(message = 'InvalidType', details?: T) {
    super(message, 415, 'INVALID_TYPE_ERR', details)
  }
}

export const InvalidTypeResponse = Type.Object({
  status: Type.Literal('error'),
  statusCode: Type.Literal(415),
  code: Type.Literal('INVALID_TYPE_ERR'),
  message: Type.String({ description: 'Explanation of why the request is rejected due to invalid type' }),
  details: Type.Optional(Type.Object({
    expectedType: Type.String({ description: 'The expected type of the input' }),
    receivedType: Type.String({ description: 'The actual type of the input received' })
  }))
})

export type InvalidTypeResponseType = Static<typeof InvalidTypeResponse>
