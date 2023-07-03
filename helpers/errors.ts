import { Request, Response, NextFunction } from "express";
import { httpCodes } from "../constants";

class AppError extends Error {
  public readonly statusCode: number;
  public readonly message: string;

  constructor(statusCode?: number, message?: string) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
    this.statusCode = statusCode || httpCodes.INTERNAL_SERVER_ERROR.code;
    this.message = message || httpCodes.INTERNAL_SERVER_ERROR.message;
  }
}

class ErrorHandler {
  public static handle(
    error: AppError,
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    const { statusCode, message } = error;
    res.status(statusCode).json({
      status: "error",
      statusCode,
      message,
    });
    next();
  }
}

export { AppError, ErrorHandler };
