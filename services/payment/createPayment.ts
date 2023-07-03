import { Types } from "mongoose";
import {
  IPayment,
  PaymentReason,
  SubscriptionPayment,
} from "../../mongoose/models/Payment";

export const createPayment = async (
  reason: PaymentReason,
  response: Record<string, any>,
  userId: Types.ObjectId,
  extra: { subscriptionId: Types.ObjectId },
) => {
  const { data } = response;
  const { subscriptionId } = extra;
  const toStore: IPayment = {
    amount: data.amount / 100,
    authorization_code: data.authorization.authorization_code,
    transactionId: data.id,
    channel: data.channel,
    created_at: data.created_at,
    paidAt: data.paid_at,
    currency: data.currency,
    domain: data.domain,
    fees: data.fees / 100,
    gateway_response: data.gateway_response,
    ip_address: data.ip_address,
    reference: data.reference,
    status: data.status,
    userId,
  };

  if (reason === "subscriptionPayment") {
    await SubscriptionPayment.create({ ...toStore, subscriptionId });
  }
};
