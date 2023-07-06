/**
 * @api {post} /api/users/create Create User
 * @apiName POSTUser
 * @apiGroup User
 *
 *
 *
 */

import {
  sendFailedResponse,
  sendSuccessResponse,
} from "../../helpers/requestResponse";
import { IUser } from "../../interfaces/users";
import { AuthRequest } from "../../middleware";
import { userService } from "../../services/users";
import { IData } from "./../../interfaces/index";
import { NextFunction, Response } from "express";

const data: IData<IUser> = {

  requireAuth: true,
  rules: {
    body: {
      email: {
        required: true,
      },
      phone: {
        required: true,
      },
      password: {
        required: true,
      },
      role: {
        required: true,
        validate: ({}, role: string) => role === "client"
      },
      firstName: {
        required: true,
        fieldName: "First name",
        validate: ({}, firstName: string) => [firstName.length >= 3, "First Name should be 3 or more characters long"]

      },
      lastName: {
        required: true,
        fieldName: "Last name",
        validate: ({}, lastName: string) => [lastName.length >= 3, "Last Name should be 3 or more characters long"]
      },
      mailingAddress: {}
    },
  },
};
async function createSingleHandler(
  req: AuthRequest<IUser>,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = {
      ...req.body,
      createdBy: req.user.id,
    };
    const user = await userService.create(body);
    sendSuccessResponse(
      res,
      next,
      {
        success: true,
        response: { ...user },
      },
      201,
    );
   
  } catch (error) {
    sendFailedResponse(res, next, error);
  }
}

export default {
  method: "post",
  url: "/api/users/create",
  handler: createSingleHandler,
  data,
};
