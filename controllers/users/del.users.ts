
/**
 * @api {DELETE} /api/users/delete Delete All
 * @apiName Delete Users
 * @apiGroup Users
 * @apiVersion 0.0.1
 * @apiDescription Endpoint use to delete all users 
 * @apiSuccess {Boolean} success Request success
 * @apiSuccess {Object} response Data
 * @apiPermission admin
 * @apiSampleRequest https://invoisely.onrender.com
 * @apiSuccessExample {json}
    Success-Response:
 *  HTTP/1.1 200 OK
 * {
    "success": true,
    "response": {
        "message": "Users deleted",
    }
}
 * @apiError Unauthorized   You cannot access this resource.
 * @apiErrorExample {json}
 * Error-Response:
 * HTTP/1.1 401 UNAUTHORIZED
 * {
status: "error",
statusCode: 401,
message: "Unauthorized"
}
 */
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
  async function deleteUsers(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
    
      await userService.deleteMany({ createdBy: req.user.id });
      
      sendSuccessResponse(
        res,
        next,
        {
          success: true,
          response: { 
            message: "Users deleted"
           },
        }
      );
    } catch (error) {
      sendFailedResponse(res, next, error);
    }
  }
  
  export default {
    method: "delete",
    url: "/api/users/delete",
    handler: deleteUsers,
    data,
  };
  