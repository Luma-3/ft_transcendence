import { ValidationError } from '@transcenduck/error'

export default function validationFromater(errors, dataVar) {
  return new ValidationError(
    'Validation Error',
    errors.map(e => ({
      why: e.keyword,
      fields: e.instancePath,
      message: e.message
    }))
  );
}
