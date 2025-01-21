import CustomError from './CustomError.js';

class InternalServerError extends CustomError {
  constructor(
    message = 'Internal Server Error',
    logMessage = 'Internal Server Error'
  ) {
    super(message, logMessage, 500);
  }
}

export default InternalServerError;