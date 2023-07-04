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
  async function deleteSingleInvoice(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const invoiceId = req.params.invoiceId;
    
      
      const deletedInvoice = await invoiceService.updateOne({_id: invoiceId},{deleted: true});
      
      sendSuccessResponse(
        res,
        next,
        {
          success: true,
          response: { deletedInvoice },
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
  