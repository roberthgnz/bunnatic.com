import 'dotenv/config'
import * as React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import { renderToStaticMarkup } from 'react-dom/server'
import { Resend } from 'resend'

const templateName = 'confirm-sign-up'
const confirmationUrlVariable = '{{{CONFIRMATION_URL}}}'

function ConfirmSignUpTemplate() {
  return (
    <Html>
      <Head />
      <Preview>Confirma tu registro en Bunnatic</Preview>
      <Body style={mainStyle}>
        <Container style={container}>
          <Heading style={heading}>Confirma tu cuenta</Heading>
          <Text style={paragraph}>
            Gracias por registrarte. Haz clic en el siguiente botón para
            confirmar tu cuenta.
          </Text>
          <Section style={buttonContainer}>
            <Button href={confirmationUrlVariable} style={button}>
              Confirmar registro
            </Button>
          </Section>
          <Text style={paragraph}>
            Si el botón no funciona, copia y pega esta URL en tu navegador:
          </Text>
          <Link href={confirmationUrlVariable} style={link}>
            {confirmationUrlVariable}
          </Link>
        </Container>
      </Body>
    </Html>
  )
}

async function main() {
  const apiKey = process.env.RESEND_API_KEY

  if (!apiKey) {
    console.error(
      'Missing RESEND_API_KEY. Add it to your environment before running this script.'
    )
    process.exit(1)
  }

  const resend = new Resend(apiKey)
  const html = `<!DOCTYPE html>${renderToStaticMarkup(<ConfirmSignUpTemplate />)}`
  const createResult = await resend.templates.create({
    name: templateName,
    alias: templateName,
    subject: 'Confirma tu cuenta',
    html,
    variables: [
      {
        key: 'CONFIRMATION_URL',
        type: 'string',
        fallbackValue: 'https://example.com/confirm',
      },
    ],
  })

  if (createResult.error) {
    console.error('Template creation failed:')
    console.error(createResult.error)
    process.exit(1)
  }

  const templateId = createResult.data?.id

  if (!templateId) {
    console.error('Template created without an ID.')
    process.exit(1)
  }

  const publishResult = await resend.templates.publish(templateId)

  if (publishResult.error) {
    console.error('Template created but publish failed:')
    console.error(publishResult.error)
    console.log(`Template ID: ${templateId}`)
    process.exit(1)
  }

  console.log('Template created and published successfully:')
  console.log(`Name: ${templateName}`)
  console.log(`Template ID: ${templateId}`)
}

const mainStyle: React.CSSProperties = {
  backgroundColor: '#f6f9fc',
  fontFamily: 'Helvetica, Arial, sans-serif',
  padding: '24px 0',
}

const container: React.CSSProperties = {
  backgroundColor: '#ffffff',
  border: '1px solid #eaeaea',
  borderRadius: '8px',
  margin: '0 auto',
  maxWidth: '560px',
  padding: '32px',
}

const heading: React.CSSProperties = {
  color: '#111827',
  fontSize: '24px',
  fontWeight: 700,
  margin: '0 0 16px',
}

const paragraph: React.CSSProperties = {
  color: '#374151',
  fontSize: '16px',
  lineHeight: '24px',
  margin: '0 0 16px',
}

const buttonContainer: React.CSSProperties = {
  margin: '28px 0',
  textAlign: 'center',
}

const button: React.CSSProperties = {
  backgroundColor: '#111827',
  borderRadius: '6px',
  color: '#ffffff',
  display: 'inline-block',
  fontSize: '15px',
  fontWeight: 600,
  padding: '12px 20px',
  textDecoration: 'none',
}

const link: React.CSSProperties = {
  color: '#2563eb',
  fontSize: '14px',
  lineHeight: '22px',
  textDecoration: 'underline',
  wordBreak: 'break-all',
}

main().catch((error) => {
  console.error('Unexpected error creating template:')
  console.error(error)
  process.exit(1)
})
