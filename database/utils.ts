import { Schema, Types } from "mongoose";
import { v4 as uuid } from "uuid";

export interface IDefaultPlugin {
  _id?:string;
  createdAt?: Date;
  updatedAt?: Date;
  deleted?: boolean;
  deletedAt?:Date;
  deletedBy?: string;
  createdBy?: string;
}
export const defaultPlugin = function (schema: Schema) {
  schema.add({
    _id: {
      type: String,
      default: uuid,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    deleted: {
      type: Boolean,
      default: false,
      required: false,
    },
    deletedAt: {
      type: Date,
      required: false
    },
    deletedBy: {
      type: String,
      ref: "User",
      required: false,
    },
    createdBy: {
      type: String,
      ref: "User",
      required: false,
    }
  });

  schema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
  });

  schema.pre("findOneAndUpdate", function (next) {
    if((this as any).deleted){
      (this as any).deletedAt = new Date();
    }
    next();
  })
};