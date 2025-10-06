"use client"

import type { Marker } from "@/components/marker/types/marker"
import { useEffect, useState } from "react"
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface ProblemTimelineProps {
  markers: Marker[]
}

interface TimelineData {
  date: string
  total: number
  resolved: number
}

export function ProblemTimeline({ markers }: ProblemTimelineProps) {
  const [timelineData, setTimelineData] = useState<TimelineData[]>([])

  useEffect(() => {
    if (markers.length === 0) return

    const today = new Date()

    // Filtrar apenas marcadores com data até hoje
    const validMarkers = markers.filter((marker) => {
      const date =
        marker.createdAt instanceof Date
          ? marker.createdAt
          : new Date(marker.createdAt.toDate())
      return date <= today
    })

    if (validMarkers.length === 0) return

    // Agrupar marcadores por data
    const dateGroups: Record<string, { total: number; resolved: number }> = {}

    // Ordenar marcadores por data
    const sortedMarkers = [...validMarkers].sort((a, b) => {
      const dateA =
        a.createdAt instanceof Date
          ? a.createdAt
          : new Date(a.createdAt.toDate())
      const dateB =
        b.createdAt instanceof Date
          ? b.createdAt
          : new Date(b.createdAt.toDate())
      return dateA.getTime() - dateB.getTime()
    })

    // Preencher datas intermediárias
    const startDate =
      sortedMarkers[0].createdAt instanceof Date
        ? sortedMarkers[0].createdAt
        : new Date(sortedMarkers[0].createdAt.toDate())

    const dateRange: Date[] = []
    const currentDate = new Date(startDate)

    while (currentDate <= today) {
      dateRange.push(new Date(currentDate))
      currentDate.setDate(currentDate.getDate() + 1)
    }

    // Inicializar todas as datas no grupo
    dateRange.forEach((date) => {
      const dateStr = date.toISOString().split("T")[0]
      dateGroups[dateStr] = { total: 0, resolved: 0 }
    })

    // Contar problemas por data
    let totalProblems = 0
    let totalResolved = 0

    sortedMarkers.forEach((marker) => {
      const date =
        marker.createdAt instanceof Date
          ? marker.createdAt
          : new Date(marker.createdAt.toDate())

      const dateStr = date.toISOString().split("T")[0]

      if (!dateGroups[dateStr]) {
        dateGroups[dateStr] = { total: 0, resolved: 0 }
      }

      totalProblems++
      dateGroups[dateStr].total = totalProblems

      if (marker.currentStatus === "Resolvido") {
        totalResolved++
      }

      dateGroups[dateStr].resolved = totalResolved
    })

    // Converter para o formato do gráfico
    const data = Object.entries(dateGroups).map(([date, counts]) => ({
      date,
      total: counts.total,
      resolved: counts.resolved,
    }))

    // Ordenar por data
    data.sort((a, b) => a.date.localeCompare(b.date))

    setTimelineData(data)
  }, [markers])

  if (timelineData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        Sem dados disponíveis
      </div>
    )
  }

  // Formatar data para exibição
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
    })
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <LineChart
          data={timelineData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            interval={Math.ceil(timelineData.length / 10)}
          />
          <YAxis />
          <Tooltip
            labelFormatter={(label) => formatDate(label)}
            formatter={(value, name) => [
              value,
              name === "total" ? "Total de Problemas" : "Problemas Resolvidos",
            ]}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="total"
            name="Total de Problemas"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
          <Line
            type="monotone"
            dataKey="resolved"
            name="Problemas Resolvidos"
            stroke="#82ca9d"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
