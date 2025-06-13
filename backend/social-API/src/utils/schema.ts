import { Type, TSchema } from '@sinclair/typebox';

export function ResponseSchema<T extends TSchema>(schema?: T, message: string = 'Request completed successfully', status: string = 'success') {
  return Type.Object({
    status: Type.Optional(Type.String({ default: status })),
    message: Type.String({ default: message }),
    data: Type.Optional(schema ? schema : Type.Null())
  }, {
    additionalProperties: false,
  });
}
