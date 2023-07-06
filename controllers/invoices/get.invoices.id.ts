

/**
 * @api {GET} /api/:invoiceId/invoices Get
 * @apiName Get Invoice
 * @apiGroup Invoice
 * @apiVersion 0.0.1
 * @apiDescription Endpoint use to get a single invoice 
 * @apiSuccess {Boolean} success Request success
 * @apiSuccess {Object} response Invoice Data
 * @apiPermission admin, user
 * @apiSampleRequest https://invoisely.onrender.com
 * @apiParam {String} invoiceId The Invoice Id.
 * @apiSuccessExample {json}
    Success-Response:
 *  HTTP/1.1 200 OK
 * {
    "success": true,
    "response": {
   userId: '6090f45b-3dc0-4334-a0bd-70d606535d39',
    items: [ {
    product: 'International',
    quantity: 2,
    price: 522.41,
    description: 'Adipisci vitae tempore minus voluptates explicabo fuga itaque minima tempora.',
    id: '64a66a2ffbe41ea018382c4f'
  }],
    discount: { type: 'percentage', amount: 94 },
    paymentStatus: 'pending',
    isRecurring: false,
    deleted: false,
    createdBy: 'fbf52367-2b51-4996-a693-444e5a618361',
    createdAt: '2023-07-06T07:15:03.990Z',
    updatedAt: '2023-07-06T07:15:03.991Z',
    totalAmount: 3551.75,
    invoiceNumber: '0422849',
    id: '9758b563-9c89-48c8-9016-7edd641fcd30'
    }
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
  import { IData } from "./../../interfaces/index";
  import { NextFunction, Response } from "express";
  
  const data: IData = {
    permittedRoles: ["admin", "client"],
    requireAuth: true,
    rules: {
      params: {
        invoiceId: {
          required: true,
        },
      }
    },
  };
  async function getSingleInvoice(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const invoiceId = req.params.invoiceId;
      const invoice = await invoiceService.findOne({_id: invoiceId, deleted: false});
      
      sendSuccessResponse(
        res,
        next,
        {
          success: true,
          response: { invoice },
        }
      );
    } catch (error) {
      sendFailedResponse(res, next, error);
    }
  }
  
  export default {
    method: "get",
    url: "/api/:invoiceId/invoices",
    handler: getSingleInvoice,
    data,
  };
  