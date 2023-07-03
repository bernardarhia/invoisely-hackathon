import { NextFunction, Response } from "express";
import { IResponseData } from "../interfaces";
import { AxiosError } from "axios";
import { httpCodes } from "../constants";

export function sendSuccessResponse(
  res: Response,
  next: NextFunction,
  data: IResponseData,
  statusCode: number = httpCodes.OK.code,
  doAfter?: Function,
): void {
  const { headers, response, success } = data;

  res.status(statusCode).send({ success, response, headers });
  if (doAfter && doAfter instanceof Function) {
    doAfter();
  }
}

export function sendFailedResponse(
  res: Response,
  next: NextFunction,
  error: Error | AxiosError,
  code?: number,
  doAfter?: Function,
): void {
  let statusCode = code || httpCodes.INTERNAL_SERVER_ERROR.code;

  res.status(statusCode).send({ error: true, response: error.message });
  if (doAfter && doAfter instanceof Function) {
    doAfter();
  }
}
