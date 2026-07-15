import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend'
import { env } from '~/config/environment'

const mailerSendInstance = new MailerSend({ apiKey: env.MAILER_SEND_API_KEY })
const sentFrom = new Sender(
  env.MAILER_ADMIN_SENDER_EMAIL,
  env.MAILER_ADMIN_SENDER_NAME
)

const sendEmail = async (to, toName, subject, html) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const recipients = [new Recipient(to, toName)]
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject(subject)
      .setHtml(html)
    const data = await mailerSendInstance.email.send(emailParams)
    return data
  } catch (error) {
    console.log('MailerSendProvider.sendEmail error: ', error)
    throw error
  }
}

export const MailerSendProvider = { sendEmail }
