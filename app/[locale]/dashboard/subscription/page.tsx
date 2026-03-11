import DashboardPricing from '@/components/DashboardPricing';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Subscription - Bunnatic',
  description: 'Manage your subscription plan.',
};

export default function SubscriptionPage() {
  return <DashboardPricing />;
}
