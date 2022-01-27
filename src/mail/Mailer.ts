import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";
import EmailTemplate from "email-templates";
import path from "path";

export type MailInput = {
  to: string;
  subject?: string;
  name?: string;
};

export type MailAction = {
  title: string;
  href: string;
};

const instance = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: parseInt(process.env.MAIL_PORT),
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASSWORD,
  },
});

export class Mailer {
  private from = `${process.env.MAIL_FROM} <${process.env.MAIL_USER}>`;
  private transporter: nodemailer.Transporter<SMTPTransport.SentMessageInfo>;
  private options: MailInput;
  public subject: string;
  public lines: string[];
  public action: MailAction | undefined;
  public imageSrc: string;

  constructor(options: MailInput) {
    this.transporter = instance;
    this.options = options;
  }

  async send() {
    const template = path.join(__dirname, "templates", "welcome");

    const email = new EmailTemplate({
      transport: this.transporter,
      send: true,
      preview: false,
    });

    const { name, subject, ...options } = this.options;

    await email.send({
      template,
      message: {
        from: this.from,
        subject: this.subject ? this.subject : subject,
        ...options,
      },
      locals: {
        app: {
          name: process.env.APP_NAME,
        },
        greetings: `Hello${name ? ` ${name},` : "!"}`,
        lines: this.lines,
        action: this.action,
        imageSrc: this.imageSrc,
      },
    });

    this.transporter.close();
  }
}
