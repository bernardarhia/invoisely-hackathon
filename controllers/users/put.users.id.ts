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
import { buildUpdatePayload } from "../../utils";
import { userBelongsToOrganization } from "../../utils/access";
import { IData } from "./../../interfaces/index";
import { NextFunction, Response } from "express";

const data: IData = {
  requireAuth: true,
  permission: ["users", "update"],
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
    params: {
      userId: {},
    },
  },
};
async function updateUserHandler(
  req: AuthRequest<IUser>,
  res: Response,
  next: NextFunction,
) {
  try {
    const userId = req.params.userId;
    const update = buildUpdatePayload(req.body);
    const fieldToUpdate = { ...update, updatedBy: req.user.id };
    const user = await userService.updateOne({ _id: userId }, fieldToUpdate);
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
  method: "put",
  url: "/api/users/:userId/update",
  handler: updateUserHandler,
  data,
};
