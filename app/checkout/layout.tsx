import { FlowShell } from '@/components/auth/FlowShell'

export default function CheckoutLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <FlowShell>{children}</FlowShell>
}
