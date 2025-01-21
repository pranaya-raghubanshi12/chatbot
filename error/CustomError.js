class CustomError extends Error {
    statusCode;
    logMessage;
  
    constructor(message, logMessage, statusCode = 500) {
      super(message);
      this.statusCode = statusCode;
      this.logMessage = logMessage;
      this.name = this.constructor.name;
  
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, this.constructor);
      }
    }
  }
  
  export default CustomError;