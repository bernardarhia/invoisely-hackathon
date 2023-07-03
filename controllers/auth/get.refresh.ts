/**
 * @api {get} /api/auth/refresh Get refresh token
 * @apiName GETRefreshToken
 * @apiGroup Auth
 *
 * 
 */

import { assert } from "../../helpers/asserts";
import { IData } from "../../interfaces/index";
import { NextFunction, Request, Response } from "express";
import {
  sendFailedResponse,
  sendSuccessResponse,
} from "../../helpers/requestResponse";
import { TokenService } from "../../helpers/auth/jwt";
import { RATE_LIMITS } from "../../constants";
import { userService } from "../../services/users";
import Tokens from "../../mongoose/models/Tokens";
import { AppError } from "../../helpers/errors";

const data: IData = {
  requestRateLimiter: RATE_LIMITS.refreshToken,
};
async function refreshTokenHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const cookies = req.cookies;
    if (!cookies?.refresh) return next(new AppError(403, "Forbidden"));
    const refreshToken = cookies.refresh;

    const token = await Tokens.findOne({ tokens: { refreshToken } });
    if (!token) return next(new AppError(403, "Forbidden"));

    const verifyToken = TokenService.verifyRefreshToken(refreshToken);
    assert(!!verifyToken, "Forbidden 2");

    const user = await userService.findOne(
      { _id: token.userId },
      { excludes: ["password"] },
    );
    assert(!!user || user.email === verifyToken.email, "Forbidden");

    const { id } = user;
    const accessToken = TokenService.createAccessToken({ id });

    const response = {
      accessToken,
      user,
    };
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
  url: "/api/auth/refresh",
  handler: refreshTokenHandler,
  data,
};
