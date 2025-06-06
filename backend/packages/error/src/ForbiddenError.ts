import { BaseError } from './BaseError.js'
import { Type, Static } from '@sinclair/typebox'

export class ForbiddenError<T = unknown> extends BaseError<T> {
  constructor(message = 'Forbiden', details?: T) {
    super(message, 403, 'FORBIDDEN_ERR', details)
  }
}

export const ForbiddenResponse = Type.Object({
  status: Type.Literal('error'),
  statusCode: Type.Literal(403),
  code: Type.Literal('FORBIDDEN_ERR'),
  message: Type.String({ description: 'Explanation of why access is denied' }),
  details: Type.Optional(Type.Object({
    field: Type.String(),
    reason: Type.String()
  }))
})

export type ForbiddenResponseType = Static<typeof ForbiddenResponse>
