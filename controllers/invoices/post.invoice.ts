
/**
 * @api {POST} /api/invoices/create Create
 * @apiName Create Invoice
 * @apiGroup Invoice
 * @apiVersion 0.0.1
 * @apiDescription Endpoint use to create an invoice
 * @apiSuccess {Boolean} success Request success
 * @apiSuccess {Object} response Invoice Data
 * @apiPermission admin
 * @apiSampleRequest https://invoisely.onrender.com
 * @apiBody {Array} items invoice items
 * @apiBody {String} userId The user this invoice is for
 * @apiBody {Object} discount  Discount to the invoice
 * @apiBody {Boolean} isRecurring  This determines if invoice should be recurring
 * @apiBody {Date} recurringStartDate  When invoice recurring is to start
 * @apiBody {Date} recurringEndDate When invoice recurring is to end
 * @apiBody {String} recurringFrenquency  Where requiring should happen weekly, monthly, daily
 * @apiSuccessExample {json}
    Success-Response:
 *  HTTP/1.1 201 CREATED
 * {
    "success": true,
    "response": {
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
    }
}
 * 
 * @apiError InputField is required
 * @apiErrorExample {json}
 * Error-Response:
 * HTTP/1.1 400 BAD REQUEST
 * {
 *  "success":false,
 *  "response":{
 *    "message": "{Field} Required"
 *  }
 * }
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
import { canAccessInvoice, hasValidInvoiceDiscount, hasValidInvoiceItems } from "../../services/invoice/utils";
import { isAfter, isToday, parseISO } from "date-fns";
import { httpCodes } from "../../constants";

const data: IData<Invoice> = {
  permittedRoles: ["admin"],
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
        validate: ({ }, recurringStartDate: string) => 
         !(recurringStartDate && isToday(parseISO(recurringStartDate)) || isAfter(new Date(), parseISO(recurringStartDate)))
      },
      recurringEndDate: {
        required: false,
        validate: ({ }, recurringEndDate: string) => 
        !(recurringEndDate && isToday(parseISO(recurringEndDate)) || isAfter(new Date(), parseISO(recurringEndDate)))
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
        authorize: async (req: AuthRequest, userId: string) => await canAccessInvoice(req, userId)
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
