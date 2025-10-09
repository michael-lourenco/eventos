"use client"

import { AppSidebar } from "@/components/common/app-sidebar"
import CookieConsent from "@/components/common/cookie-consent"
import { ThemeProvider } from "@/components/common/theme-provider"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/sonner"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { SessionProvider } from "next-auth/react"
import { usePathname } from "next/navigation"

export function Providers({ children }: { children: React.ReactNode }) {
  const queryClient = new QueryClient()
  const pathname = usePathname()
  
  // Rotas que não devem ter sidebar
  const noSidebarRoutes = ['/login', '/user', '/organizer/create', '/organizer/dashboard', '/', '/about', '/pricing', '/subscription/success']
  const shouldHideSidebar = noSidebarRoutes.some(route => pathname === route)

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster position="top-center" />
          <CookieConsent />
          {shouldHideSidebar ? (
            children
          ) : (
            <SidebarProvider defaultOpen={false}>
              <AppSidebar />
              {children}
            </SidebarProvider>
          )}
        </ThemeProvider>
      </QueryClientProvider>
    </SessionProvider>
  )
}
