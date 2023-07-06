import {
    sendFailedResponse,
    sendSuccessResponse,
  } from "../../helpers/requestResponse";
  import { AuthRequest } from "../../middleware";
import { userService } from "../../services/users";
import { queryBuilder } from "../../utils";
  import { IData } from "./../../interfaces/index";
  import { NextFunction, Response } from "express";
  
  const data: IData = {
    permittedRoles: ["admin"],
    requireAuth: true,
    rules:{
        query: {}
    } 
  };
  async function getUsers(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
        const query  = queryBuilder(req.query, Object.keys(req.query))
      const users = await userService.findMany(query);
  
      sendSuccessResponse(
        res,
        next,
        {
          success: true,
          response: { ...users },
        }
      );
    } catch (error) {
      sendFailedResponse(res, next, error);
    }
  }
  
  export default {
    method: "get",
    url: "/api/users",
    handler: getUsers,
    data,
  };
  