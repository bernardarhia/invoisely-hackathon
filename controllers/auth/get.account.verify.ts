/**
 * @api {get} /api/account/verify Verify Account
 * @apiName GETAuth
 * @apiGroup Auth
 *
 * 
 */
import { IData } from "../../interfaces/index";
import { NextFunction, Response } from "express";
import {
  sendFailedResponse,
  sendSuccessResponse,
} from "../../helpers/requestResponse";
import { AuthRequest } from "../../middleware";

const data: IData = {
  rules: {
    query: {
      token: {
        required: true,
      },
      type: {
        required: true,
      },
    },
  },
};
async function verifyAccountHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { token } = req.query;

    const response = {};

    sendSuccessResponse(res, next, {
      success: true,
      response,
    });
  } catch (error) {
    sendFailedResponse(res, next, error);
  }
}

export default {
  method: "get",
  url: "/api/account/verify",
  handler: verifyAccountHandler,
  data,
};
