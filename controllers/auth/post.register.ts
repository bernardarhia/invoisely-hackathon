/**
 * @api {POST} /api/auth/register Register
 * @apiName Register
 * @apiGroup Auth
 * @apiVersion 0.0.1
 * @apiDescription Endpoint use to register a new client 
 * @apiSuccess {Boolean} success Request success
 * @apiSuccess {Object} response User Data
 * @apiPermission anyone
 * @apiSampleRequest https://callin.onrender.com
 * @apiBody {String} email  User's email
 * @apiBody {String} password  User's password
 * @apiBody {String} role  Role of the user
 * @apiSuccessExample {json}
    Success-Response:
 *  HTTP/1.1 201 CREATED
 * {
    "success": true,
    "response": {
        "token": {
            "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDljZjZlMzVlYTA1OTQ5OTZkMzZiYTYiLCJpYXQiOjE2ODgwMDg0MTksImV4cCI6MzM3NjAxNjg0NX0.dE-A_Snj93z67VbL_aoxeowif6CQQr6gTRO8ve_Fuuo"
        },
        "createdUser": {
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
import { IData } from "../../interfaces";
import { NextFunction, Request, Response } from "express";
import {
  sendFailedResponse,
  sendSuccessResponse,
} from "../../helpers/requestResponse";
import { generateTokens } from "../../helpers/auth/jwt";
import { RATE_LIMITS, httpCodes } from "../../constants";
import { createUser } from "../../services/auth/createUser";
import { userService } from "../../services/users";
import { UserRole } from "../../interfaces/users";
import { AuthRequest } from "../../middleware";
const { BASE_URL } = process.env;

interface Body {
  email: string;
  password: string;
  role: UserRole;
}
const data: IData = {
  rules: {
    body: {
      email: {
        required: true,
        fieldName: "Email",
      },
      password: {
        required: true,
        fieldName: "Password",
      },
      role: {
        required: true,
        authorize: ({}, role: UserRole) => role === "admin"
      },
    },
  },
  requestRateLimiter: RATE_LIMITS.register,
};
async function registerHandler(
  req: AuthRequest<Body>,
  res: Response,
  next: NextFunction,
) {
  const {
    body: { email, password, role },
  } = req;
  try {
    const user = await userService.findOne({ email });

    assert(!user, "User already exists");
    const createdUser = await createUser({
      email,
      password,
      role
    });

    const tokens = await generateTokens(createdUser, "signup");
    const response = {
      token: {
        accessToken: tokens.accessToken,
      },
      createdUser,
    };
    res.cookie("refresh", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      expires: new Date(Date.now() + 60 * 60 * 1000),
      sameSite: "none",
    });

    sendSuccessResponse(
      res,
      next,
      {
        success: true,
        response,
      },
      httpCodes.CREATED.code,
    );
  } catch (error) {
    sendFailedResponse(res, next, error);
  }
}

export default {
  method: "post",
  url: "/api/auth/register",
  handler: registerHandler,
  data,
};
