import { Document } from "mongoose";
import { HttpCodeNames, HttpCodes, IRateLimiter } from "./../interfaces/index";
// constants.js

export const httpCodes: {
  [key in HttpCodeNames]: {
    code: HttpCodes;
    message?: string;
  };
} = {
  OK: {
    code: 200,
    message: "OK",
  },
  CREATED: {
    code: 201,
    message: "Created",
  },
  BAD_REQUEST: {
    code: 400,
    message: "Bad Request",
  },
  UNAUTHORIZED: {
    code: 401,
    message: "Unauthorized",
  },
  FORBIDDEN: {
    code: 403,
    message: "Forbidden",
  },
  NOT_FOUND: {
    code: 404,
    message: "Not Found",
  },
  INTERNAL_SERVER_ERROR: {
    code: 500,
    message: "Internal Server Error",
  },
  SERVICE_UNAVAILABLE: {
    code: 503,
    message: "Service Unavailable",
  },
};

export const RATE_LIMITS: IRateLimiter = {
  api: {
    max: 1000,
    windowMs: 3600000,
    message: "Too many API calls, please try again soon.",
    name: "api",
  },
  register: {
    max: 10,
    windowMs: 30000,
    message: "Too many attempts, please try again in a few minutes.",
    name: "register",
  },
  login: {
    name: "login",
    max: 15,
    windowMs: 300000,
    message: "Too many attempts, please try again in a few minutes.",
  },
  refreshToken: {
    name: "refreshToken",
    max: 15,
    windowMs: 3000,
    message: "Too many attempts, please try again in a few minutes.",
  },
};

export const MongooseDefaults = {
  timestamps: true,
  strict: true,
  minimize: false,
  validateBeforeSave: true,
  strictPopulate: true,
  toJSON: {
    getters: true, // Add this line to include virtuals,
    virtuals: true,
    transform: (doc: Document, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
  toObject: {
    getters: true, // Add this line to include virtuals,
    virtuals: true,
    transform: (doc: Document, ret: any) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
  read: "secondary",
  collation: {
    locale: "en_US",
    strength: 1,
  },
};
