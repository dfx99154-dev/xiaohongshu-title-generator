import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: '小红书标题生成器',
  description: 'AI 驱动的小红书爆款标题生成工具',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN">
      <body>{children}</body>
    </html>
  )
}
