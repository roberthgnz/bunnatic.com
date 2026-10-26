import { Suspense } from 'react'
import { FlowShell } from '@/components/auth/FlowShell'
import {
  OnboardingSteps,
  StepIndicator,
} from '@/components/auth/OnboardingSteps'

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
