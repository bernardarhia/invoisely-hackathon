import dotenv from "dotenv";
import Bull from "bull";
import { JobValidator } from "../jobs/validator";
import { v4 as uuid } from "uuid";
import { IJobOptions, JobData, JobId } from "../interfaces";
import { modifyJobOptions } from "../utils/jobs";
dotenv.config();
const {
  REDIS_PORT = 6379,
  REDIS_USER = "",
  REDIS_PASSWORD = "",
  REDIS_HOST = "localhost",
} = process.env;
export default class JobBase<T> {
  queue: Bull.Queue<JobData<T>>;
  readonly maxRetries: number = 5; // Increase max retries
  private isConnected: boolean = false;
  constructor(queueName: string) {
    this.queue = new Bull(queueName, {
      redis: {
        host: REDIS_HOST,
        port: Number(REDIS_PORT),
        password: REDIS_PASSWORD,
        username: REDIS_USER,
      },
    });
    this.queue.isReady().then(() => {
      this.isConnected = true;
      console.log("Queue connection successful");
    });

    this.queue.on("error", this.handleQueueError.bind(this));

    this.queue.process(this.processJob.bind(this));
    this.queue.on("failed", this.failedJob.bind(this));
  }

  handleQueueError(error: Error) {
    this.isConnected = false;
    console.error("Queue connection error:", error);
    // You can handle the connection failure here or emit an event, throw an error, etc.
  }

  async processJob(job: Bull.Job<JobData<T>>): Promise<void> {
    try {
      await this.process(job.data.data);
      if (job.isCompleted()) {
        console.log(`Job with Id ${job.id} has completed successfully`);
      }
    } catch (error) {
      if (job.attemptsMade < this.maxRetries) {
        console.log(`Job ${job.id} failed, retrying...`);
        await job.retry();
      } else {
        console.log(`Job ${job.id} failed, max retries reached`);
      }
      await job.remove();
    }
  }
  async failedJob(job: Bull.Job<JobData<T>>, error: Error): Promise<void> {
    console.log(`Job ${job.id} failed with error: ${error.message}`);
  }

  async process(data: T): Promise<void> {
    throw new Error("Method not implemented");
  }

  async addJob(data: T, options: IJobOptions): Promise<Bull.Job<JobData<T>>> {
    if (JobValidator.hasValidJobId(options.jobId)) {
      const modifiedOptions = modifyJobOptions(options);
      modifiedOptions.jobId = `${options.jobId}:${uuid()}` as JobId;
      return await this.queue.add({ data }, modifiedOptions);
    }
  }
}
/**
 * https://docs.bullmq.io/guide/queues/auto-removal-of-jobs
 * different ways to remove a job
 * {
    removeOnComplete: {
      age: 3600, // keep up to 1 hour
      count: 1000, // keep up to 1000 jobs
    },
    removeOnFail: {
      age: 24 * 3600, // keep up to 24 hours
    },
 */

/**
     * ALL JOB OPTIONS
     * const options = {
  priority:  Job priority (0-3) ,
  delay:  Delay before job can be processed (in milliseconds) ,
  attempts:  Number of times to retry the job if it fails ,
  timeout:  Time before job times out (in milliseconds) ,
  backoff:  Backoff options for retries ,
  lifo:  Whether to prioritize last added job (default false) ,
  timeoutBehavior:  Behavior when a job times out ,
  jobId:  Unique identifier for the job ,
  parentDependencies:  Jobs this job depends on (as job ID or instance) ,
  removeOnComplete:  Whether to remove job when it completes ,
  removeOnFail:  Whether to remove job when it fails ,
  stackTraceLimit:  Limit for stack traces when job fails ,
  ignoreDuplicates:  Whether to ignore adding duplicate jobs ,
  repeat:  Repeat options for scheduling repeated jobs ,
  jobIdPrefix:  Prefix for job ID ,
  jobData:  Additional data to store with job ,
  customJobIdGenerator:  Function for generating custom job IDs ,
  limit:  Concurrency limit for this queue ,
  keyPrefix:  Prefix for Redis keys ,
  lockDuration:  Duration for job lock ,
  lockRenewTime:  Time before lock should be renewed ,
  retryProcessDelay:  Time to wait before retrying failed job ,
  drainDelay:  Delay before queue is drained after stopping ,
  settings:  Additional settings for the queue ,
};

     */
