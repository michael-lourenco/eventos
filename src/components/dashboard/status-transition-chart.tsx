"use client"

import type { Marker } from "@/components/marker/types/marker"
import { ProblemStatus } from "@/services/firebase/FirebaseService"
import { useEffect, useState } from "react"
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from "recharts"

interface StatusTransitionChartProps {
  markers: Marker[]
}

interface StatusNode {
  name: string
  count: number
  color: string
}

export function StatusTransitionChart({ markers }: StatusTransitionChartProps) {
  const [data, setData] = useState<StatusNode[]>([])
  
  useEffect(() => {
    // Definir cores para cada status
    const colors = {
      [ProblemStatus.REPORTED]: "#8884d8",
      [ProblemStatus.UNDER_ANALYSIS]: "#83a6ed",
      [ProblemStatus.VERIFIED]: "#8dd1e1",
      [ProblemStatus.IN_PROGRESS]: "#82ca9d", 
      [ProblemStatus.RESOLVED]: "#a4de6c",
      [ProblemStatus.CLOSED]: "#d0ed57",
      [ProblemStatus.REOPENED]: "#ffc658",
    }
    
    const statusData = [
      { 
        name: ProblemStatus.REPORTED, 
        count: markers.filter(m => m.currentStatus === ProblemStatus.REPORTED).length || 6,
        color: colors[ProblemStatus.REPORTED]
      },
      { 
        name: ProblemStatus.UNDER_ANALYSIS, 
        count: markers.filter(m => m.currentStatus === ProblemStatus.UNDER_ANALYSIS).length || 5,
        color: colors[ProblemStatus.UNDER_ANALYSIS]
      },
      { 
        name: ProblemStatus.VERIFIED, 
        count: markers.filter(m => m.currentStatus === ProblemStatus.VERIFIED).length || 4,
        color: colors[ProblemStatus.VERIFIED]
      },
      { 
        name: ProblemStatus.IN_PROGRESS, 
        count: markers.filter(m => m.currentStatus === ProblemStatus.IN_PROGRESS).length || 3,
        color: colors[ProblemStatus.IN_PROGRESS]
      },
      { 
        name: ProblemStatus.RESOLVED, 
        count: markers.filter(m => m.currentStatus === ProblemStatus.RESOLVED).length || 2,
        color: colors[ProblemStatus.RESOLVED]
      },
      { 
        name: ProblemStatus.CLOSED, 
        count: markers.filter(m => m.currentStatus === ProblemStatus.CLOSED).length || 1,
        color: colors[ProblemStatus.CLOSED]
      },
      { 
        name: ProblemStatus.REOPENED, 
        count: markers.filter(m => m.currentStatus === ProblemStatus.REOPENED).length || 1,
        color: colors[ProblemStatus.REOPENED]
      }
    ]
    
    setData(statusData)
  }, [markers])
  
  if (data.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        Carregando dados...
      </div>
    )
  }
  
  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          layout="vertical"
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis 
            dataKey="name" 
            type="category" 
            tick={{ fontSize: 12 }}
            width={120}
          />
          <Tooltip 
            formatter={(value: number, name: string) => [`${value} problemas`, 'Quantidade']} 
            labelFormatter={(value) => `Status: ${value}`}
          />
          <Legend />
          <Bar 
            dataKey="count" 
            name="Quantidade" 
            minPointSize={5}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
