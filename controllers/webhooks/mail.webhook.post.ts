import { IData } from "../../interfaces/index";
import { NextFunction, Request, Response } from "express";
import { RATE_LIMITS } from "../../constants";
const data: IData = {
  requireAuth: false,
  rules: {
    body: {
      email: {
        required: true,
      },
      password: {
        required: true,
      },
    },
  },
  requestRateLimiter: RATE_LIMITS.login,
};
async function mailWebhookHandler(
  req: Request,
  res: Response,
  next: NextFunction,
) {}

export default {
  method: "post",
  url: "/api/mail/webhook",
  handler: mailWebhookHandler,
  data,
};
