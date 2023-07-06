/**
 * @api {GET} /api/:userId/users Get
 * @apiName Get User
 * @apiGroup Users
 * @apiVersion 0.0.1
 * @apiDescription Endpoint use to get a single user 
 * @apiSuccess {Boolean} success Request success
 * @apiSuccess {Object} response User Data
 * @apiPermission admin
 * @apiSampleRequest https://invoisely.onrender.com
 * @apiParam {String} userId The User's Id.
 * @apiSuccessExample {json}
    Success-Response:
 *  HTTP/1.1 200 OK
 * {
    "success": true,
    "response": {
            "email": "Joyce_Spencer@yahoo.com",
            "phone": {},
            "role": "admin",
            "mailingAddress": {},
            "status": "active",
            "deleted": false,
            "createdAt": "2023-06-29T03:13:39.052Z",
            "updatedAt": "2023-06-29T03:13:39.052Z",
            "id": "537fcf0d-6467-49c0-a287-be80dcd779e0"       
}
 * 
 * @apiError InvoiceIdRequired
 * @apiError Unauthorized   You cannot access this resource.
 * @apiErrorExample {json}
 * Error-Response:
 * HTTP/1.1 400 BAD REQUEST
 * {
 *  "success":false,
 *  "response":{
 *    "message": "user id is  Required"
 *  }
 * }
 */
import { AppError } from "../../helpers/errors";
import {
    sendFailedResponse,
    sendSuccessResponse,
  } from "../../helpers/requestResponse";
  import { AuthRequest } from "../../middleware";
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
          fieldName: "User id",
          authorize: async (req: AuthRequest, userId: string) => !(!!(await userService.findOne({_id: userId, createdBy: req.user.id})))
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
      const user = await userService.findOne({_id: userId, createdBy: req.user.id, deleted: false});
      
      if(!(!!user)) return next(new AppError(400, "User not found"));
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
  