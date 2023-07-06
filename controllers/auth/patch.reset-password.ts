/**
 * @api {PATCHJ} /api/auth/reset-password Password Reset
 * @apiName PasswordReset
 * @apiGroup Auth
 * @apiVersion 0.0.1
 * @apiDescription Endpoint use to reset user's password 
 * @apiSuccess {Boolean} success Request success
 * @apiSuccess {Object} response User Data
 * @apiPermission anyone
 * @apiSampleRequest https://invoisely.onrender.com
 * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *  "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDljZjZlMzVlYTA1OTQ5OTZkMzZiYTYiLCJpYXQiOjE2ODgwMDg0MTksImV4cCI6MzM3NjAxNjg0NX0.dE-A_Snj93z67VbL_aoxeowif6CQQr6gTRO8ve_Fuuo"
 *
 * @apiBody {String} oldPassword  User's old password
 * @apiBody {String} newPassword  User's new password
 * @apiSuccessExample {json}
    Success-Response:
 *  HTTP/1.1 204 No Content
 * {
    "success": true,
    "response": {
        "token": {eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDljZjZlMzVlYTA1OTQ5OTZkMzZiYTYiLCJpYXQiOjE2ODgwMDg0MTksImV4cCI6MzM3NjAxNjg0NX0.dE-A_Snj93z67VbL_aoxeowif6CQQr6gTRO8ve_Fuuo
            "accessToken": ""
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
 * @apiError InputField is required
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
