
/**
 * @api {UPDATE} /v1/:invoiceId/invoices/update Update
 * @apiName Update Invoice
 * @apiGroup Invoice
 * @apiVersion 0.0.1
 * @apiDescription Endpoint use to create an invoice
 * @apiSuccess {Boolean} success Request success
 * @apiSuccess {Object} response Invoice Data
 * @apiPermission admin
 * @apiSampleRequest https://invoisely.onrender.com
 *  * @apiHeader {String} Authorization The token can be generated from your user profile.
 * @apiHeaderExample {Header} Header-Example
 *     "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2NDljZjZlMzVlYTA1OTQ5OTZkMzZiYTYiLCJpYXQiOjE2ODgwMDg0MTksImV4cCI6MzM3NjAxNjg0NX0.dE-A_Snj93z67VbL_aoxeowif6CQQr6gTRO8ve_Fuuo"
 *
 * @apiBody {Array} items invoice items
 * @apiBody {String} userId The user this invoice is for
 * @apiBody {Object} discount  Discount to the invoice
 * @apiBody {Boolean} isRecurring  This determines if invoice should be recurring
 * @apiBody {Date} recurringStartDate  When invoice recurring is to start
 * @apiBody {Date} recurringEndDate When invoice recurring is to end
 * @apiBody {String} recurringFrenquency  Where requiring should happen weekly, monthly, daily
 * @apiParam {String} invoiceId The Invoice Id.
 * @apiSuccessExample {json}
    Success-Response:
 *  HTTP/1.1 200 OK
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
 * @apiError Unauthorized You cannot access this route.
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
  import { Invoice, RecurringFrequency, recurringFrequencies } from "../../database/models/Invoice";
  import { hasValidInvoiceDiscount, hasValidInvoiceItems } from "../../services/invoice/utils";
  import { userService } from "../../services/users";
import { buildUpdatePayload } from "../../utils";
  
  const data: IData<Invoice> = {
    permittedRoles: ["admin"],
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
  async function updateInvoice(
    req: AuthRequest<Invoice>,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const body = {
        ...req.body,
        createdBy: req.user.id,
      };
      
      delete body.deleted;

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
    method: "put",
    url: "/:invoiceId/invoices/update",
    handler: updateInvoice,
    data,
  };
  