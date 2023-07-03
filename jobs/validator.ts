import { JobId } from "../interfaces";
import { jobIdsArr } from "./jobIds";

export class JobValidator {
  static hasValidJobId(id: JobId): boolean {
    if (!jobIdsArr.includes(id)) throw new Error("Job requires a valid job Id");
    return true;
  }
}
