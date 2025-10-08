"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/hooks/use-auth"
import { useEvents } from "@/hooks/use-events"
import { useEventManagement } from "@/hooks/use-event-management"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, Users, Eye, Plus, Edit, Trash2, ExternalLink } from "lucide-react"
import { format } from "date-fns"
import type { Event, EventStatus } from "@/components/event/types/event"
import { EventStatus as EventStatusEnum } from "@/components/event/types/event"
import { InternalLayout } from "@/components/common/internal-layout"
import { EventEditModal } from "@/components/event/event-edit-modal"
import { EventDeleteModal } from "@/components/event/event-delete-modal"
import { toast } from "sonner"

export default function OrganizerDashboardPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { events, loadAllEventsFromFirebase, loading: eventsLoading } = useEvents()
  const { editEvent, deleteEvent, loading: managementLoading, error: managementError } = useEventManagement()
  
  // Estados para modais
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [deletingEvent, setDeletingEvent] = useState<Event | null>(null)
  
  // Função auxiliar para formatar datas
  const formatEventDate = (date: any) => {
    try {
      if (!date) return "Data não definida"
      const eventDate = new Date(date)
      if (isNaN(eventDate.getTime())) return "Data inválida"
      return format(eventDate, "dd/MM/yyyy HH:mm")
    } catch (error) {
      console.error("Erro ao formatar data:", error, date)
      return "Data inválida"
    }
  }
  const [stats, setStats] = useState({
    totalEvents: 0,
    activeEvents: 0,
    totalInterested: 0,
    totalAttendees: 0
  })

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  useEffect(() => {
    if (user) {
      loadAllEventsFromFirebase()
    }
  }, [user, loadAllEventsFromFirebase])

  // Filtrar eventos do organizador atual
  const organizerEvents = useMemo(() => {
    return events.filter(event => event.organizerEmail === user?.email)
  }, [events, user?.email])
  
  // Debug logs
  console.log("Dashboard Debug:", {
    userEmail: user?.email,
    totalEvents: events.length,
    organizerEvents: organizerEvents.length,
    events: events.map(e => ({ id: e.id, title: e.title, organizerEmail: e.organizerEmail, status: e.status }))
  })

  useEffect(() => {
    const newStats = {
      totalEvents: organizerEvents.length,
      activeEvents: organizerEvents.filter(e => e.status === "active").length,
      totalInterested: organizerEvents.reduce((sum, e) => sum + (e.interestedBy?.length || 0), 0),
      totalAttendees: organizerEvents.reduce((sum, e) => sum + (e.attendedBy?.length || 0), 0)
    }
    setStats(newStats)
  }, [organizerEvents])

  // Funções de gerenciamento de eventos
  const handleEditEvent = async (eventId: string, updatedData: Partial<Event>) => {
    const success = await editEvent(eventId, updatedData)
    if (success) {
      toast.success("Evento editado com sucesso!")
      await loadAllEventsFromFirebase() // Recarregar lista
    } else {
      toast.error("Erro ao editar evento")
    }
    return success
  }

  const handleDeleteEvent = async (eventId: string) => {
    const success = await deleteEvent(eventId)
    if (success) {
      toast.success("Evento excluído com sucesso!")
      await loadAllEventsFromFirebase() // Recarregar lista
    } else {
      toast.error("Erro ao excluir evento")
    }
    return success
  }

  const getStatusBadge = (status: EventStatus) => {
    const statusConfig = {
      [EventStatusEnum.DRAFT]: { label: "Rascunho", variant: "secondary" as const },
      [EventStatusEnum.PUBLISHED]: { label: "Publicado", variant: "default" as const },
      [EventStatusEnum.ACTIVE]: { label: "Ativo", variant: "default" as const },
      [EventStatusEnum.CANCELLED]: { label: "Cancelado", variant: "destructive" as const },
      [EventStatusEnum.COMPLETED]: { label: "Concluído", variant: "outline" as const },
    }

    const config = statusConfig[status] || statusConfig[EventStatusEnum.DRAFT]
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getEventStatus = (event: Event): string => {
    const now = new Date()
    const startDate = event.startDate instanceof Date ? event.startDate : event.startDate.toDate()
    const endDate = event.endDate instanceof Date ? event.endDate : event.endDate.toDate()

    if (event.status === EventStatusEnum.CANCELLED) return "Cancelado"
    if (event.status === EventStatusEnum.COMPLETED) return "Concluído"
    if (now < startDate) return "Em breve"
    if (now >= startDate && now <= endDate) return "Em andamento"
    if (now > endDate) return "Finalizado"
    
    return "Publicado"
  }

  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="container mx-auto py-8 text-center">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Redirecionando para login...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <InternalLayout
      title="Dashboard do Organizador"
      subtitle="Gerencie seus eventos e acompanhe o engajamento"
    >
      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mb-8">
        <Button 
          onClick={() => loadAllEventsFromFirebase()}
          variant="outline"
          disabled={eventsLoading}
        >
          {eventsLoading ? "Carregando..." : "Atualizar"}
        </Button>
        <Link href="/organizer/create">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Criar Evento
          </Button>
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Eventos</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eventos Ativos</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeEvents}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Interessados</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalInterested}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Participantes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalAttendees}</div>
          </CardContent>
        </Card>
      </div>

      {/* Events List */}
      <Card>
        <CardHeader>
          <CardTitle>Meus Eventos</CardTitle>
          <CardDescription>
            Gerencie todos os seus eventos publicados
          </CardDescription>
        </CardHeader>
        <CardContent>
          {eventsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mr-2"></div>
              <span>Carregando eventos...</span>
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Nenhum evento encontrado</h3>
              <p className="text-muted-foreground mb-4">
                Você ainda não criou nenhum evento. Que tal criar o primeiro?
              </p>
              <Button onClick={() => router.push("/organizer/create")}>
                <Plus className="h-4 w-4 mr-2" />
                Criar Primeiro Evento
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
                        {organizerEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-medium">{event.title}</h3>
                      {getStatusBadge(event.status)}
                      <Badge variant="outline">{getEventStatus(event)}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">
                      {event.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatEventDate(event.startDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="h-3 w-3" />
                        {event.interestedBy?.length || 0} interessados
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {event.attendedBy?.length || 0} participantes
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/events?event=${event.id}`}>
                        <ExternalLink className="h-3 w-3 mr-1" />
                        Ver
                      </Link>
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setEditingEvent(event)}
                      disabled={managementLoading}
                    >
                      <Edit className="h-3 w-3 mr-1" />
                      Editar
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-destructive hover:text-destructive/90"
                      onClick={() => setDeletingEvent(event)}
                      disabled={managementLoading}
                    >
                      <Trash2 className="h-3 w-3 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modals */}
      {editingEvent && (
        <EventEditModal
          event={editingEvent}
          open={!!editingEvent}
          onOpenChange={(open) => !open && setEditingEvent(null)}
          onSave={handleEditEvent}
          loading={managementLoading}
        />
      )}

      {deletingEvent && (
        <EventDeleteModal
          event={deletingEvent}
          open={!!deletingEvent}
          onOpenChange={(open) => !open && setDeletingEvent(null)}
          onConfirm={handleDeleteEvent}
          loading={managementLoading}
        />
      )}
    </InternalLayout>
  )
}
