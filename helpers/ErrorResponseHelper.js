import BadRequestError from "../error/BadRequestError.js";
import CustomError from "../error/CustomError.js";
import InternalServerError from "../error/InternalServerError.js";
import LoggerHelper from "./LoggerHelper.js";

export default {
    handleError: (error, res) => {
        if (error instanceof CustomError)
            LoggerHelper.logger.error(`CustomError: ${error.logMessage}`);
        else if (error instanceof BadRequestError)
            LoggerHelper.logger.error(`BadRequestError: ${error.logMessage}`);
        else if (error instanceof InternalServerError)
            LoggerHelper.logger.error(`InternalServerError: ${error.logMessage}`);
        else
            res.status(500).json({ "message": "Unhandled Error" })
        res.status(error.statusCode).json({ "message": error.message })
    }
}