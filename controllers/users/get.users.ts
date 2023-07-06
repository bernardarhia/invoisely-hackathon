

/**
 * @api {GET} /api/users Get All
 * @apiName Get Users
 * @apiGroup Users
 * @apiVersion 0.0.1
 * @apiDescription Endpoint use to get all users 
 * @apiSuccess {Boolean} success Request success
 * @apiSuccess {Object} response Users Data
 * @apiPermission admin
 * @apiSampleRequest https://invoisely.onrender.com
 * @apiSuccessExample {json}
    Success-Response:
 *  HTTP/1.1 200 OK
 * {
    "success": true,
    "response": [
       "email": "Joyce_Spencer@yahoo.com",
            "phone": {},
            "role": "admin",
            "mailingAddress": {},
            "status": "active",
            "deleted": false,
            "createdAt": "2023-06-29T03:13:39.052Z",
            "updatedAt": "2023-06-29T03:13:39.052Z",
            "id": "537fcf0d-6467-49c0-a287-be80dcd779e0"
    ]
}
 * 
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
import { AppError } from "../../helpers/errors";
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
  
      if(!(!!users)) return next(new AppError(400, "Users not found"));

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
  