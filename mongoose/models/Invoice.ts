import mongoose, { Types, Schema } from "mongoose";
import { MongooseDefaults } from "../../constants";
import { addInvoiceItems } from "../hooks/invoice/addInvoiceItems";
type InvoiceStatus = "pending" | "paid" | "cancelled" | "overdue";
export type RecurringFrequency = "daily" | "weekly" | "monthly" | "yearly";

export type InvoiceDiscountType = "percentage" | "number"
export interface InvoiceItem {
  product: string;
  price: number;
  description?: string;
}
export interface Invoice {
  _id?: Types.ObjectId;
  userId: Types.ObjectId;
  invoiceNumber: string;
  items: InvoiceItem[];
  discount?: {
    type: InvoiceDiscountType;
    amount: number;
  };
  totalAmount: number;
  paymentStatus: InvoiceStatus;
  isRecurring: boolean;
  recurringFrequency: RecurringFrequency;
  recurringStartDate: Date;
  recurringEndDate: Date;
  createdAt?: Date;
  updatedAt: Date;
  deleted: boolean;
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
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        taxType: {
          type: String,
          required: false,
        },
        tax: {
          type: Number,
          required: false,
        }
      },
    ],
    discount: {
      type: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },

    totalAmount: {
      type: Number,
      required: true,
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
      default: "monthly",
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

invoiceSchema.pre("save", addInvoiceItems)
export const InvoiceModel = mongoose.model("Invoice", invoiceSchema);
