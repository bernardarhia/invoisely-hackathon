import mongoose, { Document, Schema, Types } from "mongoose";

export type VerifyAccountTokenType = "signup" | "login";

const verifyAccountTokenTypeArr: VerifyAccountTokenType[] = ["login", "signup"];
export interface ITokens {
  accessToken: string;
  refreshToken: string;
  verifyAccountToken?: {
    token: string;
    expiresAt: Date;
    type: VerifyAccountTokenType;
  } | null;
}
export interface TokenDocument extends Document {
  _id:string;
  tokens: ITokens;
  userId:string;
}

const tokenSchema = new Schema<TokenDocument>(
  {
    tokens: {
      refreshToken: {
        type: String,
        require: true,
      },
      accessTokenExpiresAt: {
        type: Date,
        require: true,
      },
      refreshTokenExpiresAt: {
        type: Date,
        require: true,
      },
      verifyAccountToken: {
        type: {
          token: String,
          expiresAt: Date,
          type: String,
        },
      },
    },
    userId: { type: String, ref: "User", required: true },
  },
  { timestamps: true },
);

tokenSchema.pre<TokenDocument>("save", async function (next) {
  const existingToken = await Tokens.findOne({ userId: this.userId });

  if (existingToken) {
    await existingToken.deleteOne();
  }

  next();
});

const Tokens = mongoose.model<TokenDocument>("Token", tokenSchema);

export default Tokens;
