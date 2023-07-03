import { PermissionOperation } from "./../../interfaces/index";
import { IPermission, PermissionString } from "../../interfaces";

export const PERMISSIONS_LIST: PermissionString[] = [
  "users",
  "files",
  "invoice",
  "organization",
  "report",
];
export const PERMISSIONS = structurePermissionsObject(PERMISSIONS_LIST);

function structurePermissionsObject(
  permissionsArray: PermissionString[],
): IPermission {
  const permissions: any = {};
  for (let i = 0; i < permissionsArray.length; i++) {
    const resource = permissionsArray[i];
    permissions[resource] = {
      create: 32 + (i * 4 + 1),
      read: 32 + (i * 4 + 2),
      update: 32 + (i * 4 + 3),
      delete: 32 + (i * 4 + 4),
    };
  }
  return permissions;
}

export const constructPermission = (
  permissionsData:
    | {
        [key: string]: PermissionOperation[];
      }
    | "*",
): string => {
  const permissionsList = PERMISSIONS;
  let userPermissions = "";
  if (permissionsData === "*") return "*";
  for (const key in permissionsList) {
    if (typeof permissionsList[key] === "object") {
      for (const innerKey in permissionsList[key]) {
        if (
          permissionsData[key] &&
          permissionsData[key].includes(innerKey as PermissionOperation)
        ) {
          userPermissions += String.fromCharCode(
            permissionsList[key][innerKey],
          );
        }
      }
    }
  }
  return userPermissions;
};
export const hasPermission = (
  userPermission: string,
  permissions: [PermissionString, PermissionOperation],
): boolean => {
  return userPermission.includes(
    String.fromCharCode(PERMISSIONS[permissions[0]][permissions[1]]),
  );
};
