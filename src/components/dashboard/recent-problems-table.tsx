"use client"

import type { Marker } from "@/components/marker/types/marker"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  ProblemStatus,
  updateMarkerStatus,
} from "@/services/firebase/FirebaseService"
import {
  ChevronDown,
  ChevronUp,
  Edit,
  Eye,
  MoreHorizontal,
  Search,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"

interface RecentProblemsTableProps {
  markers: Marker[]
}

export function RecentProblemsTable({ markers }: RecentProblemsTableProps) {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [sortField, setSortField] = useState<keyof Marker>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Filtrar marcadores com base no termo de pesquisa
  const filteredMarkers = markers.filter(
    (marker) =>
      marker.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      marker.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (marker.currentStatus &&
        marker.currentStatus.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  // Ordenar marcadores
  const sortedMarkers = [...filteredMarkers].sort((a, b) => {
    if (sortField === "createdAt") {
      const dateA =
        a.createdAt instanceof Date
          ? a.createdAt
          : new Date(a.createdAt.toDate())
      const dateB =
        b.createdAt instanceof Date
          ? b.createdAt
          : new Date(b.createdAt.toDate())

      return sortDirection === "asc"
        ? dateA.getTime() - dateB.getTime()
        : dateB.getTime() - dateA.getTime()
    }

    const valueA = String(a[sortField] || "")
    const valueB = String(b[sortField] || "")

    return sortDirection === "asc"
      ? valueA.localeCompare(valueB)
      : valueB.localeCompare(valueA)
  })

  // Alternar a direção da ordenação
  const toggleSort = (field: keyof Marker) => {
    if (field === sortField) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  // Renderizar ícone de ordenação
  const renderSortIcon = (field: keyof Marker) => {
    if (field !== sortField) return null

    return sortDirection === "asc" ? (
      <ChevronUp className="ml-1 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-1 h-4 w-4" />
    )
  }

  // Formatar data
  const formatDate = (date: Date | any) => {
    if (!date) return "N/A"

    const d = date instanceof Date ? date : new Date(date.toDate())
    return d.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  // Obter cor do status
  const getStatusColor = (status: string) => {
    switch (status) {
      case ProblemStatus.REPORTED:
        return "bg-yellow-500"
      case ProblemStatus.UNDER_ANALYSIS:
        return "bg-blue-500"
      case ProblemStatus.VERIFIED:
        return "bg-purple-500"
      case ProblemStatus.IN_PROGRESS:
        return "bg-orange-500"
      case ProblemStatus.RESOLVED:
        return "bg-green-500"
      case ProblemStatus.CLOSED:
        return "bg-gray-500"
      case ProblemStatus.REOPENED:
        return "bg-red-500"
      default:
        return "bg-gray-400"
    }
  }

  // Atualizar status do problema
  const handleStatusUpdate = async (
    markerId: string,
    newStatus: ProblemStatus,
  ) => {
    try {
      // Assumindo que temos o email do usuário atual
      const userEmail = "admin@example.com" // Substituir pelo email real do usuário logado

      await updateMarkerStatus(
        markerId,
        newStatus,
        `Status atualizado para ${newStatus}`,
        userEmail,
      )

      // Recarregar a página para atualizar os dados
      router.refresh()
    } catch (error) {
      console.error("Erro ao atualizar status:", error)
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Search className="text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Pesquisar problemas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("type")}
              >
                <div className="flex items-center">
                  Tipo {renderSortIcon("type")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("currentStatus")}
              >
                <div className="flex items-center">
                  Status {renderSortIcon("currentStatus")}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => toggleSort("createdAt")}
              >
                <div className="flex items-center">
                  Data {renderSortIcon("createdAt")}
                </div>
              </TableHead>
              <TableHead>Reportado por</TableHead>
              <TableHead>Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedMarkers.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center"
                >
                  Nenhum problema encontrado
                </TableCell>
              </TableRow>
            ) : (
              sortedMarkers.map((marker) => (
                <TableRow key={marker.id}>
                  <TableCell>{marker.type}</TableCell>
                  <TableCell>
                    <Badge className={getStatusColor(marker.currentStatus)}>
                      {marker.currentStatus || ProblemStatus.REPORTED}
                    </Badge>
                  </TableCell>
                  <TableCell>{formatDate(marker.createdAt)}</TableCell>
                  <TableCell>{marker.userEmail}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Abrir menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>
                          <Eye className="mr-2 h-4 w-4" />
                          Ver detalhes
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>

                        {/* Opções de status */}
                        {marker.currentStatus !==
                          ProblemStatus.UNDER_ANALYSIS && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(
                                marker.id,
                                ProblemStatus.UNDER_ANALYSIS,
                              )
                            }
                          >
                            Marcar como Em Análise
                          </DropdownMenuItem>
                        )}

                        {marker.currentStatus !== ProblemStatus.VERIFIED && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(
                                marker.id,
                                ProblemStatus.VERIFIED,
                              )
                            }
                          >
                            Marcar como Verificado
                          </DropdownMenuItem>
                        )}

                        {marker.currentStatus !== ProblemStatus.IN_PROGRESS && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(
                                marker.id,
                                ProblemStatus.IN_PROGRESS,
                              )
                            }
                          >
                            Marcar como Em Andamento
                          </DropdownMenuItem>
                        )}

                        {marker.currentStatus !== ProblemStatus.RESOLVED && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(
                                marker.id,
                                ProblemStatus.RESOLVED,
                              )
                            }
                          >
                            Marcar como Resolvido
                          </DropdownMenuItem>
                        )}

                        {marker.currentStatus !== ProblemStatus.CLOSED && (
                          <DropdownMenuItem
                            onClick={() =>
                              handleStatusUpdate(
                                marker.id,
                                ProblemStatus.CLOSED,
                              )
                            }
                          >
                            Marcar como Fechado
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
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
