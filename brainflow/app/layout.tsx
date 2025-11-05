import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'BrainFlow - AI 브레인스토밍',
  description: 'AI 기반 무한 확장 마인드맵 브레인스토밍',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  )
}
