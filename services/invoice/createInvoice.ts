import { Types } from "mongoose";
import { PaymentReason } from "../../mongoose/models/Payment";

export const createInvoice = async (
  reason: PaymentReason,
  data: {
    userId: Types.ObjectId;
    subscriptionId: Types.ObjectId;
    amount: number;
  },
): Promise<boolean> => {
  let result: any;
  switch (reason) {
    case "subscriptionPayment":
      break;
    default:
      break;
  }
  return !!result;
};
