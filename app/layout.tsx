import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ServiceWorkerProvider } from "@/components/service-worker-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Offline Speech AI Assistant",
  description: "Offline-first speech-to-text AI assistant with local processing",
  manifest: "/manifest.json",
  themeColor: "#000000",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ServiceWorkerProvider />
        {children}
      </body>
    </html>
  )
}
