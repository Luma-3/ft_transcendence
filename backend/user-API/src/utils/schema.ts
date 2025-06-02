import { Type, TSchema } from '@sinclair/typebox';

export function ResponseSchema<T extends TSchema>(schema?: T, message: string = 'Request completed successfully', status: string = 'success') {
  return Type.Object({
    status: Type.String({ default: status }),
    message: Type.String({ default: message }),
    data: schema ? schema : Type.Null(),
  }, {
    additionalProperties: false,
  });
}
