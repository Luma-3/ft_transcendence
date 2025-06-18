import { BaseError } from './BaseError.js'
import { Type, Static } from '@sinclair/typebox';
import type { ErrorObject } from 'ajv';

export class ValidationError extends BaseError<ErrorObject[]> {
  constructor(message = 'Validation Error', details?: ErrorObject[]) {
    super(message, 400, 'VALID_ERR', details);
  }
}

// TODO : change for actual details formating

export const ValidationResponse = Type.Object({
  status: Type.Literal('error'),
  statusCode: Type.Literal(400),
  code: Type.Literal('VALID_ERR'),
  message: Type.String({ description: 'Explanation of why Validation Failed' }),
  details: Type.Array(Type.Object({
    why: Type.String({ description: 'keyword why validation failed' }),
    fields: Type.String({ description: 'field name invalid' }),
    message: Type.String({ description: 'Explanation of why field are invalid' })
  }))
});

export type ValidationResponseType = Static<typeof ValidationResponse>;
