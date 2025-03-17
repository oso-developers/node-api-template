import { Email } from "@/core/email"

export type RequestPasswordResetEmailArgs = {
  resetToken: string
}

export class RequestPasswordResetEmail extends Email {
  constructor(public readonly args: RequestPasswordResetEmailArgs) {
    super("Forgot Password")
  }

  template(): string {
    return `
      <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="max-width: 500px; margin: auto; background-color: #ffffff; border-radius: 8px; box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);">
        <tr>
          <td style="background-color: #11698f; color: white; padding: 20px; text-align: center; font-size: 22px; font-weight: bold;">
            Reset Your Password
          </td>
        </tr>
        <tr>
          <td style="padding: 20px; text-align: center;">
            <p style="font-size: 16px; color: #333; margin: 0;">Hi There,</p>
            <p style="font-size: 14px; color: #555; margin: 10px 0;">
              We received a request to reset your password from Node API. Click the button below to set a new password.
            </p>
            <a href="http://localhost:3000/forgot-password/reset?token=${this.args.resetToken}" 
               style="display: inline-block; padding: 12px 30px; font-size: 16px; font-weight: bold; color: white; background-color: #11698f; text-decoration: none; border-radius: 5px; margin: 20px 0;">
               Reset Password
            </a>
            <p style="font-size: 12px; color: #777; margin: 15px 0;">
              <strong>Note:</strong> If you did not request a password reset for your account, you can safely ignore this email.
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; font-size: 12px; color: #777; text-align: center;">
            This link will expire in 24 hours for your security.<br>
            Need help? <a href="mailto:support@example.com" style="color: #11698f; text-decoration: none;">Contact Support</a>
          </td>
        </tr>
      </table>`;
  }
}
