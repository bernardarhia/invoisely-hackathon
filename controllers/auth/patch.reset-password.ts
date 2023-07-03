/**
 * @api {patch} /api/auth/reset-password Reset password
 * @apiName PasswordReset
 * @apiGroup Auth
 *
 *
 */

import { Response, NextFunction } from "express";

import { assert } from "../../helpers/asserts";
import { passwordManager } from "../../helpers/auth/password";
import {
  sendFailedResponse,
  sendSuccessResponse,
} from "../../helpers/requestResponse";

import { userService } from "../../services/users";

import { IData } from "../../interfaces/index";
import { AuthRequest } from "../../middleware";
import { Validator } from "../../mongoose/validators";

const data: IData = {
  requireAuth: true,
  rules: {
    body: {
      oldPassword: {
        required: true,
        fieldName: "Old password",
      },
      newPassword: {
        required: true,
        fieldName: "New password",
      },
    },
  },
};

async function resetPasswordHandler(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {
    const { oldPassword, newPassword } = req.body;
    assert(!(oldPassword === newPassword), "Passwords can't be the same");

    const user = await userService.findOne(
      { _id: req.user.id },
      { includes: ["password"] },
    );
    assert(user, "User not found");
    assert(
      await passwordManager.comparePassword(oldPassword, user.password),
      "Invalid password",
    );

    const newPasswordHashed = await passwordManager.hashPassword(newPassword);

    await userService.updateOne(
      { _id: req.user.id },
      { password: newPasswordHashed },
    );

    sendSuccessResponse(res, next, {
      success: true,
    });
  } catch (error) {
    sendFailedResponse(res, next, error);
  }
}

export default {
  method: "patch",
  url: "/api/auth/reset-password",
  handler: resetPasswordHandler,
  data,
};
