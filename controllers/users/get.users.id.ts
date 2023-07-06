import {
    sendFailedResponse,
    sendSuccessResponse,
  } from "../../helpers/requestResponse";
  import { AuthRequest } from "../../middleware";
import { userService } from "../../services/users";
  import { IData } from "./../../interfaces/index";
  import { NextFunction, Response } from "express";
  
  const data: IData = {
    permittedRoles: ["admin", "client"],
    requireAuth: true,
    rules: {
      params: {
        userId: {
          required: true,
        },
      }
    },
  };
  async function getSingleUser(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.params.userId;
      const user = await userService.findOne({_id: userId, deleted: false});
      
      sendSuccessResponse(
        res,
        next,
        {
          success: true,
          response: { ...user },
        }
      );
    } catch (error) {
      sendFailedResponse(res, next, error);
    }
  }
  
  export default {
    method: "get",
    url: "/api/:userId/users",
    handler: getSingleUser,
    data,
  };
  