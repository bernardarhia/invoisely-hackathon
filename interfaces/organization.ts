import { Types } from "mongoose";
import { IAddress, IPhone } from ".";

// Interface for the organization document
export interface IOrganization {
  id?: Types.ObjectId;
  name: string;
  description: string;
  website: string;
  founded: Date;
  email: string;
  phone: IPhone;
  isVerified: boolean;
  physicalAddress: IAddress;
  mailingAddress: IAddress;
  type: "main" | "sub";
  isSubOrganization: boolean;
  mainOrganizationId: Types.ObjectId;
  updatedBy: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
  logoUrl: string;
  socialMedia: {
    facebook: string;
    twitter: string;
    linkedIn: string;
    instagram: string;
  };
  status: OrganizationStatus;
  deleted: boolean;
  createdBy: Types.ObjectId | string;
  activeSubscription?: boolean;
  size?: "1-1" | "2-10" | "10-50" | "50+";
  slogan: string;
  corporationType: string;
}

type OrganizationStatus = "active" | "suspended" | "pending";
export const organizationStatus: OrganizationStatus[] = [
  "active",
  "suspended",
  "pending",
];
