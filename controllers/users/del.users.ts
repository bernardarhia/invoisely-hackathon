import {
    sendFailedResponse,
    sendSuccessResponse,
  } from "../../helpers/requestResponse";
  import { AuthRequest } from "../../middleware";
import { canDeleteUser } from "../../services/users/utils";
import { userService } from "../../services/users";
  import { IData } from "./../../interfaces/index";
  import { NextFunction, Response } from "express";
  
  const data: IData = {
    permittedRoles: ["admin"],
    requireAuth: true,
    rules: {
      params: {
        userId: {
          required: true,
          authorize: async (req: AuthRequest, userId: string) => await canDeleteUser(req, userId)
        },
      }
    },
  };
  async function deleteSingleUser(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.params.userId;
          
      const deletedInvoice = await userService.updateOne({ _id: userId },{ deleted: true });
      
      sendSuccessResponse(
        res,
        next,
        {
          success: true,
          response: { ...deletedInvoice },
        }
      );
    } catch (error) {
      sendFailedResponse(res, next, error);
    }
  }
  
  export default {
    method: "delete",
    url: "/api/:userId/delete",
    handler: deleteSingleUser,
    data,
  };
  