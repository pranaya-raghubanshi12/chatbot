import CustomError from './CustomError.js';

class BadRequestError extends CustomError {
  constructor(
    message = 'Bad Request Error',
    logMessage = 'Bad Request Error'
  ) {
    super(message, logMessage, 400);
  }
}

export default BadRequestError;