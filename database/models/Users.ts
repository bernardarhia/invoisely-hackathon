import mongoose from "mongoose";
import { IUser, userRoles } from "../../interfaces/users";
import { MongooseDefaults } from "../../constants";
// import { deletedPlugin } from "../utils";
import { userExists } from "../hooks/users/userAlreadyExists";
import { defaultPlugin } from "../utils";

export interface UserModel extends IUser {}

const userSchema = new mongoose.Schema<UserModel>(
  {
    email: { type: String, required: true },
    phone: {
      prefix: { type: String },
      number: { type: String },
    },
    password: { type: String, required: true },
    role: { type: String, default: "admin", enum: userRoles },
    firstName: { type: String },
    lastName: { type: String },
    mailingAddress: {
      houseNumber: { type: String },
      zipCode: { type: String },
      city: { type: String },
      state: { type: String },
      street: { type: String },
    },
    status: { type: String, default: "active" },
    createdBy: {
      type: String,
      ref: "User",
    },
    updatedBy: {
      type: String,
      ref: "User",
    },
  },
  MongooseDefaults,
);


userSchema.plugin(defaultPlugin);
userSchema.pre("save", userExists);
const User = mongoose.model<UserModel>("User", userSchema);

export default User;
