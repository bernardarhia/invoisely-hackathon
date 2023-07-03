import bcrypt from "bcryptjs";

const { PASSWORD_SALT = 10, PASSWORD_HASH = "" } = process.env;
class PasswordManager {
  async hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(
      `${password}${PASSWORD_HASH}`,
      Number(PASSWORD_SALT),
    );
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return await bcrypt.compare(`${password}${PASSWORD_HASH}`, hash);
  }
}

export const passwordManager = new PasswordManager();
