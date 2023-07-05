import mongoose, { Document, Types, Schema } from "mongoose";
import { Statuses } from "../../interfaces";
import { MongooseDefaults } from "../../constants";

export type PaymentReason = "subscriptionPayment";
export const paymentStatuses: Statuses[] = ["failed", "pending", "success"];
export interface IPayment {
  _id?: Types.ObjectId;
  id?: Types.ObjectId;
  userId: Types.ObjectId;
  status: Statuses;
  transactionId: number;
  domain: string;
  reference: string;
  amount: number;
  gateway_response: string;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: string;
  fees: number;
  authorization_code: string;
  paidAt: string;
}

export interface ISubscriptionPayemnt extends IPayment {
  subscriptionId: Types.ObjectId;
}
const paymentSchema = new Schema<IPayment>(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: { type: String, enum: paymentStatuses, required: true },
    transactionId: { type: Number, required: true },
    domain: { type: String, required: true },
    reference: { type: String },
    amount: { type: Number, required: true },
    gateway_response: { type: String, required: true },
    created_at: { type: String, required: true },
    channel: { type: String, required: true },
    currency: { type: String, required: true },
    ip_address: { type: String, required: true },
    fees: { type: Number, required: true },
    authorization_code: { type: String, required: true },
    paidAt: { type: String, required: true },
  },
  { ...MongooseDefaults, discriminatorKey: "__Type" },
);

const Payment = mongoose.model<IPayment>("Payment", paymentSchema);

const subscriptionPaymentSchema = new Schema<ISubscriptionPayemnt>({
  subscriptionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subscription",
    required: true,
  },
});
export const SubscriptionPayment = Payment.discriminator(
  "SubscriptionPayment",
  subscriptionPaymentSchema,
);
export default Payment;
