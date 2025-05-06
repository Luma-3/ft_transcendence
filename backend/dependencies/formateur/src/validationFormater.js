export default function validationFromater(errors, dataVar) {
  return {
    status: 'error',
    statusCode: 422,
    code: 'VAL_ERR',
    message: 'Invalid input',
    details: errors.map(e => ({
      field: e.instancePath,
      message: e.message,
    })),
  }
}
