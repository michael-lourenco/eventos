"use client"

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import type { Event } from "@/components/event/types/event"

interface OrganizerActivityChartProps {
  events: Event[]
}

export function OrganizerActivityChart({ events }: OrganizerActivityChartProps) {
  // Contagem de eventos por organizador
  const organizerCount: Record<string, number> = {}

  events.forEach((event) => {
    const organizer = event.organizerName || event.organizerEmail
    organizerCount[organizer] = (organizerCount[organizer] || 0) + 1
  })

  // Converter para array e ordenar
  const data = Object.entries(organizerCount)
    .map(([name, count]) => ({
      name: name.length > 20 ? name.substring(0, 20) + "..." : name,
      eventos: count,
    }))
    .sort((a, b) => b.eventos - a.eventos)
    .slice(0, 10) // Top 10

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        Nenhum dado disponível
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data} layout="vertical">
        <XAxis type="number" />
        <YAxis
          dataKey="name"
          type="category"
          width={150}
          tick={{ fontSize: 12 }}
        />
        <Tooltip
          formatter={(value) => [`${value} eventos`, "Quantidade"]}
        />
        <Bar
          dataKey="eventos"
          fill="hsl(var(--chart-1))"
          radius={[0, 4, 4, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}
