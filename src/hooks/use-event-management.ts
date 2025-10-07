"use client"

import { useState } from "react"
import { updateEvent, removeEvent, dbFirestore } from "@/services/events/EventService"
import type { Event } from "@/components/event/types/event"

export function useEventManagement() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const editEvent = async (eventId: string, updatedData: Partial<Event>) => {
    setLoading(true)
    setError(null)
    
    try {
      await updateEvent(dbFirestore, eventId, updatedData)
      console.log("Evento editado com sucesso:", eventId)
      return true
    } catch (error) {
      console.error("Erro ao editar evento:", error)
      setError("Erro ao editar evento. Tente novamente.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const deleteEvent = async (eventId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      await removeEvent(dbFirestore, eventId)
      console.log("Evento deletado com sucesso:", eventId)
      return true
    } catch (error) {
      console.error("Erro ao deletar evento:", error)
      setError("Erro ao deletar evento. Tente novamente.")
      return false
    } finally {
      setLoading(false)
    }
  }

  const cancelEvent = async (eventId: string) => {
    setLoading(true)
    setError(null)
    
    try {
      await updateEvent(dbFirestore, eventId, { status: "cancelled" })
      console.log("Evento cancelado com sucesso:", eventId)
      return true
    } catch (error) {
      console.error("Erro ao cancelar evento:", error)
      setError("Erro ao cancelar evento. Tente novamente.")
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    editEvent,
    deleteEvent,
    cancelEvent,
    loading,
    error,
    clearError: () => setError(null)
  }
}
