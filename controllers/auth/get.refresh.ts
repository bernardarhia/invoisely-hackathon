/**
 * @api {GET} /api/auth/refresh Refresh
 * @apiName REFRESH
 * @apiGroup Auth
 * @apiVersion 0.0.1
 * @apiDescription Endpoint use to login a user 
 * @apiSuccess {Boolean} success Request success
 * @apiSuccess {Object} response User Data
 * @apiPermission anyone
 * @apiSampleRequest https://invoisely.onrender.com
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *  "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDljZjZlMzVlYTA1OTQ5OTZkMzZiYTYiLCJpYXQiOjE2ODgwMDg0MTksImV4cCI6MzM3NjAxNjg0NX0.dE-A_Snj93z67VbL_aoxeowif6CQQr6gTRO8ve_Fuuo"
 *
 * @apiSuccessExample {json}
    Success-Response:
 *  HTTP/1.1 200 CREATED
 * {
    "success": true,
    "response": {
        "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDljZjZlMzVlYTA1OTQ5OTZkMzZiYTYiLCJpYXQiOjE2ODgwMDg0MTksImV4cCI6MzM3NjAxNjg0NX0.dE-A_Snj93z67VbL_aoxeowif6CQQr6gTRO8ve_Fuuo",
        "user": {
            "email": "Joyce_Spencer@yahoo.com",
            "phone": {},
            "role": "admin",
            "mailingAddress": {},
            "status": "active",
            "deleted": false,
            "createdAt": "2023-06-29T03:13:39.052Z",
            "updatedAt": "2023-06-29T03:13:39.052Z",
            "id": "649cf6e35ea0594996d36ba6"
        }
    }
}
 * 
 * @apiErrorExample {json}
 * Error-Response:
 * HTTP/1.1 403 FORBIDDEN
 * {
 *  "error":true,
 *  "message": "Forbidden"
 *  
 * }
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
import Tokens from "../../database/models/Tokens";
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
    assert(!!verifyToken, "Forbidden");

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
