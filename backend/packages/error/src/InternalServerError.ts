import { BaseError } from './BaseError.js'
import { Type, Static } from '@sinclair/typebox'

export class InternalServerError<T = unknown> extends BaseError<T> {
  constructor(message = 'Internal Server Error', details?: T) {
    super(message, 500, 'INT_SERV_ERR', details)
  }
}

export const InternalServerErrorResponse = Type.Object({
  status: Type.Literal('error'),
  statusCode: Type.Literal(500),
  code: Type.Literal('INT_SERV_ERR'),
  message: Type.String({ description: 'Generic error message for unexpected server failures' }),
  details: Type.Optional(Type.Object({
  }))
})

export type InternalServerErrorResponseType = Static<typeof InternalServerErrorResponse>
