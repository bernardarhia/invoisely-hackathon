import { JobId } from "../interfaces";

export const jobIdsArr: JobId[] = [
  "organization-invoice",
  "reset-password",
  "user-registration",
  "user-registration-invoice",
  "user-account-verification",
];
export const jobIds: { [key: string]: JobId } = {
  passwordReset: "reset-password",
  userRegistrationInvoice: "user-registration-invoice",
};
