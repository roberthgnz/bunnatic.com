import { NextResponse } from 'next/server'
import { Webhook } from 'standardwebhooks'
import { Resend } from 'resend'

export const runtime = 'nodejs'

const RESEND_API_KEY = process.env.RESEND_API_KEY
const HOOK_SECRET = process.env.SEND_EMAIL_HOOK_SECRET
const SENDER_EMAIL = process.env.SENDER_EMAIL

const EMAIL_TEMPLATES = {
  signup: 'confirm-sign-up',
  recovery: 'reset-password',
  password_changed_notification: 'password-changed-notification',
} as const

type EmailActionType = keyof typeof EMAIL_TEMPLATES

interface WebhookPayload {
  user: {
    id: string
    email: string
    user_metadata?: Record<string, unknown>
  }
  email_data: {
    token?: string
    token_hash?: string
    redirect_to?: string
    email_action_type: EmailActionType
    site_url: string
    token_new?: string
    token_hash_new?: string
  }
}

function getNextPath(redirectTo?: string) {
  if (!redirectTo) return null

  try {
    return new URL(redirectTo).pathname
  } catch {
    return redirectTo
  }
}

function getBaseUrl(siteUrl: string, redirectTo?: string) {
  if (!redirectTo || !redirectTo.startsWith('http')) return siteUrl

  try {
    return new URL(redirectTo).origin
  } catch {
    return siteUrl
  }
}

function buildConfirmationUrl(
  emailActionType: EmailActionType,
  siteUrl: string,
  redirectTo?: string,
  tokenHash?: string
) {
  const queryParams = new URLSearchParams({
    type: emailActionType,
  })

  if (tokenHash) {
    queryParams.set('token_hash', tokenHash)
  }

  const nextPath = getNextPath(redirectTo)
  if (nextPath) {
    queryParams.set('next', nextPath)
  }

  const baseUrl = getBaseUrl(siteUrl, redirectTo)
  const authPath = emailActionType === 'signup' ? 'confirm' : 'update-password'

  return `${baseUrl}/auth/${authPath}?${queryParams.toString()}`
}

export async function POST(req: Request) {
  if (!RESEND_API_KEY || !HOOK_SECRET || !SENDER_EMAIL) {
    console.error('Missing required environment variables.')
    return NextResponse.json(
      { error: { message: 'Configuration missing' } },
      { status: 500 }
    )
  }

  const payload = await req.text()
  const headers = Object.fromEntries(req.headers.entries())
  const webhookSecret = HOOK_SECRET.replace('v1,whsec_', '')
  const webhook = new Webhook(webhookSecret)
  const resend = new Resend(RESEND_API_KEY)

  try {
    const {
      user,
      email_data: { token_hash, redirect_to, email_action_type, site_url },
    } = webhook.verify(payload, headers) as unknown as WebhookPayload

    const templateId = EMAIL_TEMPLATES[email_action_type]
    if (!templateId) {
      throw new Error(`Unsupported email action type: ${email_action_type}`)
    }

    const confirmationUrl = buildConfirmationUrl(
      email_action_type,
      site_url,
      redirect_to,
      token_hash
    )

    const { error } = await resend.emails.send({
      from: SENDER_EMAIL,
      to: [user.email],
      template: {
        id: templateId,
        variables: {
          USER_EMAIL: user.email,
          CONFIRMATION_URL: confirmationUrl,
        },
      },
    })

    if (error) {
      throw error
    }

    console.log(
      `Email sent successfully for ${email_action_type} to ${user.email}`
    )

    return NextResponse.json({ success: true }, { status: 200 })
  } catch (error) {
    console.error('Error processing email webhook:', error)
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : 'Unknown error',
        },
      },
      { status: 500 }
    )
  }
}
