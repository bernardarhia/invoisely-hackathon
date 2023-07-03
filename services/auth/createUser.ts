import { passwordManager } from "./../../helpers/auth/password";
import User, { UserModel } from "./../../mongoose/models/Users";

export const createUser = async (
  data: Pick<UserModel, "email" | "password" | "role">,
): Promise<UserModel | null> => {
  const { password, email, role } = data;
  const hashedPassword = await passwordManager.hashPassword(password);
  const user = new User({ email, password: hashedPassword, role });
  await user.save();
  return user.toObject();
};
