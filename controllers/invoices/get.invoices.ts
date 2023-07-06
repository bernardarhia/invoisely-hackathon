

/**
 * @api {GET} /api/invoices Get All
 * @apiName Get Invoices
 * @apiGroup Invoice
 * @apiVersion 0.0.1
 * @apiDescription Endpoint use to get all invoices 
 * @apiSuccess {Boolean} success Request success
 * @apiSuccess {Object} response Invoice Data
 * @apiPermission admin,user
 * @apiSampleRequest https://invoisely.onrender.com
 * @apiSuccessExample {json}
    Success-Response:
 *  HTTP/1.1 200 OK
 * {
    "success": true,
    "response": [{
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
    }]
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
import {
    sendFailedResponse,
    sendSuccessResponse,
  } from "../../helpers/requestResponse";
  import { AuthRequest } from "../../middleware";
  import { invoiceService } from "../../services/invoice";
import { queryBuilder } from "../../utils";
  import { IData } from "./../../interfaces/index";
  import { NextFunction, Response } from "express";
  
  const data: IData = {
    permittedRoles: ["admin", "client"],
    requireAuth: true,
    rules:{
        query:{}
    } 
  };
  async function getInvoices(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
        const query  = queryBuilder(req.query, Object.keys(req.query))
        if(req.user.role === "admin"){
          query.filter.createdBy = req.user.id;
        }
        if(req.user.role === "client"){
          query.filter.userId = req.user.id;
        }
        query.filter.deleted = false;
        
      const invoices = await invoiceService.findMany(query);
  
      sendSuccessResponse(
        res,
        next,
        {
          success: true,
          response: { ...invoices },
        }
      );
    } catch (error) {
      sendFailedResponse(res, next, error);
    }
  }
  
  export default {
    method: "get",
    url: "/api/invoices",
    handler: getInvoices,
    data,
  };
  