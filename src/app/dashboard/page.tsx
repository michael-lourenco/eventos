import EventsDashboardContent from "@/components/dashboard/events-dashboard-content"
import { Skeleton } from "@/components/ui/skeleton"
import { Suspense } from "react"

export const metadata = {
  title: "Dashboard | Eventos Locais",
  description: "Dashboard para análise e estatísticas de eventos locais",
}

export default function DashboardPage() {
  return (
    <div className="container mx-auto py-6">
      <h1 className="mb-6 text-3xl font-bold">
        Dashboard de Eventos
      </h1>

      <Suspense fallback={<DashboardSkeleton />}>
        <EventsDashboardContent />
      </Suspense>
    </div>
  )
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton
            key={i}
            className="h-32 rounded-lg"
          />
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Skeleton className="h-[300px] rounded-lg" />
        <Skeleton className="h-[300px] rounded-lg" />
      </div>
      <Skeleton className="h-[400px] rounded-lg" />
    </div>
  )
}
