"use client"

import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { ProblemStatusChart } from "@/components/dashboard/problem-status-chart"
import { ProblemTimeline } from "@/components/dashboard/problem-timeline"
import { ProblemTypeChart } from "@/components/dashboard/problem-type-chart"
import { RecentProblemsTable } from "@/components/dashboard/recent-problems-table"
import { ResolutionTimeChart } from "@/components/dashboard/resolution-time-chart"
import { StatusTransitionChart } from "@/components/dashboard/status-transition-chart"
import { TopReportersChart } from "@/components/dashboard/top-reporters-chart"
import { UserActivityChart } from "@/components/dashboard/user-activity-chart"
import type { Marker } from "@/components/marker/types/marker"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { dbFirestore, getMarkers } from "@/services/firebase/FirebaseService"
import { useEffect, useState } from "react"

export default function DashboardContent() {
  const [markers, setMarkers] = useState<Marker[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMarkers = async () => {
      try {
        setIsLoading(true)
        const markersData = await getMarkers(dbFirestore)

        // Convert Firestore timestamps to Date objects
        const processedMarkers = markersData.map((marker: any) => ({
          ...marker,
          createdAt: marker.createdAt?.toDate
            ? marker.createdAt.toDate()
            : new Date(marker.createdAt),
        }))

        setMarkers(processedMarkers)
      } catch (error) {
        console.error("Error fetching markers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMarkers()

    // Set up a refresh interval (every 5 minutes)
    const intervalId = setInterval(fetchMarkers, 5 * 60 * 1000)

    return () => clearInterval(intervalId)
  }, [])

  if (isLoading) {
    return <div>Carregando dados...</div>
  }

  return (
    <div className="space-y-6">
      <DashboardStats markers={markers} />

      <Tabs
        defaultValue="overview"
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Visão Geral</TabsTrigger>
          <TabsTrigger value="details">Detalhes</TabsTrigger>
          <TabsTrigger value="users">Usuários</TabsTrigger>
          <TabsTrigger value="table">Tabela</TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="mt-4 space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Status dos Problemas</CardTitle>
                <CardDescription>Distribuição por status atual</CardDescription>
              </CardHeader>
              <CardContent>
                <ProblemStatusChart markers={markers} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tipos de Problemas</CardTitle>
                <CardDescription>Distribuição por categoria</CardDescription>
              </CardHeader>
              <CardContent>
                <ProblemTypeChart markers={markers} />
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Evolução Temporal</CardTitle>
              <CardDescription>
                Problemas reportados e resolvidos ao longo do tempo
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ProblemTimeline markers={markers} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="details"
          className="mt-4 space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Transições de Status</CardTitle>
                <CardDescription>Fluxo de mudanças de status</CardDescription>
              </CardHeader>
              <CardContent>
                <StatusTransitionChart markers={markers} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Tempo Médio de Resolução</CardTitle>
                <CardDescription>
                  Dias até resolução por tipo de problema
                </CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResolutionTimeChart markers={markers} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent
          value="users"
          className="mt-4 space-y-6"
        >
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Principais Usuários</CardTitle>
                <CardDescription>
                  Usuários que mais reportaram problemas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TopReportersChart markers={markers} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Atividade de Usuários</CardTitle>
                <CardDescription>
                  Interações por tipo (likes, resoluções)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <UserActivityChart markers={markers} />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent
          value="table"
          className="mt-4"
        >
          <Card>
            <CardHeader>
              <CardTitle>Problemas Reportados</CardTitle>
              <CardDescription>
                Lista detalhada de todos os problemas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentProblemsTable markers={markers} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
