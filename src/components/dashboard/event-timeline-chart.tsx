"use client"

import { useEffect, useState } from "react"
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis, Legend, CartesianGrid } from "recharts"
import type { Event } from "@/components/event/types/event"

interface EventTimelineChartProps {
  events: Event[]
}

interface TimelineData {
  date: string
  criados: number
  finalizados: number
}

export function EventTimelineChart({ events }: EventTimelineChartProps) {
  const [timelineData, setTimelineData] = useState<TimelineData[]>([])

  useEffect(() => {
    if (events.length === 0) return

    const today = new Date()

    // Filtrar apenas eventos com data até hoje
    const validEvents = events.filter((event) => {
      const date = event.createdAt instanceof Date
        ? event.createdAt
        : event.createdAt.toDate()
      return date <= today
    })

    if (validEvents.length === 0) return

    // Agrupar eventos por data
    const dateGroups: Record<string, { criados: number; finalizados: number }> = {}

    // Ordenar eventos por data
    const sortedEvents = [...validEvents].sort((a, b) => {
      const dateA = a.createdAt instanceof Date ? a.createdAt : a.createdAt.toDate()
      const dateB = b.createdAt instanceof Date ? b.createdAt : b.createdAt.toDate()
      return dateA.getTime() - dateB.getTime()
    })

    // Preencher datas intermediárias
    const startDate = sortedEvents[0].createdAt instanceof Date
      ? sortedEvents[0].createdAt
      : sortedEvents[0].createdAt.toDate()

    const dateRange: Date[] = []
    const currentDate = new Date(startDate)

    while (currentDate <= today) {
      dateRange.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Inicializar todas as datas no grupo
    dateRange.forEach((date) => {
      const dateStr = date.toISOString().split("T")[0]
      dateGroups[dateStr] = { criados: 0, finalizados: 0 }
    })

    // Contar eventos por data
    let totalCriados = 0
    let totalFinalizados = 0

    sortedEvents.forEach((event) => {
      const createdAt = event.createdAt instanceof Date
        ? event.createdAt
        : event.createdAt.toDate()
      const dateStr = createdAt.toISOString().split("T")[0]

      if (dateGroups[dateStr]) {
        totalCriados++
        dateGroups[dateStr].criados = totalCriados

        // Verificar se o evento foi finalizado
        if (event.status === "completed") {
          totalFinalizados++
        }
        dateGroups[dateStr].finalizados = totalFinalizados
      }
    })

    // Converter para array para o gráfico
    const chartData = Object.entries(dateGroups)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, counts]) => ({
        date: new Date(date).toLocaleDateString("pt-BR", {
          day: "2-digit",
          month: "2-digit",
        }),
        criados: counts.criados,
        finalizados: counts.finalizados,
      }))

    setTimelineData(chartData)
  }, [events])

  if (timelineData.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        Nenhum dado disponível
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={timelineData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 12 }}
        />
        <YAxis tick={{ fontSize: 12 }} />
        <Tooltip
          formatter={(value, name) =>
            [value, name === "criados" ? "Eventos Criados" : "Eventos Finalizados"]
          }
        />
        <Legend
          formatter={(value) =>
            value === "criados" ? "Eventos Criados" : "Eventos Finalizados"
          }
        />
        <Line
          type="monotone"
          dataKey="criados"
          stroke="hsl(var(--chart-1))"
          strokeWidth={2}
          name="criados"
        />
        <Line
          type="monotone"
          dataKey="finalizados"
          stroke="hsl(var(--chart-2))"
          strokeWidth={2}
          name="finalizados"
        />
      </LineChart>
    </ResponsiveContainer>
  )
}
