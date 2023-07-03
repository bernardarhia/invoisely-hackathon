/**
 * @api {post} /api/auth/login Login
 * @apiName Login
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
