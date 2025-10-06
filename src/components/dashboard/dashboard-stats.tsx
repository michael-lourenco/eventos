import type { Marker } from "@/components/marker/types/marker"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProblemStatus } from "@/services/firebase/FirebaseService"
import { AlertTriangle, CheckCircle, Clock, Users } from "lucide-react"

interface DashboardStatsProps {
  markers: Marker[]
}

export function DashboardStats({ markers }: DashboardStatsProps) {
  // Total de problemas reportados
  const totalProblems = markers.length

  // Problemas resolvidos
  const resolvedProblems = markers.filter(
    (marker) => marker.currentStatus === ProblemStatus.RESOLVED,
  ).length

  // Problemas em andamento
  const inProgressProblems = markers.filter(
    (marker) => marker.currentStatus === ProblemStatus.IN_PROGRESS,
  ).length

  // Problemas pendentes (reportados ou em análise)
  const pendingProblems = markers.filter(
    (marker) =>
      marker.currentStatus === ProblemStatus.REPORTED ||
      marker.currentStatus === ProblemStatus.UNDER_ANALYSIS,
  ).length

  // Total de likes
  const totalLikes = markers.reduce(
    (sum, marker) => sum + (marker.likedBy?.length || 0),
    0,
  )

  // Usuários únicos que reportaram problemas
  const uniqueUsers = new Set(markers.map((marker) => marker.userEmail)).size

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Problemas
          </CardTitle>
          <AlertTriangle className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalProblems}</div>
          <p className="text-muted-foreground text-xs">
            Problemas reportados na plataforma
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Resolvidos</CardTitle>
          <CheckCircle className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{resolvedProblems}</div>
          <p className="text-muted-foreground text-xs">
            {Math.round((resolvedProblems / totalProblems) * 100) || 0}% do
            total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Em Andamento</CardTitle>
          <Clock className="h-4 w-4 text-orange-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{inProgressProblems}</div>
          <p className="text-muted-foreground text-xs">
            {Math.round((inProgressProblems / totalProblems) * 100) || 0}% do
            total
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Usuários Ativos</CardTitle>
          <Users className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{uniqueUsers}</div>
          <p className="text-muted-foreground text-xs">
            Usuários reportando problemas
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
