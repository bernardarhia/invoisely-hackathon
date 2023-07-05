import { userService } from "../../../services/users";
import { UserModel } from "../../models/Users";
import { passwordManager } from "../../../helpers/auth/password";

export const userExists = async function (this: UserModel, next: any) {
  try {
    const existingUser = await userService.findOne({ email: this.email });

    if (existingUser && !existingUser.deleted) {
      throw new Error("User already exists.");
    }
    const password = await passwordManager.hashPassword(this.password);
    this.password = password;
    return next();
  } catch (error) {
    next(error);
  }
};
