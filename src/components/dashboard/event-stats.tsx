"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Users, Eye } from "lucide-react"
import type { Event } from "@/components/event/types/event"

interface EventStatsProps {
  events: Event[]
}

export function EventStats({ events }: EventStatsProps) {
  // Total de eventos
  const totalEvents = events.length

  // Eventos ativos (status active ou published)
  const activeEvents = events.filter(
    e => e.status === "active" || e.status === "published"
  ).length

  // Total de interessados
  const totalInterested = events.reduce(
    (sum, e) => sum + (e.interestedBy?.length || 0),
    0
  )

  // Total de participantes
  const totalAttendees = events.reduce(
    (sum, e) => sum + (e.attendedBy?.length || 0),
    0
  )

  const stats = [
    {
      title: "Total de Eventos",
      value: totalEvents,
      icon: Calendar,
      description: "Eventos criados na plataforma"
    },
    {
      title: "Eventos Ativos",
      value: activeEvents,
      icon: MapPin,
      description: "Eventos disponíveis no mapa"
    },
    {
      title: "Interessados",
      value: totalInterested,
      icon: Eye,
      description: "Total de demonstrações de interesse"
    },
    {
      title: "Participantes",
      value: totalAttendees,
      icon: Users,
      description: "Total de confirmações de participação"
    }
  ]

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <Icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
