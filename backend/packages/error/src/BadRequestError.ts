import { BaseError } from './BaseError.js'
import { Type, Static } from '@sinclair/typebox'

export class BadRequestError<T = unknown> extends BaseError<T> {
  constructor(message = 'Bad Request', details?: T) {
    super(message, 400, 'BAD_REQ_ERR', details)
  }
}

export const BadRequestResponse = Type.Object({
  status: Type.Literal('error'),
  statusCode: Type.Literal(400),
  code: Type.Literal('BAD_REQ_ERR'),
  message: Type.String({ description: 'Human-readable explanation of the error' }),
  details: Type.Optional(Type.Object({
    field: Type.String(),
    issue: Type.String()
  }))
})

export type BadRequestResponseType = Static<typeof BadRequestResponse>
