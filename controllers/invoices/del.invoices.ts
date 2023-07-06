
/**
 * @api {DELETE} /api/invoices/delete Delete All
 * @apiName Delete Invoices
 * @apiGroup Invoice
 * @apiVersion 0.0.1
 * @apiDescription Endpoint use to delete all invoices 
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
        "message": "Invoices deleted",
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
import { invoiceService } from "../../services/invoice";
import { IData } from "./../../interfaces/index";
import { NextFunction, Response } from "express";

const data: IData = {
  permittedRoles: ["admin"],
  requireAuth: true 
};
async function deleteInvoices(
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) {
  try {

    const deletedInvoices = await invoiceService.deleteMany({ createdBy: req.user.id });

    sendSuccessResponse(
      res,
      next,
      {
        success: true,
        response: { 
          message:"Invoices deleted"
         },
      }
    );
  } catch (error) {
    sendFailedResponse(res, next, error);
  }
}

export default {
  method: "delete",
  url: "/api/invoices/delete",
  handler: deleteInvoices,
  data,
};
