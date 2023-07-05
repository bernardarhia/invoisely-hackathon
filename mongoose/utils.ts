import { Schema, Types } from "mongoose";
// Define the plugin

export interface IDefaultPlugin {
  createdAt: Date;
  updatedAt: Date;
  deleted: boolean;
  deletedAt:Date;
  deletedBy: Types.ObjectId;
}
export const defaultPlugin = function (schema: Schema) {
  schema.add({
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
      type: Schema.Types.ObjectId,
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