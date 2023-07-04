import { RequestHandler } from "express";
import { ValidationRule } from "../helpers/validator";
import { JobOptions } from "bull";

export type RouteTypes = "post" | "get" | "delete" | "put" | "patch";

export interface IResponseData {
  success: boolean;
  response?: object | any[] | null;
  headers?: IRequestHeader;
  code?: number;
}
export interface IRequestHeader {
  key: string;
  value: string;
}
export interface IData<T = any> {
  middleware?: RequestHandler[];
  requireAuth?: boolean;
  customAuth?: RequestHandler;
  rules?: {
    [key in "params" | "body" | "query"]?: {
      [key in keyof T]?: ValidationRule;
    };
  };
  requestRateLimiter?: ILimiter;
  csrf?: boolean;
}
export interface HttpServer {
  start(port: number): void;
}
export interface ILimiter {
  max: number;
  windowMs: number;
  message?: string;
  name: string;
  blockDuration?: number;
}
export interface IRateLimiter {
  [key: string]: ILimiter;
}
export interface IRoute {
  url: string;
  data: IData;
  handler: RequestHandler;
  method: RouteTypes;
}

export interface IPhone {
  prefix: string;
  number: string;
}

export interface IAddress {
  houseNumber: string;
  zipCode: string;
  city: string;
  street: string;
  state: string;
}

export type HttpCodes = 200 | 201 | 400 | 401 | 403 | 404 | 500 | 503;
export type HttpCodeNames =
  | "OK"
  | "CREATED"
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "INTERNAL_SERVER_ERROR"
  | "SERVICE_UNAVAILABLE";

export type Statuses = "failed" | "success" | "pending";

export type JobId =
  | "reset-password"
  | "user-registration"
  | "organization-invoice"
  | "user-registration-invoice"
  | "user-account-verification"
  | "subscription-created"
  | "user-created";

export interface JobData<T> {
  data: T;
}
export interface IJobOptions extends JobOptions {
  jobId: JobId;
}
export interface IJobBase {
  email: string;
  jobId?: JobId;
  accountVerificationToken?: string;
  data?: {
    email?: string;
    password?: string;
    fullName?: string;
  };
}

export interface Attachment {
  content?: string | Buffer;
  filename?: string | false | undefined;
  path?: string;
}
export type Tag = {
  name: string;
  value: string;
};
export interface MailOptions {
  attachments?: Attachment[];
  bcc?: string | string[];
  cc?: string | string[];
  from: string;
  html?: string;
  reply_to?: string | string[];
  subject: string;
  tags?: Tag[];
  text?: string;
  to: string | string[];
}

export interface EmailJobOptions extends MailOptions {}
