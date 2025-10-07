"use client"

import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Calendar, Plus, User, LogOut, Home, Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface AppNavigationProps {
  title?: string
  subtitle?: string
  children?: React.ReactNode
}

export function AppNavigation({ title, subtitle, children }: AppNavigationProps) {
  const { user, handleLogout } = useAuth()
  const pathname = usePathname()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navigationItems = [
    {
      title: "Início",
      url: "/",
      icon: Home,
      description: "Página inicial"
    },
    {
      title: "Eventos",
      url: "/events",
      icon: MapPin,
      description: "Ver todos os eventos"
    },
    {
      title: "Criar Evento",
      url: "/organizer/create",
      icon: Plus,
      description: "Publicar novo evento",
      requireAuth: true,
    },
    {
      title: "Meus Eventos",
      url: "/organizer/dashboard",
      icon: Calendar,
      description: "Gerenciar meus eventos",
      requireAuth: true,
    },
    {
      title: "Minha Conta",
      url: "/user",
      icon: User,
      description: "Perfil e configurações",
      requireAuth: true,
    },
  ]

  const handleLogoutClick = async () => {
    try {
      await handleLogout()
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  return (
    <>
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <MapPin className="h-6 w-6 text-emerald-500" />
              <span className="text-xl font-bold text-emerald-700">Eventos Locais</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              {navigationItems.map((item) => {
                if (item.requireAuth && !user) return null
                
                const isActive = pathname === item.url
                const Icon = item.icon
                
                return (
                  <Link
                    key={item.title}
                    href={item.url}
                    className={cn(
                      "flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                      isActive 
                        ? "bg-emerald-100 text-emerald-700" 
                        : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.title}</span>
                  </Link>
                )
              })}
            </nav>

            {/* User Menu Desktop */}
            <div className="hidden md:flex items-center gap-4">
              {user ? (
                <div className="flex items-center gap-2">
                  <Button asChild variant="outline" size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500">
                    <Link href="/user">
                      <Avatar className="h-6 w-6 mr-2">
                        <AvatarImage src={user.photoURL} alt={user.displayName} />
                        <AvatarFallback className="text-xs bg-white text-emerald-600">
                          {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                        </AvatarFallback>
                      </Avatar>
                      Minha Conta
                    </Link>
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogoutClick}
                    className="text-gray-600 hover:text-red-600"
                  >
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <Button asChild size="sm">
                  <Link href="/login">
                    <User className="h-4 w-4 mr-2" />
                    Entrar
                  </Link>
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="sm"
              className="md:hidden"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="container mx-auto px-4 py-4">
              <nav className="space-y-2">
                {navigationItems.map((item) => {
                  if (item.requireAuth && !user) return null
                  
                  const isActive = pathname === item.url
                  const Icon = item.icon
                  
                  return (
                    <Link
                      key={item.title}
                      href={item.url}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={cn(
                        "flex items-center gap-3 px-3 py-3 rounded-md text-sm font-medium transition-colors",
                        isActive 
                          ? "bg-emerald-100 text-emerald-700" 
                          : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
                      )}
                    >
                      <Icon className="h-4 w-4" />
                      <div>
                        <p>{item.title}</p>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </Link>
                  )
                })}
              </nav>

              {/* Mobile User Section */}
              <div className="mt-6 pt-6 border-t border-gray-200">
                {user ? (
                  <div className="flex items-center gap-2 px-3 py-3">
                    <Button asChild variant="outline" className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white border-emerald-500">
                      <Link href="/user" onClick={() => setIsMobileMenuOpen(false)}>
                        <Avatar className="h-5 w-5 mr-2">
                          <AvatarImage src={user.photoURL} alt={user.displayName} />
                          <AvatarFallback className="text-xs bg-white text-emerald-600">
                            {user.displayName?.charAt(0)?.toUpperCase() || user.email?.charAt(0)?.toUpperCase() || "U"}
                          </AvatarFallback>
                        </Avatar>
                        Minha Conta
                      </Link>
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleLogoutClick}
                      className="text-gray-600 hover:text-red-600"
                    >
                      <LogOut className="h-4 w-4" />
                    </Button>
                  </div>
                ) : (
                  <Button asChild className="w-full">
                    <Link href="/login" onClick={() => setIsMobileMenuOpen(false)}>
                      <User className="h-4 w-4 mr-2" />
                      Entrar
                    </Link>
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Page Content */}
      <main className="flex-1">
        {(title || subtitle) && (
          <div className="bg-gray-50 border-b border-gray-200">
            <div className="container mx-auto px-4 py-8">
              {title && (
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
              )}
              {subtitle && (
                <p className="text-gray-600">{subtitle}</p>
              )}
            </div>
          </div>
        )}
        <div className="container mx-auto px-4 py-8">
          {children}
        </div>
      </main>
    </>
  )
}
