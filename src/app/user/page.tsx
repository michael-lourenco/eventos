"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Calendar, Plus, LogOut } from "lucide-react"
import Link from "next/link"
import { InternalLayout } from "@/components/common/internal-layout"

export default function UserPage() {
  const { user, loading, handleLogout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500 mx-auto mb-4"></div>
          <p className="text-lg font-medium">Carregando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  const handleLogoutClick = async () => {
    try {
      await handleLogout()
      router.push("/")
    } catch (error) {
      console.error("Erro ao fazer logout:", error)
    }
  }

  return (
    <InternalLayout
      title="Minha Conta"
      subtitle="Bem-vindo à sua área de usuário"
    >
      <div className="max-w-4xl mx-auto">

        {/* User Profile Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-3">
              <Avatar className="h-12 w-12">
                <AvatarImage src={user.photoURL} alt={user.displayName} />
                <AvatarFallback>
                  {user.displayName?.charAt(0)?.toUpperCase() || "U"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h2 className="text-xl font-semibold">{user.displayName}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button onClick={handleLogoutClick} variant="outline">
                <LogOut className="h-4 w-4 mr-2" />
                Sair
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-cyan-500" />
                Criar Evento
              </CardTitle>
              <CardDescription>
                Publique um novo evento no mapa
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full">
                <Link href="/organizer/create">
                  <Plus className="h-4 w-4 mr-2" />
                  Criar Evento
                </Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-cyan-500" />
                Meus Eventos
              </CardTitle>
              <CardDescription>
                Gerencie seus eventos publicados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link href="/organizer/dashboard">
                  <Calendar className="h-4 w-4 mr-2" />
                  Ver Dashboard
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Explore Events */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-cyan-500" />
              Explorar Eventos
            </CardTitle>
            <CardDescription>
              Descubra eventos próximos a você
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/events">
                <MapPin className="h-4 w-4 mr-2" />
                Ver Mapa de Eventos
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </InternalLayout>
  )
}