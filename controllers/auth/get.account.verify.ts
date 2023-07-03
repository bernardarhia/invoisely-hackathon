import { IData } from "../../interfaces/index";
import { NextFunction, Response } from "express";
import {
  sendFailedResponse,
  sendSuccessResponse,
} from "../../helpers/requestResponse";
import { userService } from "../../services/users";
import { AppError } from "../../helpers/errors";
import { AuthRequest } from "../../middleware";
import { VerifyAccountTokenType } from "../../mongoose/models/Tokens";

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
