import type { ErrorObject } from 'ajv'
import { ValidationError } from '@transcenduck/error'

export default function validationFromater(errors: ErrorObject[], _: string): ValidationError {
  return new ValidationError('Validation Error', errors);
}
