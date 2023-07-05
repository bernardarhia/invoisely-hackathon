import { Types } from "mongoose";
import { IAddress, IPhone } from ".";

export type UserRole =
  | "admin"
  | "client";

export const userRoles: UserRole[] = [
  "admin",
  "client"
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
  physicalAddress?: IAddress;
  mailingAddress?: IAddress;
  status: UserStatus;
  deleted: boolean;
  isLoggedIn: boolean;
  createdBy: Types.ObjectId;
  updatedBy: Types.ObjectId;
}
