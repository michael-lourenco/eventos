"use client"

import type { Marker } from "@/components/marker/types/marker"
import { ProblemStatus } from "@/services/firebase/FirebaseService"
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

interface ResolutionTimeChartProps {
  markers: Marker[]
}

export function ResolutionTimeChart({ markers }: ResolutionTimeChartProps) {
  const [chartData, setChartData] = useState<{ name: string; days: number }[]>(
    [],
  )

  useEffect(() => {
    // Agrupar por tipo de problema
    const problemTypes: Record<string, { total: number; count: number }> = {}

    // Filtrar apenas problemas resolvidos
    const resolvedMarkers = markers.filter(
      (marker) => marker.currentStatus === ProblemStatus.RESOLVED,
    )

    // Calcular tempo médio de resolução (simulado)
    resolvedMarkers.forEach((marker) => {
      const type = marker.type

      // Simular tempo de resolução (em dias)
      // Em um cenário real, você calcularia a diferença entre a data de criação e a data de resolução
      const resolutionDays = Math.floor(Math.random() * 14) + 1 // Simulação: 1-14 dias

      if (!problemTypes[type]) {
        problemTypes[type] = { total: 0, count: 0 }
      }

      problemTypes[type].total += resolutionDays
      problemTypes[type].count += 1
    })

    // Calcular médias e formatar dados
    const data = Object.entries(problemTypes)
      .map(([name, stats]) => ({
        name,
        days: Math.round((stats.total / stats.count) * 10) / 10, // Arredondar para 1 casa decimal
      }))
      .sort((a, b) => b.days - a.days)

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
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis
            label={{ value: "Dias", angle: -90, position: "insideLeft" }}
          />
          <Tooltip formatter={(value) => [`${value} dias`, "Tempo médio"]} />
          <Bar
            dataKey="days"
            name="Dias até resolução"
            fill="#8884d8"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
