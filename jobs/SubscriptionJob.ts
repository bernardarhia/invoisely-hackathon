import JobBase from "../core/jobs";
import { IJobOptions } from "../interfaces";
import { ISubscription } from "../interfaces/subscription";

interface ISubscriptionJobData extends IJobOptions, ISubscription {}
export class SubscriptionJob extends JobBase<ISubscriptionJobData> {
  constructor() {
    super("subscription");
  }

  // All email processing logic comes here
  async process(data: ISubscriptionJobData): Promise<void> {
    // await subscriptionService.create({});
    console.log({ data });
  }

  static async subscribe(data: ISubscriptionJobData): Promise<void> {
    if (process.env.NODE_ENV === "test") {
      console.log("Subscription created");
    } else
      await new SubscriptionJob().addJob(data, {
        jobId: data.jobId,
      });
  }
}
