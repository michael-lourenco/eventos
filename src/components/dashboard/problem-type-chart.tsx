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

interface ProblemTypeChartProps {
  markers: Marker[]
}

export function ProblemTypeChart({ markers }: ProblemTypeChartProps) {
  const [chartData, setChartData] = useState<{ name: string; count: number }[]>(
    [],
  )

  useEffect(() => {
    // Contagem de tipos de problemas
    const typeCounts: Record<string, number> = {}

    markers.forEach((marker) => {
      const type = marker.type || "Desconhecido"
      typeCounts[type] = (typeCounts[type] || 0) + 1
    })

    // Converter para o formato do gráfico e ordenar por contagem
    const data = Object.entries(typeCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)

    setChartData(data)
  }, [markers])

  if (chartData.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        Sem dados disponíveis
      </div>
    )
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
