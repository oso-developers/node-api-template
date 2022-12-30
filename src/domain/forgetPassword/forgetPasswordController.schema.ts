import { authConfig } from "@/app/config"
import { z } from "zod"

export const RequestPasswordResetSchema = z.object({
  email: z.string().email(),
})
export type IRequestPasswordReset = z.infer<typeof RequestPasswordResetSchema>

export const ValidateTokenSchema = z.object({
  token: z.string(),
})
export type IValidateToken = z.infer<typeof ValidateTokenSchema>

export const ResetForgottenPasswordSchema = z.object({
  token: z.string(),
  password: z.string().min(authConfig.password.minLength),
  confirm_password: z.string().min(authConfig.password.minLength),
})
export type IResetForgottenPassword = z.infer<
  typeof ResetForgottenPasswordSchema
>
