"use client"

import { EventStats } from "@/components/dashboard/event-stats"
import { EventCategoryChart } from "@/components/dashboard/event-category-chart"
import { EventTimelineChart } from "@/components/dashboard/event-timeline-chart"
import { PopularEventsTable } from "@/components/dashboard/popular-events-table"
import { OrganizerActivityChart } from "@/components/dashboard/organizer-activity-chart"
import { AttendanceChart } from "@/components/dashboard/attendance-chart"
import type { Event } from "@/components/event/types/event"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getEvents, dbFirestore } from "@/services/events/EventService"
import { useEffect, useState } from "react"

export default function EventsDashboardContent() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        const eventsData = await getEvents(dbFirestore)

        // Convert Firestore timestamps to Date objects
        const processedEvents = eventsData.map((event: any) => ({
          ...event,
          createdAt: event.createdAt?.toDate
            ? event.createdAt.toDate()
            : new Date(event.createdAt),
          updatedAt: event.updatedAt?.toDate
            ? event.updatedAt.toDate()
            : new Date(event.updatedAt),
          startDate: event.startDate?.toDate
            ? event.startDate.toDate()
            : new Date(event.startDate),
          endDate: event.endDate?.toDate
            ? event.endDate.toDate()
            : new Date(event.endDate),
        }))

        setEvents(processedEvents as Event[])
      } catch (error) {
        console.error("Error fetching events:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()

    // Set up a refresh interval (every 5 minutes)
    const intervalId = setInterval(fetchEvents, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg font-medium">Carregando dados...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <EventStats events={events} />

      <Tabs
        defaultValue="overview"
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="organizers">Organizadores</TabsTrigger>
          <TabsTrigger value="table">Tabela</TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="mt-4 space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Categorias de Eventos</CardTitle>
                <CardDescription>Distribuição por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <EventCategoryChart events={events} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Engajamento</CardTitle>
                <CardDescription>Interesse vs Participação</CardDescription>
              </CardHeader>
              <CardContent>
                <AttendanceChart events={events} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evolução Temporal</CardTitle>
              <CardDescription>
                Eventos criados e finalizados ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventTimelineChart events={events} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="details"
          className="mt-4 space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Engajamento por Evento</CardTitle>
              <CardDescription>
                Comparação de interesse e participação
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AttendanceChart events={events} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Linha do Tempo</CardTitle>
              <CardDescription>
                Crescimento de eventos ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventTimelineChart events={events} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="organizers"
          className="mt-4 space-y-6"
        >
          <Card>
            <CardHeader>
              <CardTitle>Organizadores Mais Ativos</CardTitle>
              <CardDescription>
                Top 10 organizadores por número de eventos criados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <OrganizerActivityChart events={events} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Distribuição de Categorias</CardTitle>
              <CardDescription>
                Categorias mais populares entre organizadores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <EventCategoryChart events={events} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="table"
          className="mt-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Eventos Mais Populares</CardTitle>
              <CardDescription>
                Lista detalhada dos eventos com maior engajamento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <PopularEventsTable events={events} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
