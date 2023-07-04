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
import { IData } from "../../interfaces/index";
import { NextFunction, Response } from "express";

const data: IData = {
  requireAuth: true,
  permission: ["users", "create"],
  rules: {
    body: {},
  },
};
async function createSingleInvoice(
  req: AuthRequest<IUser>,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = {
      ...req.body,
      createdBy: req.user.id,
    };

    sendSuccessResponse(
      res,
      next,
      {
        success: true,
        response: {},
      },
      201,
    );
  } catch (error) {
    sendFailedResponse(res, next, error);
  }
}

export default {
  method: "post",
  url: "/api/invoices/create",
  handler: createSingleInvoice,
  data,
};
