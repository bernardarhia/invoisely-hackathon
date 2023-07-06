/**
 * @api {post} /api/invoices/create Create Invoice
 * @apiName Create Invoice
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
import { IData } from "../../interfaces/index";
import { NextFunction, Response } from "express";
import { invoiceService } from "../../services/invoice";
import { Invoice, InvoiceDiscountType, RecurringFrequency, recurringFrequencies } from "../../database/models/Invoice";
import { adminCanCreateInvoiceForUser, hasValidInvoiceDiscount, hasValidInvoiceItems } from "../../services/invoice/utils";
import { userService } from "../../services/users";
import { isAfter, isToday } from "date-fns";
import { httpCodes } from "../../constants";

const data: IData<Invoice> = {
  requireAuth: true,
  rules: {
    body: {
      items: {
        required: true,
        validate: ({ }, items: Invoice["items"]) => hasValidInvoiceItems({}, items)
      },
      isRecurring: {
        required: false,
        validate: ({ }, val: boolean) => !(val && typeof val === "boolean")
      },
      recurringStartDate: {
        required: false,
        validate: ({ }, recurringStartDate: Date) => 
         !(recurringStartDate && isToday(recurringStartDate) || isAfter(new Date(), recurringStartDate))
      },
      recurringEndDate: {
        required: false,
        validate: ({ }, recurringEndDate: Date) => 
        !(recurringEndDate && isToday(recurringEndDate) || isAfter(new Date(), recurringEndDate))
      },
      recurringFrequency: {
        required: false,
        validate: ({ }, val: RecurringFrequency) => !(val && recurringFrequencies.includes(val))
      },
      discount: {
        required: false,
        validate: ({ }, discount: {
          amount: number;
          type: InvoiceDiscountType;
        }) => hasValidInvoiceDiscount({}, discount)
      },
      userId: {
        required: true,
        authorize: async (req: AuthRequest, userId: string) => await adminCanCreateInvoiceForUser(req, userId)
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
          ...createdInvoice
        },
      },
      httpCodes.CREATED.code,
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
