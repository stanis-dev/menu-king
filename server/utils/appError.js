class AppError extends Error {
  constructor(message, status, isError) {
    super(message);

    this.status = status;
    this.isError = isError;
    this.stack = new Error().stack;
  }
}

module.exports = AppError;
