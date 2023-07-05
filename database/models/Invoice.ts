import mongoose, { Types, Schema } from "mongoose";
import { MongooseDefaults } from "../../constants";
import { addInvoiceItems } from "../hooks/invoice/addInvoiceItems";
import { IDefaultPlugin, defaultPlugin } from "../utils";
type InvoiceStatus = "pending" | "paid" | "cancelled" | "overdue";
export type RecurringFrequency = "daily" | "weekly" | "monthly" | "yearly";

export type InvoiceDiscountType = "percentage" | "number"
export interface InvoiceItem {
  product: string;
  price: number;
  description?: string;
  quantity: number;
}
export interface Invoice extends IDefaultPlugin {
  userId: string;
  invoiceNumber?: string;
  items: InvoiceItem[];
  discount?: {
    type: InvoiceDiscountType;
    amount: number;
  };
  totalAmount?: number;
  paymentStatus?: InvoiceStatus;
  isRecurring?: boolean;
  recurringFrequency?: RecurringFrequency;
  recurringStartDate?: Date;
  recurringEndDate?: Date;
}


const invoiceStatuses: InvoiceStatus[] = [
  "cancelled",
  "overdue",
  "paid",
  "pending",
];
export const recurringFrequencies: RecurringFrequency[] = [
  "monthly",
  "daily",
  "weekly",
  "yearly",
];
const invoiceSchema = new Schema<Invoice>(
  {
    userId: {
      type: String,
      ref: "User",
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: false,
      unique: true,
      // default: 
    },
    items: [
      {
        product: {
          type:String,
          required: true,
        },
        quantity: {
          type: Number,
          required: false,
          default: 1
        },
        price: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: false,
        }
      },
    ],
    discount: {
      type: {
        type: String,
        required: false,
      },
      amount: {
        type: Number,
        required: false,
      },
    },

    totalAmount: {
      type: Number,
      required: false,
    },
    paymentStatus: {
      type: String,
      enum: invoiceStatuses,
      default: "pending",
    },
    isRecurring: {
      type: Boolean,
      default: false,
    },
    recurringFrequency: {
      type: String,
      enum: recurringFrequencies,
    },
    recurringStartDate: {
      type: Date,
    },
    recurringEndDate: {
      type: Date,
    },
    deleted: {
      type: Boolean,
      default: false,
    },
  },
  { ...MongooseDefaults },
);

invoiceSchema.plugin(defaultPlugin);
invoiceSchema.pre("save", addInvoiceItems)
export const InvoiceModel = mongoose.model("Invoice", invoiceSchema);
