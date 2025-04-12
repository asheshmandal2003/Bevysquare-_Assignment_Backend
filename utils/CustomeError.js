class CustomError extends Error {
  /**
   * @param {string} message - The error message.
   * @param {number} statusCode - The HTTP status code.
   * @memberof CustomError
   */
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
  /**
   * @returns {Object} - The error object.
   * @memberof CustomError
   */
  getError() {
    return {
      status: this.statusCode,
      message: this.message,
    };
  }
}

module.exports = CustomError;
