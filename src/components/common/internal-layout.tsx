"use client"

import { AppNavigation } from "./app-navigation"

interface InternalLayoutProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
}

export function InternalLayout({ title, subtitle, children }: InternalLayoutProps) {
  return (
    <div className="min-h-screen bg-muted">
      <AppNavigation title={title} subtitle={subtitle}>
        {children}
      </AppNavigation>
    </div>
  )
}
