import type {Metadata} from 'next';
import {Geist } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "sonner";
import { GoogleAnalytics } from '@/components/GoogleAnalytics';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});
const gaTrackingId = process.env.NEXT_PUBLIC_GA_TRACKING_ID;

export const metadata: Metadata = {
  title: 'Bunnatic - Crea tu web con IA',
  description:
    'La IA crea tu web usando los datos de tu negocio. Gratis para empezar.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={cn("font-sans", geist.variable)}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        <TooltipProvider>
          {gaTrackingId ? <GoogleAnalytics trackingId={gaTrackingId} /> : null}
          {children}
          <Toaster position="top-center" richColors />
        </TooltipProvider>
      </body>
    </html>
  );
}
