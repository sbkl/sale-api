import { Mailer, MailInput } from "./Mailer";

export class PasswordRequestEmail extends Mailer {
  constructor(options: MailInput & { code: string }) {
    super(options);
    this.subject = "Login request";
    this.lines = [
      "Please use the 6 digits code below to login to your account:",
      options.code,
    ];
  }
}
