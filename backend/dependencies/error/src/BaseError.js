export class BaseError extends Error {
  /**
   * @param {string} message  – Error Message
   * @param {number} statusCode – HTTP code
   * @param {string} code     – ID code (ex: 'USER_NOT_FOUND')
   * @param {object} [details] – Details
   */
  constructor(message, statusCode = 500, code = 'INT_SERV_ERR', details = {}) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
    Error.captureStackTrace(this, this.constructor)
  }
}
