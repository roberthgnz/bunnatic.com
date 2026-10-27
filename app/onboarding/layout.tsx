import { Suspense } from 'react'
import { buildPageMetadata } from '@/lib/seo'
import { FlowShell } from '@/components/auth/FlowShell'
import {
  OnboardingSteps,
  StepIndicator,
} from '@/components/auth/OnboardingSteps'

export const metadata = buildPageMetadata({
  locale: 'es',
  title: 'Configura tu negocio',
  description: 'Configuración inicial de tu cuenta de Locavo.',
  esPath: '/onboarding',
  noindex: true,
})

export default function OnboardingLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <FlowShell
      steps={
        <Suspense fallback={<StepIndicator current={0} />}>
          <OnboardingSteps />
        </Suspense>
      }
    >
      {children}
    </FlowShell>
  )
}
