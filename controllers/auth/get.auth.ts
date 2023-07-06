/**
 * @api {GET} /v1/auth Auth
 * @apiName AUTH
 * @apiGroup Auth
 * @apiVersion 0.0.1
 * @apiDescription Endpoint use to login a user 
 * @apiSuccess {Boolean} success Request success
 * @apiSuccess {Object} response User Data
 * @apiPermission anyone
 * @apiSampleRequest https://invoisely.onrender.com
 *  
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *     "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDljZjZlMzVlYTA1OTQ5OTZkMzZiYTYiLCJpYXQiOjE2ODgwMDg0MTksImV4cCI6MzM3NjAxNjg0NX0.dE-A_Snj93z67VbL_aoxeowif6CQQr6gTRO8ve_Fuuo"
 *
 * @apiSuccessExample {json}
    Success-Response:
 *  HTTP/1.1 200 CREATED
 * {
    "success": true,
    "response": {
        "authorized": true,
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

 * @apiErrorExample {json}
 * Error-Response:
 * HTTP/1.1 401 UNAUTHORIZED
 * {
 *  "error":true,
 *  "message": "Unauthorized"
 *  
 * }
 */

import { IData } from "../../interfaces/index";
import { NextFunction, Response } from "express";
import {
  sendFailedResponse,
  sendSuccessResponse,
} from "../../helpers/requestResponse";
import { RATE_LIMITS } from "../../constants";
import { userService } from "../../services/users";
import { AppError } from "../../helpers/errors";
import { AuthRequest } from "../../middleware";

const data: IData = {
  requestRateLimiter: RATE_LIMITS.refreshToken,
  requireAuth: true,
};
async function checkAuthHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const user = req.user;

    if (!user) return next(new AppError(401, "Unauthorized"));

    const authUser = await userService.findOne(
      { _id: user.id, deleted: false },
      { excludes: ["password"] },
    );

    if (!authUser) return next(new AppError(401, "Unauthorized"));
    const response = {
      user: authUser,
      authorized: true,
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
  url: "/auth",
  handler: checkAuthHandler,
  data,
};
