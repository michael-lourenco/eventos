import { useCallback, useEffect, useState, useMemo } from "react"
import type { Event, EventCategory, EventStatus } from "@/components/event/types/event"
import {
  getEvents,
  getActiveEvents,
  getEventsByOrganizer,
  updateEventInterest,
  updateEventAttendance,
  dbFirestore
} from "@/services/events/EventService"

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)

  const loadEventsFromFirebase = useCallback(async () => {
    try {
      setLoading(true)
      const firebaseEvents = await getActiveEvents(dbFirestore)
      setEvents(firebaseEvents as Event[])
    } catch (error) {
      console.error("Erro ao carregar eventos do Firebase:", error)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [dbFirestore])

  const loadAllEventsFromFirebase = useCallback(async () => {
    try {
      setLoading(true)
      console.log("Carregando eventos do Firebase...")
      const firebaseEvents = await getEvents(dbFirestore)
      console.log("Eventos carregados do Firebase:", firebaseEvents)
      setEvents(firebaseEvents as Event[])
    } catch (error) {
      console.error("Erro ao carregar eventos do Firebase:", error)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [dbFirestore])

  const loadOrganizerEvents = useCallback(async (organizerEmail: string) => {
    try {
      setLoading(true)
      const organizerEvents = await getEventsByOrganizer(dbFirestore, organizerEmail)
      setEvents(organizerEvents as Event[])
    } catch (error) {
      console.error("Erro ao carregar eventos do organizador:", error)
      setEvents([])
    } finally {
      setLoading(false)
    }
  }, [dbFirestore])

  // Save a new event to Firebase
  const saveEventToFirebase = useCallback(async (eventData: Omit<Event, 'id'>) => {
    try {
      const eventId = `event_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      const newEventData: Event = {
        id: eventId,
        ...eventData,
      }

      // Add to Firebase using EventService
      const { addEvent } = await import("@/services/events/EventService")
      await addEvent(dbFirestore, newEventData)
      console.log("Evento salvo com sucesso:", newEventData)

      // Update local events state
      setEvents((prev) => [...prev, newEventData])

      return newEventData
    } catch (error) {
      console.error("Erro ao salvar evento no Firebase:", error)
      throw error
    }
  }, [])

  // Get unique event categories
  const eventCategories = useMemo(() => {
    const categories = new Set<EventCategory>()
    events.forEach(event => {
      if (event.category) {
        categories.add(event.category)
      }
    })
    return Array.from(categories)
  }, [events])

  // Filter events by category
  const getFilteredEvents = useCallback((selectedCategories: EventCategory[]) => {
    if (!selectedCategories.length) {
      return events // Return all events if no filter is applied
    }
    return events.filter(event => selectedCategories.includes(event.category))
  }, [events])

  // Filter events by status
  const getEventsByStatus = useCallback((status: EventStatus[]) => {
    if (!status.length) {
      return events
    }
    return events.filter(event => status.includes(event.status))
  }, [events])

  // Handle event interest
  const handleEventInterest = useCallback(async (event: Event) => {
    try {
      const userDataString = localStorage.getItem("user")
      const userData = userDataString ? JSON.parse(userDataString) : null

      if (!userData) {
        throw new Error("Usuário não autenticado")
      }

      await updateEventInterest(dbFirestore, event.id, userData.email)
      
      // Update local state
      setEvents(prev => prev.map(e => 
        e.id === event.id 
          ? { ...e, interestedBy: [...(e.interestedBy || []), userData.email] }
          : e
      ))
    } catch (error) {
      console.error("Erro ao marcar interesse no evento:", error)
      throw error
    }
  }, [])

  // Handle event attendance
  const handleEventAttendance = useCallback(async (event: Event) => {
    try {
      const userDataString = localStorage.getItem("user")
      const userData = userDataString ? JSON.parse(userDataString) : null

      if (!userData) {
        throw new Error("Usuário não autenticado")
      }

      await updateEventAttendance(dbFirestore, event.id, userData.email)
      
      // Update local state
      setEvents(prev => prev.map(e => 
        e.id === event.id 
          ? { 
              ...e, 
              attendedBy: [...(e.attendedBy || []), userData.email],
              currentAttendees: (e.currentAttendees || 0) + 1
            }
          : e
      ))
    } catch (error) {
      console.error("Erro ao confirmar participação no evento:", error)
      throw error
    }
  }, [])

  // Check if user is interested in event
  const isUserInterested = useCallback((event: Event) => {
    const userDataString = localStorage.getItem("user")
    const userData = userDataString ? JSON.parse(userDataString) : null
    
    if (!userData) return false
    return event.interestedBy?.includes(userData.email) || false
  }, [])

  // Check if user is attending event
  const isUserAttending = useCallback((event: Event) => {
    const userDataString = localStorage.getItem("user")
    const userData = userDataString ? JSON.parse(userDataString) : null
    
    if (!userData) return false
    return event.attendedBy?.includes(userData.email) || false
  }, [])

  return {
    events,
    setEvents,
    loading,
    loadEventsFromFirebase,
    loadAllEventsFromFirebase,
    loadOrganizerEvents,
    saveEventToFirebase,
    eventCategories,
    getFilteredEvents,
    getEventsByStatus,
    handleEventInterest,
    handleEventAttendance,
    isUserInterested,
    isUserAttending
  }
}
