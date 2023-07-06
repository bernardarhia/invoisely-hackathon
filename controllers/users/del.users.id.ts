
/**
 * @api {DELETE} /api/:userId/users/delete Delete
 * @apiName Delete User
 * @apiGroup Users
 * @apiVersion 0.0.1
 * @apiDescription Endpoint use to delete a single user 
 * @apiSuccess {Boolean} success Request success
 * @apiSuccess {Object} response Data
 * @apiPermission admin
 * @apiSampleRequest https://invoisely.onrender.com
 * @apiParam {String} userId The User's Id.
 * @apiSuccessExample {json}
    Success-Response:
 *  HTTP/1.1 200 OK
 * {
    "success": true,
    "response": {
        "message": "User deleted",
    }
}
 * 
 * @apiError InvoiceIdRequired
 * @apiError Unauthorized You cannot access this route.
 * @apiErrorExample {json}
 * Error-Response:
 * HTTP/1.1 400 BAD REQUEST
 * {
 *  "success":false,
 *  "response":{
 *    "message": "User id is Required"
 *  }
 * }
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
          authorize: async (req: AuthRequest, userId: string) => await canDeleteUser(req, userId),
          fieldName: "User id"
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
          
      const deletedInvoice = await userService.deleteOne({ _id: userId });
      
      sendSuccessResponse(
        res,
        next,
        {
          success: true,
          response: { 
            message: "user deleted"
           },
        }
      );
    } catch (error) {
      sendFailedResponse(res, next, error);
    }
  }
  
  export default {
    method: "delete",
    url: "/api/:userId/users/delete",
    handler: deleteSingleUser,
    data,
  };
  