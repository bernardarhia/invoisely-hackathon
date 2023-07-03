import { EmailJobOptions, IJobBase } from "../interfaces";
import {
  newUserCreatedTemplate,
  newUserEmailTemplate,
} from "../templates/userAccountTemplate";

export const emailJobDeterminer = (data: IJobBase): EmailJobOptions => {
  const { jobId } = data;
  let content = {};

  switch (jobId) {
    case "user-registration":
      content = newUserEmailTemplate(data.email, data.accountVerificationToken);
      break;
    case "user-created":
      content = newUserCreatedTemplate(data.email, data.data);
    default:
      break;
  }
  return content as EmailJobOptions;
};
