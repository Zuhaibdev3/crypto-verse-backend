import { injectable } from 'inversify';
import crypto from 'crypto';
import { IEmailService } from '../interfaces/iemail.service';
import { Email, IMessage2, sendMail2, culturefyOfficialContactEmail } from '../../helpers/mail';
import { DataCopier } from '../../utils/dataCopier';
import { EmailQueue, sendBulkEmailsWithQueue } from '../../helpers/emailQueue';
import { EmailAddress, EmailClient, EmailContent,  EmailRecipients } from "@azure/communication-email"
import * as ejs from "ejs";
import axios from 'axios';
import { EmailPayload } from '../../Api/Components/webhook/iwebhook.service';

// This code retrieves your connection string from an environment variable.
const connectionString = process.env.AZURE_EMAIL_STRING as string;
const microserviceEmailUrl: string = process.env.NOREPLAY_EMAIL_MICROSERVICE_URL as string;
const client = new EmailClient(connectionString);


@injectable()
export class EmailService implements IEmailService {

  constructor() { }

  sendEmail(data: IMessage2): Promise<unknown> {
    return sendMail2(data)
  }
  sendFeedbackContactEmail(data: IMessage2): Promise<unknown> {
    return culturefyOfficialContactEmail(data)
  }
  sendForgetPasswordOTPEmail(email: string, otp: string): Promise<unknown> {
    return this.sendEmailInBulkUsingMicroservice([
      {
        to: email,
        subject: 'Your OTP for Forget Password on Culturefy',
        dataType: 'plainText',
        template : `Your OTP is ${otp}. It is valid for 5 minutes.`
      }
    ])
  }
  sendNewResetPassword(email: string, newPassword: string): Promise<unknown> {
    return this.sendEmailInBulkUsingMicroservice([
      {
        to: email,
        subject: 'New Password From Admin Side on Culturefy',
        dataType: 'plainText',
        template : `Your new password is ${newPassword}.`
      }
    ])
  }
  sendEmailtoMultipleUsers(email: string[], emailBody: string, emailSubject: string, cc: string[]): Promise<any> {
    const data: any = {};
    data.subject = emailSubject;
    data.to = email.join(', '); // Join email addresses with comma and space
    data.cc = cc.join(', '); // Join email addresses with comma and space
    data.text = emailBody;
    console.log('data', data);
    const emailData = DataCopier.copy(Email, data);
    console.log('emailData', emailData);
    return this.sendEmail(emailData);
  }

  sendBulkQueueEmails(data: EmailQueue[], onComplete: (e: any) => void) {
    return sendBulkEmailsWithQueue(data, onComplete)
  }

  async sendEmailToBulkUsers(to: EmailAddress[], subject: string, dataType: 'html' | 'plainText', template: string, templateData?: object, cc?: EmailAddress[]): Promise<any> {
    let content: EmailContent = {
      subject: subject,
      plainText: '',
      html: ''
    }
    if (dataType == 'html') {
      const html = ejs.render(template, templateData);
      delete content.plainText
      content['html'] = html;
    } else {
      delete content.html
      content['plainText'] = template;
    }

    const poller = await client.beginSend({
      senderAddress: "DoNotReply@culturefy.com",
      content: content,
      recipients: {
        to: to,
        cc: cc ?? []
      },
    });
    const result = await poller.pollUntilDone();
    return result
  }

  async sendEmailInBulkUsingMicroservice(emails: EmailPayload[]): Promise<any> {
    return axios.post(microserviceEmailUrl, emails)
  }
}
