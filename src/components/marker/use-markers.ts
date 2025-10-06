"use client"

import type { Marker } from "@/components/marker/types/marker"
import { addMarker, dbFirestore, getMarkers } from "@/services/firebase/FirebaseService"
import { useCallback, useMemo, useState } from "react"

export const useMarkers = () => {
  const [markers, setMarkers] = useState<Marker[]>([])

  // Load markers from Firebase
  const loadMarkersFromFirebase = useCallback(async () => {
    try {
      const fetchedMarkers = await getMarkers(dbFirestore)
      // Ensure all markers have the necessary properties
      const validMarkers = fetchedMarkers.filter(
        (marker: Partial<Marker>) => marker && marker.lat !== undefined && marker.lng !== undefined && marker.type !== undefined,
      ) as Marker[]

      setMarkers(validMarkers)
      return validMarkers
    } catch (error) {
      console.error("Erro ao carregar marcadores do Firebase:", error)
      return [] as Marker[]
    }
  }, [])

  // Save a new marker to Firebase
  const saveMarkerToFirebase = useCallback(async (lat: number, lng: number, type: string) => {
    try {
      // Get current user info from localStorage
      const userDataString = localStorage.getItem("user")
      const userData = userDataString ? JSON.parse(userDataString) : null
      const userEmail = userData?.email || "Usuário anônimo"
      const currentStatus = "reportado"

      // Create marker object to save
      const markerId = `marker_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`
      const newMarkerData: Marker = {
        id: markerId,
        lat,
        lng,
        type,
        userEmail,
        createdAt: new Date(),
        currentStatus,
      }

      // Add to Firebase using FirebaseService
      await addMarker(dbFirestore, newMarkerData)
      console.log("Marcador salvo com sucesso:", newMarkerData)

      // Update local markers state
      setMarkers((prev) => [...prev, newMarkerData])

      return newMarkerData
    } catch (error) {
      console.error("Erro ao salvar marcador no Firebase:", error)
      throw error
    }
  }, [])

  // Get unique marker types
  const markerTypes = useMemo(() => {
    const types = new Set<string>()
    markers.forEach(marker => {
      if (marker.type) {
        types.add(marker.type)
      }
    })
    return Array.from(types)
  }, [markers])

  // Filter markers by type
  const getFilteredMarkers = useCallback((selectedTypes: string[]) => {
    if (!selectedTypes.length) {
      return markers // Return all markers if no filter is applied
    }
    return markers.filter(marker => selectedTypes.includes(marker.type))
  }, [markers])

  return {
    markers,
    setMarkers,
    loadMarkersFromFirebase,
    saveMarkerToFirebase,
    markerTypes,
    getFilteredMarkers
  }
}