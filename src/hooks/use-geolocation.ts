import { useState, useEffect, useCallback } from "react"

interface Location {
  lat: number
  lng: number
}

export function useGeolocation() {
  const [location, setLocation] = useState<Location | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [permissionDenied, setPermissionDenied] = useState(false)

  const getCurrentLocation = useCallback(() => {
    if (typeof window === 'undefined') {
      setError("Navegador não suporta geolocalização")
      setLoading(false)
      return
    }

    if (!navigator.geolocation) {
      setError("Geolocalização não suportada pelo navegador")
      setLoading(false)
      return
    }

    setLoading(true)
    setError(null)
    setPermissionDenied(false)

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        setLocation({ lat: latitude, lng: longitude })
        setLoading(false)
        setPermissionDenied(false)
        console.log("useGeolocation: Localização obtida com sucesso:", { lat: latitude, lng: longitude })
      },
      (error) => {
        console.error("Erro ao obter localização:", error.message)
        setLoading(false)
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setError("Permissão de localização negada. Você precisa permitir o acesso à localização para criar eventos.")
            setPermissionDenied(true)
            break
          case error.POSITION_UNAVAILABLE:
            setError("Localização indisponível. Verifique se o GPS está ativado.")
            break
          case error.TIMEOUT:
            setError("Timeout ao obter localização. Tente novamente.")
            break
          default:
            setError("Erro ao obter localização. Tente novamente.")
            break
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0 // Sempre obter localização atual
      }
    )
  }, [])

  useEffect(() => {
    getCurrentLocation()
  }, [getCurrentLocation])

  const centerOnUserLocation = useCallback(() => {
    if (location) {
      const event = new CustomEvent("centerOnUser", {
        detail: { lat: location.lat, lng: location.lng },
      })
      document.dispatchEvent(event)
    }
  }, [location])

  const requestLocationPermission = useCallback(() => {
    if (navigator.permissions) {
      navigator.permissions.query({ name: 'geolocation' }).then((result) => {
        if (result.state === 'granted') {
          getCurrentLocation()
        } else if (result.state === 'prompt') {
          getCurrentLocation()
        } else {
          setError("Permissão de geolocalização necessária. Por favor, permita o acesso e recarregue a página.")
          setPermissionDenied(true)
        }
      })
    } else {
      getCurrentLocation()
    }
  }, [getCurrentLocation])

  return {
    location,
    loading,
    error,
    permissionDenied,
    centerOnUserLocation,
    getCurrentLocation,
    requestLocationPermission
  }
}