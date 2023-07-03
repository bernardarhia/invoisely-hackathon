import mongoose from "mongoose";
import { IUser, userRoles } from "../../interfaces/users";
import { MongooseDefaults } from "../../constants";
import { deletedPlugin } from "../utils";
import { userExists } from "../hooks/users/userAlreadyExists";

export interface UserModel extends IUser {}

const userSchema = new mongoose.Schema<UserModel>(
  {
    email: { type: String, required: true },
    phone: {
      prefix: { type: String },
      number: { type: String },
      country: { type: String },
    },
    password: { type: String, required: true },
    role: { type: String, default: "admin", enum: userRoles },
    firstName: { type: String },
    lastName: { type: String },
    gender: { type: String, enum: ["male", "female"] },
    physicalAddress: {
      houseNumber: { type: String },
      zipCode: { type: String },
      country: { type: String },
      city: { type: String },
      state: { type: String },
      street: { type: String },
    },
    mailingAddress: {
      houseNumber: { type: String },
      zipCode: { type: String },
      country: { type: String },
      city: { type: String },
      state: { type: String },
      street: { type: String },
    },
    belongsToOrg: { type: Boolean },
    organizationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Organization",
    },
    status: { type: String, default: "pendingApproval" },
    isLoggedIn: { type: Boolean },
    dateOfBirth: { type: Date },
    lastLoggedInDate: { type: Date },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    createdAt: { type: Date },
    updatedAt: { type: Date },
  },
  MongooseDefaults,
);

userSchema.virtual("permission", {
  ref: "Permission",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});
userSchema.virtual("subscription", {
  ref: "Subscription",
  localField: "_id",
  foreignField: "userId",
  justOne: true,
});
userSchema.virtual("organizationHasSubscription", {
  ref: "Subscription",
  localField: "organizationId",
  foreignField: "_id",
  justOne: true,
});

userSchema
  .virtual("hasActiveSubscription", {
    ref: "Subscription", // Name of the referenced model
    localField: "organizationId", // Field in the current model
    foreignField: "_id", // Field in the referenced model
    justOne: true,
    match: { status: "active" },
  })
  .get(function (this: IUser) {
    const { subscription } = this;

    return subscription && subscription.status === "active";
  });
userSchema.plugin(deletedPlugin);
userSchema.pre("save", userExists);
const User = mongoose.model<UserModel>("User", userSchema);

export default User;
