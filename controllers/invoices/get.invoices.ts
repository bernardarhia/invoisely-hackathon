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
  