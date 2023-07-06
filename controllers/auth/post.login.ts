/**
 * @api {POST} /api/auth/login Login
 * @apiName Login
 * @apiGroup Auth
 * @apiVersion 0.0.1
 * @apiDescription Endpoint use to login a user 
 * @apiSuccess {Boolean} success Request success
 * @apiSuccess {Object} response User Data
 * @apiPermission anyone
 * @apiSampleRequest https://callin.onrender.com
 * @apiBody {String} email  User's email
 * @apiBody {String} password  User's password
 * @apiSuccessExample {json}
    Success-Response:
 *  HTTP/1.1 200 CREATED
 * {
    "success": true,
    "response": {
        "token": {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDljZjZlMzVlYTA1OTQ5OTZkMzZiYTYiLCJpYXQiOjE2ODgwMDg0MTksImV4cCI6MzM3NjAxNjg0NX0.dE-A_Snj93z67VbL_aoxeowif6CQQr6gTRO8ve_Fuuo"
        },
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
 * @apiError InputField Email is required
 * @apiErrorExample {json}
 * Error-Response:
 * HTTP/1.1 400 BAD REQUEST
 * {
 *  "success":false,
 *  "response":{
 *    "message": "{Field} Required"
 *  }
 * }
 */

 

import { assert } from "../../helpers/asserts";
import { IData } from "../../interfaces/index";
import { NextFunction, Request, Response } from "express";
import {
  sendFailedResponse,
  sendSuccessResponse,
} from "../../helpers/requestResponse";
import { generateTokens } from "../../helpers/auth/jwt";
import { RATE_LIMITS } from "../../constants";
import { userService } from "../../services/users";
import { passwordManager } from "../../helpers/auth/password";
const data: IData = {
  requireAuth: false,
  rules: {
    body: {
      email: {
        required: true,
      },
      password: {
        required: true,
      },
    },
  },
  requestRateLimiter: RATE_LIMITS.login,
};
async function loginHandler(req: Request, res: Response, next: NextFunction) {
  const {
    body: { email, password },
  } = req;
  try {
    const user = await userService.findOne({ email }, null, {
      permission: ["access"],
    });
    assert(!!user, "Wrong email/password combination");
    assert(
      await passwordManager.comparePassword(password, user.password),
      "Wrong email/password combination",
    );

    const tokens = await generateTokens(user);
    const response = {
      token: {
        accessToken: tokens.accessToken,
      },
      user,
    };
    res.cookie("refresh", tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      expires: new Date(Date.now() + 60 * 60 * 1000),
      sameSite: "none",
      path: "/",
    });
    sendSuccessResponse(res, next, {
      success: true,
      response,
    });
  } catch (error) {
    sendFailedResponse(res, next, error);
  }
}

export default {
  method: "post",
  url: "/api/auth/login",
  handler: loginHandler,
  data,
};
