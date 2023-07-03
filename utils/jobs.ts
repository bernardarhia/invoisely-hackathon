import { IJobOptions } from "../interfaces";

export const modifyJobOptions = (options: IJobOptions): IJobOptions => {
  if (options.jobId === "reset-password") {
    options.removeOnComplete = {
      age: 5, // keep up to 1 hour
      count: 1000, // keep up to 1000 jobs
    };
  }
  options.priority = 5;
  return options;
};
