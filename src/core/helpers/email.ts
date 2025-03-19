import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_EMAIL_API_KEY)

export const ResendEmailService = {
  /**
   * Send an email to one or multiple recipients
   */
  async send(recipients: string[], subject: string, htmlContent: string) {
    if (!recipients.length) {
      console.error("No recipients provided.")
      return
    }

    try {
      const responses = await Promise.all(
        recipients.map(async (recipient) => {
          return await resend.emails.send({
            from: "OSO Developers <no-reply@transactional.oso.nyc>",
            to: recipient,
            subject,
            html: htmlContent,
          })
        }),
      )

      console.log("Emails sent successfully:", responses)
      return responses
    } catch (error) {
      console.error("Error sending emails:", error)
      throw error
    }
  },
}
