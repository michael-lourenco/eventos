"use client"

import { useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Eye, Users, Calendar } from "lucide-react"
import type { Event } from "@/components/event/types/event"
import { getEventCategoryLabel } from "@/components/event/event-icons"

interface PopularEventsTableProps {
  events: Event[]
}

export function PopularEventsTable({ events }: PopularEventsTableProps) {
  const [searchTerm, setSearchTerm] = useState("")

  // Ordenar por popularidade (interessados + participantes)
  const sortedEvents = [...events].sort((a, b) => {
    const popularityA = (a.interestedBy?.length || 0) + (a.attendedBy?.length || 0)
    const popularityB = (b.interestedBy?.length || 0) + (b.attendedBy?.length || 0)
    return popularityB - popularityA
  })

  // Filtrar por termo de busca
  const filteredEvents = sortedEvents.filter((event) =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    event.organizerName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Pegar top 10
  const topEvents = filteredEvents.slice(0, 10)

  return (
    <div className="space-y-4">
      <Input
        type="text"
        placeholder="Pesquisar eventos..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="max-w-sm"
      />

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Evento</TableHead>
              <TableHead>Categoria</TableHead>
              <TableHead>Organizador</TableHead>
              <TableHead className="text-center">Interessados</TableHead>
              <TableHead className="text-center">Participantes</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {topEvents.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-muted-foreground">
                  Nenhum evento encontrado
                </TableCell>
              </TableRow>
            ) : (
              topEvents.map((event) => (
                <TableRow key={event.id}>
                  <TableCell>
                    <div>
                      <div className="font-medium">{event.title}</div>
                      <div className="text-xs text-muted-foreground line-clamp-1">
                        {event.description}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {getEventCategoryLabel(event.category)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {event.organizerName}
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Eye className="h-3 w-3 text-muted-foreground" />
                      <span>{event.interestedBy?.length || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1">
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span>{event.attendedBy?.length || 0}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        event.status === "active" || event.status === "published"
                          ? "default"
                          : event.status === "cancelled"
                          ? "destructive"
                          : "secondary"
                      }
                    >
                      {event.status === "active" ? "Ativo" :
                       event.status === "published" ? "Publicado" :
                       event.status === "cancelled" ? "Cancelado" :
                       event.status === "completed" ? "Concluído" : "Rascunho"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
