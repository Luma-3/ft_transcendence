import { BaseError } from './BaseError.js'
import { Type, Static } from '@sinclair/typebox'

export class NotFoundError<T = unknown> extends BaseError<T> {
  constructor(resource = 'Resource', details?: T) {
    super(`${resource} not found`, 404, 'NOT_FOUND_ERR', details)
  }
}

export const NotFoundResponse = Type.Object({
  status: Type.Literal('error'),
  statusCode: Type.Literal(404),
  code: Type.Literal('NOT_FOUND_ERR'),
  message: Type.String({ description: 'Description of the missing resource' }),
  details: Type.Optional(Type.Object({
    resource: Type.String({ description: 'Name of the missing resource' }),
    id: Type.Optional(Type.String({ description: 'ID of the missing resource' }))
  }))
})

export type NotFoundResponseType = Static<typeof NotFoundResponse>
