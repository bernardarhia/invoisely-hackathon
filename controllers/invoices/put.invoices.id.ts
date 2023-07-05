import {
    sendFailedResponse,
    sendSuccessResponse,
  } from "../../helpers/requestResponse";
  import { AuthRequest } from "../../middleware";
  import { IData } from "../../interfaces/index";
  import { NextFunction, Response } from "express";
  import { invoiceService } from "../../services/invoice";
  import { Invoice, RecurringFrequency, recurringFrequencies } from "../../database/models/Invoice";
  import { hasValidInvoiceDiscount, hasValidInvoiceItems } from "../../services/invoice/utils";
  import { userService } from "../../services/users";
import { buildUpdatePayload } from "../../utils";
  
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
       },
       userId: {
        required: true,
        authorize: async (req: AuthRequest, val: string) => !!(await userService.findOne({userId: val, createdBy: req.user.id}))
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
      const invoiceId = req.params.invoiceId;
      const buildInvoiceUpdateFields = buildUpdatePayload(req.body)
      const updatedInvoice = await invoiceService.updateOne({_id: invoiceId}, buildInvoiceUpdateFields)
      sendSuccessResponse(
        res,
        next,
        {
          success: true,
          response: {
            updatedInvoice
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
  