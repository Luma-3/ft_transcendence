import { BaseError } from './BaseError.js'
import { Type, Static } from '@sinclair/typebox'

export class ConflictError<T = unknown> extends BaseError<T> {
  constructor(message = 'Conflict', details?: T) {
    super(message, 409, 'CONFLICT_ERR', details)
  }
}


export const ConflictResponse = Type.Object({
  status: Type.Literal('error'),
  statusCode: Type.Literal(409),
  code: Type.Literal('CONFLICT_ERR'),
  message: Type.String({ description: 'Explanation of the conflict (e.g. duplicate resource)' }),
  details: Type.Optional(Type.Object({
    field: Type.String(),
    conflict: Type.String()
  }))
});

export type ConflictResponseType = Static<typeof ConflictResponse>;
