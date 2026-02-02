import React from "react"
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ConfigProvider } from '@/lib/config-context'
import ClientThemeProvider from '@/components/client-theme-provider'
import './globals.css'

const _geist = Geist({ subsets: ["latin"] });
const _geistMono = Geist_Mono({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'CapitalUY - Compra y Venta de USDT en Uruguay',
  description: 'Tu plataforma confiable para comprar y vender USDT y criptomonedas en Uruguay. Las mejores cotizaciones del mercado.',
  generator: 'v0.app',
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Inline script to synchronise theme class before React hydration */}
        <script dangerouslySetInnerHTML={{ __html: `(() => {
          try {
            const theme = localStorage.getItem('theme');
            if (theme === 'dark') {
              document.documentElement.classList.add('dark');
            } else if (theme === 'light') {
              document.documentElement.classList.remove('dark');
            } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
              document.documentElement.classList.add('dark');
            }
          } catch (e) { /* ignore */ }
        })();` }} />
      </head>
      <body className={`font-sans antialiased`}>
        <ClientThemeProvider>
          <ConfigProvider>
            {children}
            <Analytics />
          </ConfigProvider>
        </ClientThemeProvider>
      </body>
    </html>
  )
}
