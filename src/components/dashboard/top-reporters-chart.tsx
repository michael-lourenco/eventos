"use client"

import type { Marker } from "@/components/marker/types/marker"
import { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface TopReportersChartProps {
  markers: Marker[]
}

export function TopReportersChart({ markers }: TopReportersChartProps) {
  const [chartData, setChartData] = useState<{ name: string; count: number }[]>(
    [],
  )

  useEffect(() => {
    // Contagem de problemas por usuário
    const userCounts: Record<string, number> = {}

    markers.forEach((marker) => {
      const email = marker.userEmail
      userCounts[email] = (userCounts[email] || 0) + 1
    })

    // Converter para o formato do gráfico e ordenar por contagem
    const data = Object.entries(userCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10) // Limitar aos 10 principais

    setChartData(data)
  }, [markers])

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        Sem dados disponíveis
      </div>
    )
  }

  // Função para truncar emails longos
  const truncateEmail = (email: string) => {
    if (email.length > 15) {
      return email.substring(0, 12) + "..."
    }
    return email
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer
        width="100%"
        height="100%"
      >
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis
            type="category"
            dataKey="name"
            tick={{ fontSize: 12 }}
            width={80}
            tickFormatter={truncateEmail}
          />
          <Tooltip
            formatter={(value) => [`${value} problemas`, "Quantidade"]}
          />
          <Bar
            dataKey="count"
            fill="#8884d8"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
