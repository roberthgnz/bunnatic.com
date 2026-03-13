import { z } from 'zod'

export type SigninValidationMessages = {
  emailRequired: string
  emailInvalid: string
  passwordRequired: string
}

export function createSigninSchema(messages: SigninValidationMessages) {
  return z.object({
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    password: z.string().min(1, messages.passwordRequired),
  })
}

export type SigninFormValues = z.infer<ReturnType<typeof createSigninSchema>>
