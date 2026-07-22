import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Torre de Oração e Adoração',
  description: 'Sistema de Gestão — Ministério Torre de Oração e Adoração',
  viewport: 'width=device-width, initial-scale=1',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
