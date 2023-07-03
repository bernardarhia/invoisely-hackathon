import { Types } from "mongoose";
import { IAddress, IPhone } from ".";
import { ISubscription } from "./subscription";

export type UserRole =
  | "admin"
  | "orgAdmin"
  | "subAdmin"
  | "secretary"
  | "lawyer"
  | "client"
  | "support";

export const userRoles: UserRole[] = [
  "admin",
  "client",
  "lawyer",
  "orgAdmin",
  "secretary",
  "subAdmin",
  "support",
];

export type UserStatus =
  | "active"
  | "suspended"
  | "pendingApproval"
  | "inactive";
export const userStatuses: UserStatus[] = [
  "active",
  "suspended",
  "pendingApproval",
  "inactive",
];
export interface IUser {
  _id?: Types.ObjectId;
  id?: Types.ObjectId;
  email: string;
  phone: IPhone;
  password: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  gender: "male" | "female";
  // permission: number;
  physicalAddress: IAddress;
  mailingAddress: IAddress;
  belongsToOrg: boolean;
  organizationId: Types.ObjectId;
  status: UserStatus;
  deleted: boolean;
  isLoggedIn: boolean;
  dateOfBirth: Date;
  lastLoggedInDate: Date;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  permission: {
    access: string;
    userId?: Types.ObjectId;
    _id?: Types.ObjectId;
  };
  subscription?: ISubscription;
  organizationHasSubscription?: boolean;
}
