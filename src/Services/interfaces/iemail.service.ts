import { EmailPayload } from "../../Api/Components/webhook/iwebhook.service"
import { EmailQueue } from "../../helpers/emailQueue"
import { IMessage2 } from "../../helpers/mail"
import { EmailAddress, EmailClient, EmailContent, EmailRecipients } from "@azure/communication-email"

export interface IEmailService {
  sendEmail(data: IMessage2): Promise<unknown>,
  sendForgetPasswordOTPEmail(email: string, otp: string): Promise<unknown>
  sendNewResetPassword(email: string, newPassword: string): Promise<unknown>
  sendEmailtoMultipleUsers(email: string[], emailBody: string, emailSubject: string, cc: string[]): Promise<any>
  sendEmailToBulkUsers(to: EmailAddress[], subject: string, dataType: 'html' | 'plainText', template: string, templateData?: object, cc?: EmailAddress[]): Promise<any>
  sendBulkQueueEmails(data: EmailQueue[], onComplete: (e: any) => void):any
  sendEmailInBulkUsingMicroservice(emails: EmailPayload[]): Promise<any>
}
