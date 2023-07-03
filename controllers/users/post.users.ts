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
import { EmailJob } from "../../jobs/EmailJob";
import { AuthRequest } from "../../middleware";
import { userService } from "../../services/users";
import { userBelongsToOrganization } from "../../utils/access";
import { IData } from "./../../interfaces/index";
import { NextFunction, Response } from "express";

const data: IData = {
  requireAuth: true,
  permission: ["users", "create"],
  rules: {
    body: {
      email: {
        required: true,
        minLength: 10,
      },
      phone: {
        required: true,
      },
      password: {
        required: true,
      },
      role: {
        required: true,
      },
      firstName: {
        required: true,
        fieldName: "First name",
      },
      lastName: {
        required: true,
        fieldName: "Last name",
      },
      permission: {
        required: true,
      },
      organizationId: {
        required: true,
      },
      status: {},
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
    await EmailJob.sendUserCreatedEmail({
      email: user.email,
      data: {
        email: user.email,
        fullName: `${user.firstName} ${user.lastName}`,
        password: req.body.password,
      },
    });
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
