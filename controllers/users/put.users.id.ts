

/**
 * @api {POST} /api/users/create Update
 * @apiName Update User
 * @apiGroup Users
 * @apiVersion 0.0.1
 * @apiDescription Endpoint use to update a user
 * @apiSuccess {Boolean} success Request success
 * @apiSuccess {Object} response User Data
 * @apiPermission admin
 * @apiSampleRequest https://invoisely.onrender.com
 * @apiBody {String} firstName First name of the user
 * @apiBody {String} lastName Last name of the user
 * @apiBody {String} email  User's email
 * @apiBody {String} password  User's Password
 * @apiBody {Object} phone  User's phone 
 * @apiBody {Object} mailAddress  mailingAddress of the user
 * @apiBody {String} role  User's role
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
 * @apiError InputField is required
 * @apiErrorExample {json}
 * Error-Response:
 * HTTP/1.1 400 BAD REQUEST
 * {
 *  "success":false,
 *  "response":{
 *    "message": "{Field} Required"
 *  }
 * }
 */
import {
  sendFailedResponse,
  sendSuccessResponse,
} from "../../helpers/requestResponse";
import { IUser } from "../../interfaces/users";
import { AuthRequest } from "../../middleware";
import { userService } from "../../services/users";
import { buildUpdatePayload } from "../../utils";
import { IData } from "./../../interfaces/index";
import { NextFunction, Response } from "express";

const data: IData = {
  requireAuth: true,
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
      mailingAddress: {},
    
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
