"use client"

import type { Marker } from "@/components/marker/types/marker"
import { useEffect, useState } from "react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

interface UserActivityChartProps {
  markers: Marker[]
}

export function UserActivityChart({ markers }: UserActivityChartProps) {
  const [chartData, setChartData] = useState<
    { name: string; likes: number; resolutions: number }[]
  >([])

  useEffect(() => {
    // Contagem de likes e resoluções por usuário
    const userActivity: Record<string, { likes: number; resolutions: number }> =
      {}

    // Contar likes
    markers.forEach((marker) => {
      if (marker.likedBy && marker.likedBy.length > 0) {
        marker.likedBy.forEach((userEmail) => {
          if (!userActivity[userEmail]) {
            userActivity[userEmail] = { likes: 0, resolutions: 0 }
          }
          userActivity[userEmail].likes += 1
        })
      }

      // Contar resoluções
      if (marker.resolvedBy && marker.resolvedBy.length > 0) {
        marker.resolvedBy.forEach((userEmail) => {
          if (!userActivity[userEmail]) {
            userActivity[userEmail] = { likes: 0, resolutions: 0 }
          }
          userActivity[userEmail].resolutions += 1
        })
      }
    })

    // Converter para o formato do gráfico e ordenar por atividade total
    const data = Object.entries(userActivity)
      .map(([name, activity]) => ({
        name,
        likes: activity.likes,
        resolutions: activity.resolutions,
      }))
      .sort((a, b) => b.likes + b.resolutions - (a.likes + a.resolutions))
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
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="name"
            tickFormatter={truncateEmail}
          />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar
            dataKey="likes"
            name="Likes"
            fill="#8884d8"
          />
          <Bar
            dataKey="resolutions"
            name="Resoluções"
            fill="#82ca9d"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
