import { Button } from "@/components/ui/button"
import { BarChart3, Home, Settings, Users } from "lucide-react"
import type { Metadata } from "next"
import Link from "next/link"
import type React from "react"

export const metadata: Metadata = {
  title: "Dashboard | Eventos Locais",
  description: "Dashboard para análise e estatísticas de eventos locais",
}

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="hidden w-64 flex-col border-r bg-gray-100 md:flex">
        <div className="border-b p-4">
          <h2 className="text-xl font-bold">Eventos Locais</h2>
          <p className="text-muted-foreground text-sm">Painel de Controle</p>
        </div>

        <div className="flex-1 py-4">
          <nav className="space-y-1 px-2">
            <Link
              href="/"
              passHref
            >
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <Home className="mr-2 h-4 w-4" />
                Página Inicial
              </Button>
            </Link>

            <Link
              href="/dashboard"
              passHref
            >
              <Button
                variant="secondary"
                className="w-full justify-start"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Dashboard
              </Button>
            </Link>

            <Link
              href="/users"
              passHref
            >
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <Users className="mr-2 h-4 w-4" />
                Usuários
              </Button>
            </Link>

            <Link
              href="/settings"
              passHref
            >
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <Settings className="mr-2 h-4 w-4" />
                Configurações
              </Button>
            </Link>
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b bg-white p-4">
          <h1 className="text-xl font-bold md:hidden">Eventos Locais</h1>

          <div className="flex items-center space-x-2">
            {/* Mobile menu button would go here */}
            <div className="md:hidden">{/* Mobile menu button */}</div>
          </div>
        </header>

        <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
      </div>
    </div>
  )
}
