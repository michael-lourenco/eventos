import { useState, useCallback } from "react"
import type { EventFormData, Event } from "@/components/event/types/event"
import { EventStatus } from "@/components/event/types/event"
import { addEvent } from "@/services/events/EventService"
import { dbFirestore } from "@/services/firebase/FirebaseService"

export const useEventCreation = () => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const createEvent = useCallback(async (formData: EventFormData, userLocation: { lat: number; lng: number }) => {
    try {
      setLoading(true)
      setError(null)

      // Get current user info from localStorage
      const userDataString = localStorage.getItem("user")
      const userData = userDataString ? JSON.parse(userDataString) : null

      if (!userData) {
        throw new Error("Usuário não autenticado")
      }

      // Create event data (sem campos undefined)
      const eventData: Omit<Event, 'id'> = {
        title: formData.title,
        description: formData.description,
        lat: userLocation.lat,
        lng: userLocation.lng,
        category: formData.category,
        startDate: formData.startDate,
        endDate: formData.endDate,
        organizerEmail: userData.email,
        status: EventStatus.ACTIVE,
        interestedBy: [],
        attendedBy: [],
        price: formData.price,
        capacity: formData.capacity,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Save event to Firebase
      const eventId = await addEvent(dbFirestore, eventData)
      
      console.log("Event created successfully:", eventId)
      return eventId
    } catch (err) {
      console.error("Error creating event:", err)
      setError(err instanceof Error ? err.message : "Erro ao criar evento")
      throw err
    } finally {
      setLoading(false)
    }
  }, [])

  return { createEvent, loading, error }
}