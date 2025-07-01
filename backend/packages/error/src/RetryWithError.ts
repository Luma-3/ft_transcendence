import { BaseError } from './BaseError.js'
import { Type, Static } from '@sinclair/typebox'

export class RetryWithError<T = unknown> extends BaseError<T> {
  constructor(message = 'Retry With', details?: T) {
    super(message, 449, 'RETRY_WITH_ERR', details)
  }
}

export const RetryWithResponse = Type.Object({
  status: Type.Literal('error'),
  statusCode: Type.Literal(449),
  code: Type.Literal('RETRY_WITH_ERR'),
  message: Type.String({ description: 'Explanation of why authentication failed' }),
  details: Type.Optional(Type.Object({
    reason: Type.String({ description: 'Reason for unauthorized access' })
  }))
})

export type RetryWithResponseType = Static<typeof RetryWithResponse>
