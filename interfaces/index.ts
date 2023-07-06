import { RequestHandler } from "express";
import { ValidationRule } from "../helpers/validator";
import { UserRole } from "./users";

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
  permittedRoles?: UserRole[],
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