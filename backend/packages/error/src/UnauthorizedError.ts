import { BaseError } from './BaseError.js'
import { Type, Static } from '@sinclair/typebox'

export class UnauthorizedError<T = unknown> extends BaseError<T> {
  constructor(message = 'Unauthorized', details?: T) {
    super(message, 401, 'UNAUTHORIZED_ERR', details)
  }
}

export const UnauthorizedResponse = Type.Object({
  status: Type.Literal('error'),
  statusCode: Type.Literal(401),
  code: Type.Literal('UNAUTHORIZED_ERR'),
  message: Type.String({ description: 'Explanation of why authentication failed' }),
  details: Type.Optional(Type.Object({
    reason: Type.String({ description: 'Reason for unauthorized access' })
  }))
})

export type UnauthorizedResponseType = Static<typeof UnauthorizedResponse>
