/**
 * @api {post} /api/auth/register Register
 * @apiName Register
 * @apiGroup Auth
 *
 *
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
import { EmailJob } from "../../jobs/EmailJob";
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
        authorize: ({}, role: UserRole)=> role === "admin"
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

    // Generate a unique URL with the token appended as a query parameter
    const generateVerificationUrl = (token: any) => {
      return `${BASE_URL}/verify?token=${token.token}&type=${token.type}`;
    };
    const verifyAccountToken = tokens.verifyAccountToken;
    const verificationUrl = generateVerificationUrl(verifyAccountToken);
    // Send Email
    await EmailJob.accountVerification({
      email,
      accountVerificationToken: verificationUrl,
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
