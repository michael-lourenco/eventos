"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Plus, MapPin, Calendar } from "lucide-react"
import SimpleEventsMap from "@/components/map/simple-events-map"

export default function EventsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  // Quando está carregando, mostra um indicador de carregamento
  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="text-center">
          <p className="text-lg font-medium">Carregando...</p>
          <p className="text-sm text-muted-foreground">Por favor, aguarde enquanto carregamos os recursos.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative h-screen w-full">
      {/* Header com botões de ação */}
      <div className="absolute top-4 right-4 z-[1000] flex gap-2">
        {user ? (
          <>
            <Button
              onClick={() => router.push("/organizer/dashboard")}
              variant="outline"
              size="sm"
              className="bg-white/90 backdrop-blur-sm"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Meus Eventos
            </Button>
            <Button
              onClick={() => router.push("/organizer/create")}
              size="sm"
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Evento
            </Button>
          </>
        ) : (
          <Button
            onClick={() => router.push("/login")}
            size="sm"
            className="bg-cyan-600 hover:bg-cyan-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Criar Evento
          </Button>
        )}
      </div>

      {/* Mapa de eventos */}
      <SimpleEventsMap onNeedLogin={() => router.push("/login")} />
    </div>
  )
}
