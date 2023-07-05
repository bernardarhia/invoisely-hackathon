import { IData, ILimiter } from "./../interfaces/index";
import { Request, Response, NextFunction } from "express";
import { TokenService } from "../helpers/auth/jwt";
import { RATE_LIMITS } from "../constants";
import Database from "../core/database";
import { RateLimiterMongo } from "rate-limiter-flexible";
import { AppError } from "../helpers/errors";
import { IUser } from "../interfaces/users";
export interface AuthRequest<T = any> extends Request {
  user?: Partial<IUser>;
  geolocation?: Record<string, string>;
  body: T;
}
class AuthMiddleware {
  public async checkAuth(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<any> {
    try {
      await TokenService.authenticate(req, next);
    } catch (err) {
      console.info("I was here")
      return res.status(401).json({ error: "Unauthorized" });
    }
  }


  public async rateLimit(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
    config: ILimiter = RATE_LIMITS.api,
  ) {
    const { headers } = req;
    // CF-Connecting-IP is to get the client ip from cloudflare
    const ip = headers["CF-Connecting-IP"] || req.ip;
    const opts = {
      storeClient: Database.connection(),
      points: config.max, // Number of points
      duration: config.windowMs / 1000, // Per second(s),
      blockDuration: config.blockDuration || 60 * 60 * 5, // block the ip for 5hours,
      keyPrefix: "rateLimiter",
    };
    try {
      const rateLimiterMongo = new RateLimiterMongo(opts);
      const rateLimiterRes = await rateLimiterMongo.consume(
        `${config.name}:${ip}`,
      );
      const headers = {
        "Retry-After": rateLimiterRes.msBeforeNext / 1000,
        "X-RateLimit-Limit": opts.points,
        "X-RateLimit-Remaining": rateLimiterRes.remainingPoints,
        "X-RateLimit-Reset": new Date(Date.now() + rateLimiterRes.msBeforeNext),
      };
      res.set(headers);
      return next();
    } catch (error) {
      res.set({ "X-RateLimit-Remaining": 0 });
      return res.status(429).send({
        message: error.message || "Too many requests. Try again later",
        code: 429,
      });
    }
  }
}

export default new AuthMiddleware();
