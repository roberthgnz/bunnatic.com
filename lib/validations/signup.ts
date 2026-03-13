import { z } from 'zod'

export type SignupValidationMessages = {
  nameRequired: string
  nameMin: string
  nameMax: string
  emailRequired: string
  emailInvalid: string
  passwordRequired: string
  passwordMin: string
  passwordUppercase: string
  passwordLowercase: string
  passwordNumber: string
}

export function createSignupSchema(messages: SignupValidationMessages) {
  return z.object({
    name: z
      .string()
      .trim()
      .min(1, messages.nameRequired)
      .min(2, messages.nameMin)
      .max(80, messages.nameMax),
    email: z
      .string()
      .trim()
      .min(1, messages.emailRequired)
      .email(messages.emailInvalid),
    password: z
      .string()
      .min(1, messages.passwordRequired)
      .min(8, messages.passwordMin)
      .regex(/[A-Z]/, messages.passwordUppercase)
      .regex(/[a-z]/, messages.passwordLowercase)
      .regex(/[0-9]/, messages.passwordNumber),
  })
}

export type SignupFormValues = z.infer<ReturnType<typeof createSignupSchema>>
