
export class BaseError<T = unknown> extends Error {
  constructor(
    message: string,
    public statusCode = 500,
    public code = 'INT_SERV_ERR',
    public details?: T
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}
