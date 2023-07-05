import { AuthRequest } from "./../../middleware";
import * as jwt from "jsonwebtoken";
import { NextFunction } from "express";
import { AppError } from "../errors";
import Tokens, {
  ITokens,
  VerifyAccountTokenType,
} from "../../mongoose/models/Tokens";
import { httpCodes } from "../../constants";
import { userService } from "../../services/users";
import { IUser } from "../../interfaces/users";
import crypto from "crypto";
const { JWT_TOKEN_SECRET, JWT_REFRESH_TOKEN_SECRET } = process.env;
// Token interfaces
const accessTokenExpiresAt = new Date(Date.now() + 10 * 1000);
const refreshTokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
interface IUserPayload extends IUser {}
export class TokenService {
  private static readonly AccessSecret = JWT_TOKEN_SECRET;
  private static readonly RefreshSecret = JWT_REFRESH_TOKEN_SECRET;

  public static createAccessToken(user: Partial<IUser>): string {
    return jwt.sign(user, TokenService.AccessSecret, {
      expiresIn: Math.floor(new Date(accessTokenExpiresAt).getTime() / 1000),
    });
  }
  public static createRefreshToken(user: Partial<IUser>): string {
    return jwt.sign(user, TokenService.RefreshSecret, {
      expiresIn: Math.floor(new Date(refreshTokenExpiresAt).getTime() / 1000),
    });
  }

  public static verifyAccessToken(token: string): IUserPayload | null {
    try {
      const currentTime = Math.floor(Date.now() / 1000);
      const decoded = jwt.verify(token, TokenService.AccessSecret) as any;
      if (decoded && decoded.exp > currentTime) {
        return decoded;
      }
      return null;
    } catch (error) {
      return null;
    }
  }
  public static verifyRefreshToken(token: string): IUserPayload {
    try {
      const decoded = jwt.verify(
        token,
        TokenService.RefreshSecret,
      ) as IUserPayload;
      return decoded;
    } catch (error) {
      return null;
    }
  }
  public static async authenticate(req: AuthRequest, next: NextFunction) {
    const { code: httpCode, message: httpMessage } = httpCodes.UNAUTHORIZED;
    try {
      const bearer = req.headers.authorization;
      if (!bearer) return next(new AppError(httpCode, httpMessage));
      const [, accessToken] = bearer.split("Bearer ");
      if (!accessToken || accessToken == undefined)
        throw new AppError(httpCode, httpMessage);

      const payload = TokenService.verifyAccessToken(accessToken);
      const id = payload._id || payload.id;
      if (!payload) throw new AppError(httpCode, httpMessage);
      const user = await userService.findOne({ _id: id });

      req.user = user;
      next();
    } catch (error) {
      throw new AppError(httpCode, error.message);
    }
  }
}

export class TokenModel implements ITokens {
  public accessToken: string;
  public refreshToken: string;

  constructor(tokens: ITokens) {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
  }
}

// call this when user is logged in
export async function generateTokens(
  user: IUserPayload,
  type?: VerifyAccountTokenType,
): Promise<ITokens> {
  const accessToken = TokenService.createAccessToken({ _id: user.id });
  const refreshToken = TokenService.createRefreshToken({ _id: user.id });

  const tokens: Omit<ITokens, "accessToken"> = {
    refreshToken,
    verifyAccountToken: null,
  };
  if (type && type === "signup") {
    const tokenData = {
      type: "signup" as VerifyAccountTokenType,
      token: `mha_${crypto.randomBytes(60).toString("hex")}`,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    };
    tokens.verifyAccountToken = tokenData;
  }
  //   store tokens in tokens model
  await Tokens.create({
    tokens,
    userId: user.id,
  });
  return {
    accessToken,
    refreshToken,
    verifyAccountToken: tokens.verifyAccountToken,
  };
}
