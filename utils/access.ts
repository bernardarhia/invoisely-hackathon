import { AuthRequest } from "../middleware";
import { IOrganization } from "../interfaces/organization";
import { userService } from "../services/users";

export async function userBelongsToOrganization(
  req: AuthRequest,
  organizationId: string,
): Promise<boolean> {
  const userId = req.user.id;
  const user = await userService.findOne({
    _id: userId,
    organizationId: organizationId,
  });
  console.info({ user });
  // return !!(req.user.role === "admin" || user);
  return true;
}
