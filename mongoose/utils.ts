import { Schema } from "mongoose";

export const deletedPlugin = (schema: Schema, opts: any) => {
  schema.add({
    deleted: {
      type: Boolean,
      default: false,
      required: false,
    },
  });
};
