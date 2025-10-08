"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts"
import type { Event } from "@/components/event/types/event"
import { getEventCategoryLabel } from "@/components/event/event-icons"

interface EventCategoryChartProps {
  events: Event[]
}

const COLORS = [
  "#21b6bf", // emerald
  "#3b82f6", // blue
  "#f59e0b", // amber
  "#ef4444", // red
  "#8b5cf6", // purple
  "#ec4899", // pink
  "#06b6d4", // cyan
  "#f97316", // orange
  "#14b8a6", // teal
  "#a855f7", // violet
]

export function EventCategoryChart({ events }: EventCategoryChartProps) {
  // Contagem de eventos por categoria
  const categoryCount: Record<string, number> = {}

  events.forEach((event) => {
    const category = event.category
    categoryCount[category] = (categoryCount[category] || 0) + 1
  })

  // Converter para formato do gráfico
  const data = Object.entries(categoryCount).map(([category, count]) => ({
    name: getEventCategoryLabel(category as any),
    value: count,
    category: category,
  }))

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-muted-foreground">
        Nenhum evento encontrado
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }: any) =>
            `${name}: ${(percent * 100).toFixed(0)}%`
          }
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value) => [`${value} eventos`, "Quantidade"]}
        />
      </PieChart>
    </ResponsiveContainer>
  )
}
