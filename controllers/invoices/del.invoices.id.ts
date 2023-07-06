

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
          
      const deletedInvoice = await invoiceService.updateOne({ _id: invoiceId },{ deleted: true });
      
      if(deletedInvoice && !deletedInvoice.deleted){}
      sendSuccessResponse(
        res,
        next,
        {
          success: true,
          response: { ...deletedInvoice },
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
  