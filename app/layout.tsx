import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI Brand Decoder | Transform Your Brand Strategy',
  description: 'AI-powered brand analysis platform. Decode your brand DNA across 6 critical dimensions in under 15 seconds. Powered by GPT-4 Turbo.',
  keywords: ['brand analysis', 'AI', 'GPT-4', 'brand strategy', 'market intelligence'],
  authors: [{ name: 'Brand Decoder Team' }],
  openGraph: {
    title: 'AI Brand Decoder',
    description: 'Transform your brand strategy with AI-powered insights',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="font-sans antialiased min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-slate-50">
        {children}
      </body>
    </html>
  )
}
