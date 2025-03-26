import { User } from "@prisma/client"
import { IEvent } from "@/core/entities/event"
import { Auth } from "@/core/helpers/auth"
import { RequestPasswordResetEmail } from "@/app/modules/forgotPassword/emails/RequestPasswordResetEmail"
import { EmailService } from "@/core/email"
import { logger } from "@/core/server/logger"
import { Resend } from "resend"

/**
 * when a user has forgotten their account password and wish to reset it, we
 * fire off this event. It will send out an email to the user with instructions
 * to set a new account password.
 */
export class RequestPasswordResetEvent implements IEvent {
  constructor(private readonly user: User) {}

  public async process(): Promise<void> {
    const token = await Auth.generatePasswordResetToken(this.user.id)
    const email = new RequestPasswordResetEmail({ resetToken: token.token })

    const resend = new Resend(process.env.RESEND_EMAIL_API_KEY)

    const response = await resend.emails.send({
      from: "OSO Developers <no-reply@transactional.oso.nyc>",
      to: [`${this.user.email}`],
      subject: "Hello from Resend",
      html: email.html(),
    })
    EmailService.instance.sendEmail(this.user.email, email)
    logger.info(
      { email: this.user.email },
      "sending forgot password (password reset) email",
    )
  }
}