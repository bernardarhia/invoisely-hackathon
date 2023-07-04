import {
  sendFailedResponse,
  sendSuccessResponse,
} from "../../helpers/requestResponse";
import { AuthRequest } from "../../middleware";
import { IData } from "../../interfaces/index";
import { NextFunction, Response } from "express";
import { invoiceService } from "../../services/invoice";
import { Invoice } from "../../mongoose/models/Invoice";

const data: IData = {
  requireAuth: true,
  rules: {
    body: {},
  },
};
async function createSingleInvoice(
  req: AuthRequest<Invoice>,
  res: Response,
  next: NextFunction,
) {
  try {
    const body = {
      ...req.body,
      createdBy: req.user.id,
    };

    const createdInvoice = await invoiceService.create(body)
    sendSuccessResponse(
      res,
      next,
      {
        success: true,
        response: {
          createdInvoice
        },
      },
      201,
    );
  } catch (error) {
    sendFailedResponse(res, next, error);
  }
}

export default {
  method: "post",
  url: "/api/invoices/create",
  handler: createSingleInvoice,
  data,
};
