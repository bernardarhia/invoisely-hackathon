import {
  sendFailedResponse,
  sendSuccessResponse,
} from "../../helpers/requestResponse";
import { AuthRequest } from "../../middleware";
import { IData } from "../../interfaces/index";
import { NextFunction, Response } from "express";
import { invoiceService } from "../../services/invoice";
import { Invoice, RecurringFrequency, recurringFrequencies } from "../../mongoose/models/Invoice";
import { hasValidInvoiceDiscount, hasValidInvoiceItems } from "../../services/invoice/utils";

const data: IData<Invoice> = {
  requireAuth: true,
  rules: {
    body: {
     items:{
      required: true,
      validate: hasValidInvoiceItems
     },
     isRecurring:{
      required: false,
      validate: ({}, val: boolean)=> typeof val === "boolean"
     },
     recurringStartDate:{
      required: false
     },
     recurringEndDate:{
      required: false
     },
     recurringFrequency:{
      required: false,
      validate: ({}, val: RecurringFrequency)=> val && recurringFrequencies.includes(val)
     },
     discount:{
      required: false,
      validate: hasValidInvoiceDiscount
     }
    },
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
