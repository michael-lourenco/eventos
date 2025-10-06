"use client"

import type React from "react"

import { useEffect, useRef } from "react"

type LocationTrackerOptions = {
  onLocationUpdate?: (position: GeolocationPosition) => void
  onLocationError?: (error: GeolocationPositionError) => void
  enableHighAccuracy?: boolean
  maximumAge?: number
  timeout?: number
}

type LocationTrackerResult = {
  getCurrentPosition: () => Promise<GeolocationPosition>
  startTracking: () => void
  stopTracking: () => void
  watchId: React.MutableRefObject<number | null>
}

/**
 * Hook para rastrear a localização do usuário
 */
export const useLocationTracker = (options: LocationTrackerOptions = {}): LocationTrackerResult => {
  const watchId = useRef<number | null>(null)

  const { onLocationUpdate, onLocationError, enableHighAccuracy = true, maximumAge = 0, timeout = 5000 } = options

  // Função para obter a posição atual do usuário
  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error("Geolocalização não suportada pelo navegador"))
        return
      }

      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (onLocationUpdate) {
            onLocationUpdate(position)
          }
          resolve(position)
        },
        (error) => {
          if (onLocationError) {
            onLocationError(error)
          }
          reject(error)
        },
        {
          enableHighAccuracy,
          maximumAge,
          timeout,
        },
      )
    })
  }

  // Função para iniciar o rastreamento contínuo da localização
  const startTracking = (): void => {
    if (!navigator.geolocation) {
      console.error("Geolocalização não suportada pelo navegador")
      return
    }

    // Se já estiver rastreando, pare primeiro
    if (watchId.current !== null) {
      stopTracking()
    }

    watchId.current = navigator.geolocation.watchPosition(
      (position) => {
        if (onLocationUpdate) {
          onLocationUpdate(position)
        }
      },
      (error) => {
        if (onLocationError) {
          onLocationError(error)
        }
        console.error("Erro ao rastrear localização:", error)
      },
      {
        enableHighAccuracy,
        maximumAge,
        timeout,
      },
    )
  }

  // Função para parar o rastreamento da localização
  const stopTracking = (): void => {
    if (watchId.current !== null) {
      navigator.geolocation.clearWatch(watchId.current)
      watchId.current = null
    }
  }

  // Limpar o rastreamento quando o componente for desmontado
  useEffect(() => {
    return () => {
      stopTracking()
    }
  }, [])

  return {
    getCurrentPosition,
    startTracking,
    stopTracking,
    watchId,
  }
}

/**
 * Verifica se a geolocalização é suportada pelo navegador
 */
export const isGeolocationSupported = (): boolean => {
  return "geolocation" in navigator
}

/**
 * Obtém a posição atual do usuário uma única vez
 */
export const getUserLocation = async (options: PositionOptions = {}): Promise<GeolocationPosition> => {
  return new Promise((resolve, reject) => {
    if (!isGeolocationSupported()) {
      reject(new Error("Geolocalização não suportada pelo navegador"))
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => resolve(position),
      (error) => reject(error),
      options,
    )
  })
}
