"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend } from "recharts"
import type { Event } from "@/components/event/types/event"

interface AttendanceChartProps {
  events: Event[]
}

export function AttendanceChart({ events }: AttendanceChartProps) {
  // Pegar eventos com mais engajamento
  const eventsWithEngagement = events
    .filter(e => (e.interestedBy?.length || 0) > 0 || (e.attendedBy?.length || 0) > 0)
    .map(event => ({
      name: event.title.length > 15 ? event.title.substring(0, 15) + "..." : event.title,
      interessados: event.interestedBy?.length || 0,
      participantes: event.attendedBy?.length || 0,
    }))
    .sort((a, b) => (b.interessados + b.participantes) - (a.interessados + a.participantes))
    .slice(0, 10) // Top 10

  if (eventsWithEngagement.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        Nenhum dado de engajamento disponível
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={eventsWithEngagement}>
        <XAxis
          dataKey="name"
          tick={{ fontSize: 11 }}
          angle={-45}
          textAnchor="end"
          height={80}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip />
        <Legend />
        <Bar
          dataKey="interessados"
          fill="#f59e0b"
          name="Interessados"
          radius={[4, 4, 0, 0]}
        />
        <Bar
          dataKey="participantes"
          fill="#10b981"
          name="Participantes"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
