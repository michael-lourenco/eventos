"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { useSubscription } from "@/hooks/use-subscription"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { MapPin, Calendar, Plus, LogOut, Crown, Settings } from "lucide-react"
import Link from "next/link"
import { InternalLayout } from "@/components/common/internal-layout"
import { SubscriptionBadge } from "@/components/subscription/subscription-badge"
import { UsageIndicator } from "@/components/subscription/usage-indicator"

export default function UserPage() {
  const { user, loading, handleLogout } = useAuth()
  const { 
    plan, 
    planName, 
    isPremium, 
    usageInfo, 
    openCustomerPortal,
    loading: subLoading 
  } = useSubscription()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-muted flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
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
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-3">
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
              </div>
              <SubscriptionBadge plan={plan} />
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

        {/* Subscription Card */}
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="h-5 w-5 text-primary" />
              Minha Assinatura
            </CardTitle>
            <CardDescription>
              {isPremium 
                ? 'Você tem acesso aos recursos premium'
                : 'Faça upgrade para criar eventos e acessar recursos premium'
              }
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {!isPremium ? (
              <div className="space-y-4">
                <div className="rounded-lg bg-primary/5 border border-primary/20 p-4">
                  <p className="text-sm text-muted-foreground mb-3">
                    Você está no plano <strong>Visitante</strong>. Faça upgrade para:
                  </p>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <Crown className="h-3 w-3 text-primary" />
                      Criar e publicar eventos
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="h-3 w-3 text-primary" />
                      Analytics avançado
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="h-3 w-3 text-primary" />
                      Destacar eventos no mapa
                    </li>
                    <li className="flex items-center gap-2">
                      <Crown className="h-3 w-3 text-primary" />
                      Eventos recorrentes
                    </li>
                  </ul>
                </div>
                <Button asChild className="w-full">
                  <Link href="/pricing">
                    <Crown className="h-4 w-4 mr-2" />
                    Ver Planos e Preços
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <UsageIndicator
                    title="Eventos Este Mês"
                    used={usageInfo.eventsUsed}
                    limit={usageInfo.eventsLimit}
                    unit="eventos"
                    description="Eventos criados no mês atual"
                  />
                  
                  {usageInfo.highlightsLimit !== 0 && (
                    <UsageIndicator
                      title="Destaques"
                      used={usageInfo.highlightsUsed}
                      limit={usageInfo.highlightsLimit}
                      unit="destaques"
                      description="Destaques usados este mês"
                    />
                  )}
                </div>

                <div className="flex gap-2">
                  <Button asChild variant="outline" className="flex-1">
                    <Link href="/pricing">
                      Ver Outros Planos
                    </Link>
                  </Button>
                  {user.subscription?.stripeCustomerId && (
                    <Button 
                      onClick={openCustomerPortal} 
                      variant="outline"
                      className="flex-1"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Gerenciar Assinatura
                    </Button>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-primary" />
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
                <Calendar className="h-5 w-5 text-primary" />
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
              <MapPin className="h-5 w-5 text-primary" />
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