import { Types } from "mongoose";

export type SubscriptionStatus = "expired" | "active" | "pending" | "cancelled";

export interface ISubscription {
  _id: Types.ObjectId;
  id?: Types.ObjectId;
  userId: Types.ObjectId;
  planId: Types.ObjectId;
  startDate?: Date;
  endDate?: Date;
  isActive?: boolean;
  status: SubscriptionStatus;
  cancelledOn?: Date;
  expiredOn?: Date;
  deleted?: boolean;
  organizationId: Types.ObjectId;
}
