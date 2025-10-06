"use client"

import { DEFAULT_ZOOM } from "@/constants/map-constants"
import type { Map } from "leaflet"
import { useCallback, useEffect, useRef } from "react"

export const useUserLocation = (mapInstance: Map | null, setUserMarker: (lat: number, lng: number) => void) => {
  const watchIdRef = useRef<number | null>(null)

  const centerOnUserLocation = useCallback(() => {
    if (!mapInstance || !("geolocation" in navigator)) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        mapInstance.setView([latitude, longitude], DEFAULT_ZOOM)
        setUserMarker(latitude, longitude)
      },
      (error) => {
        console.error("Erro ao obter localização do usuário:", error)
      },
    )
  }, [mapInstance, setUserMarker])

  const startLocationTracking = useCallback(() => {
    if (!mapInstance || !("geolocation" in navigator)) return

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setUserMarker(latitude, longitude)
      },
      (error) => {
        console.error("Erro ao rastrear localização do usuário:", error)
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 5000,
      },
    )
  }, [mapInstance, setUserMarker])

  const stopLocationTracking = useCallback(() => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }, [])

  useEffect(() => {
    return () => {
      stopLocationTracking()
    }
  }, [stopLocationTracking])

  return { centerOnUserLocation, startLocationTracking, stopLocationTracking }
}