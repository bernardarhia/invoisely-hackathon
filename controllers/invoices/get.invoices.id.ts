/**
 * @api {GET} /api/:invoiceId Get Invoice by Id
 * @apiName Get Invoice
 * @apiGroup Invoice
 *
 *
 *
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
    
      
      const invoice = await invoiceService.findOne({_id: invoiceId});
      
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
    url: "/api/:invoiceId",
    handler: getSingleInvoice,
    data,
  };
  