
/**
 * @api {DELETE} /api/:invoiceId/delete Delete
 * @apiName Delete Invoice
 * @apiGroup Invoice
 * @apiVersion 0.0.1
 * @apiDescription Endpoint use to delete a single invoice 
 * @apiSuccess {Boolean} success Request success
 * @apiSuccess {Object} response Data
 * @apiPermission admin
 * @apiSampleRequest https://invoisely.onrender.com
 * @apiParam {String} invoiceId The Invoice Id.
 * @apiSuccessExample {json}
    Success-Response:
 *  HTTP/1.1 200 OK
 * {
    "success": true,
    "response": {
        "message": "Invoice deleted",
    }
}
 * 
 * @apiError InvoiceIdRequired
 * @apiError Unauthorized   You cannot access this route.
 * @apiErrorExample {json}
 * Error-Response:
 * HTTP/1.1 400 BAD REQUEST
 * {
 *  "success":false,
 *  "response":{
 *    "message": "Invoice id is  Required"
 *  }
 * }
 */
import {
    sendFailedResponse,
    sendSuccessResponse,
  } from "../../helpers/requestResponse";
  import { AuthRequest } from "../../middleware";
import { invoiceService } from "../../services/invoice";
import { canDeleteInvoice } from "../../services/invoice/utils";
  import { IData } from "./../../interfaces/index";
  import { NextFunction, Response } from "express";
  
  const data: IData = {
    permittedRoles: ["admin"],
    requireAuth: true,
    rules: {
      params: {
        invoiceId: {
          required: true,
          authorize: async (req: AuthRequest, invoiceId: string) => await canDeleteInvoice(req, invoiceId)
        },
      }
    },
  };
  async function deleteSingleInvoice(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const invoiceId = req.params.invoiceId;
          
       await invoiceService.deleteOne({ _id: invoiceId });
      
      sendSuccessResponse(
        res,
        next,
        {
          success: true,
          response: { 
            message:"Invoice deleted"
          },
        }
      );
    } catch (error) {
      sendFailedResponse(res, next, error);
    }
  }
  
  export default {
    method: "delete",
    url: "/api/:invoiceId/delete",
    handler: deleteSingleInvoice,
    data,
  };
  