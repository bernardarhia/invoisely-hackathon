import JobBase from "../core/jobs";
import { IJobBase } from "../interfaces";
import { EmailService } from "../services/email/Email";
import { emailJobDeterminer } from "./JobDeterminer";
export class EmailJob extends JobBase<IJobBase> {
  private emailService: EmailService;
  constructor() {
    super("email");
    this.emailService = new EmailService();
  }

  // All email processing logic comes here
  async process(data: IJobBase): Promise<void> {
    const content = emailJobDeterminer(data);
    this.emailService.sendEmail(content);
  }

  static async accountVerification(data: IJobBase): Promise<void> {
    data.jobId = "user-registration";
    await new EmailJob().addJob(data, {
      jobId: data.jobId,
    });
  }
  static async sendUserCreatedEmail(data: IJobBase) {
    data.jobId = "user-created";
    await new EmailJob().addJob(data, {
      jobId: data.jobId,
    });
  }
}
