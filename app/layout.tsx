import type {Metadata} from 'next';
import {Inter, Geist } from 'next/font/google';
import './globals.css';
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Nova Web - Crea tu web con IA',
  description:
    'La IA crea tu web usando los datos de tu negocio. Gratis para empezar.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="es" className={cn("font-sans", geist.variable)}>
      <body className="font-sans antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
