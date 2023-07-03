import mongoose, { Document, Types, Schema } from "mongoose";
import { MongooseDefaults } from "../../constants";
type InvoiceStatus = "pending" | "paid" | "cancelled" | "expired";
export interface IInvoice {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  discount?: {
    type: "percentage" | "number",
    amount: number
  };
  amount: number;
  invoiceNumber: string;
  status: InvoiceStatus;
  deleted?: boolean;
}

export interface ISubscriptionInvoice extends IInvoice {
  subscriptionId: Types.ObjectId;
}
const invoiceSchema = new Schema<IInvoice>(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    invoiceNumber: { type: String, required: true },
    amount: { type: Number, required: true },
    discount: {
      type: { type: String, default: "percentage" },
      amount: { type: Number, required: false, default: 0 }
    },
    status: { type: String, required: true }
  },
  {...MongooseDefaults, discriminatorKey: "__Type"},
);

const Invoice = mongoose.model<IInvoice>("Invoice", invoiceSchema);

const SubscriptionSchema = new Schema<ISubscriptionInvoice>({
  subscriptionId: { type: mongoose.Schema.Types.ObjectId, ref: "Subscription", required: true },
});

export const SubscriptionInvoice = Invoice.discriminator("SubscriptionInvoice", SubscriptionSchema)
export default Invoice;