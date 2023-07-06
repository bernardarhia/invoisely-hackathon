

/**
 * @api {POST} /v1/users/create Create
 * @apiName Create User
 * @apiGroup Users
 * @apiVersion 0.0.1
 * @apiDescription Endpoint use to create a user
 * @apiSuccess {Boolean} success Request success
 * @apiSuccess {Object} response User Data
 * @apiPermission admin
 * @apiSampleRequest https://invoisely.onrender.com
 *  * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *     "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDljZjZlMzVlYTA1OTQ5OTZkMzZiYTYiLCJpYXQiOjE2ODgwMDg0MTksImV4cCI6MzM3NjAxNjg0NX0.dE-A_Snj93z67VbL_aoxeowif6CQQr6gTRO8ve_Fuuo"
 *
 * @apiBody {String} firstName First name of the user
 * @apiBody {String} lastName Last name of the user
 * @apiBody {String} email  User's email
 * @apiBody {String} password  User's Password
 * @apiBody {Object} phone  User's phone 
 * @apiBody {Object} mailAddress  mailingAddress of the user
 * @apiBody {String} role  User's role
 * @apiSuccessExample {json}
    Success-Response:
 *  HTTP/1.1 201 CREATED
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

import { Validator } from "../../database/validators";
import {
  sendFailedResponse,
  sendSuccessResponse,
} from "../../helpers/requestResponse";
import { IUser } from "../../interfaces/users";
import { AuthRequest } from "../../middleware";
import { userService } from "../../services/users";
import { IData } from "./../../interfaces/index";
import { NextFunction, Response } from "express";

const data: IData<IUser> = {

  requireAuth: true,
  rules: {
    body: {
      firstName: {
        required: true,
        fieldName: "First name",
        validate: ({}, firstName: string) => [firstName.length >= 3, "First Name should be 3 or more characters long"]

      },
      lastName: {
        required: true,
        fieldName: "Last name",
        validate: ({}, lastName: string) => [lastName.length >= 3, "Last Name should be 3 or more characters long"]
      },
      email: {
        required: true,
        fieldName: "Email",
        validate: Validator.isEmail,
      },
      password: {
        required: true,
        fieldName: "Password",
        validate: Validator.isPasswordStrong,
      },
      phone: {
        required: false,
      },

      role: {
        required: true,
        validate: ({}, role: string) => role === "client"
      },
      mailingAddress: {}
    },
  },
};
async function createSingleHandler(
  req: AuthRequest<IUser>,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = {
      ...req.body,
      createdBy: req.user.id,
    };
    const user = await userService.create(body);
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
  method: "post",
  url: "/users/create",
  handler: createSingleHandler,
  data,
};
