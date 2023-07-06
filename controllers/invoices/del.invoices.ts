
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

    const deletedInvoices = await invoiceService.updateMany({ userId: req.user._id }, { deleted: true });

    sendSuccessResponse(
      res,
      next,
      {
        success: true,
        response: { ...deletedInvoices },
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
