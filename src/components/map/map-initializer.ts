import { getProblemLabel } from "@/components/map/map"
import { createMapIcons } from "@/components/marker/marker-icons"
import { convertToDate } from "@/components/marker/marker-interactions"
import type React from "react"

type MapInitializerProps = {
  mapRef: React.RefObject<HTMLDivElement | null>
  mapInstanceRef: React.MutableRefObject<any>
  userLocationMarkerRef: React.MutableRefObject<any>
  leafletRef: React.MutableRefObject<any>
  iconsRef: React.MutableRefObject<Record<string, any>>
  defaultLocation: [number, number]
  defaultZoom: number
  loadMarkersFromFirebase: () => Promise<any[]>
  onLikeMarker: (marker: any) => Promise<void>
  onResolvedMarker: (marker: any) => Promise<void>
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  addLeafletCSS: () => void
  addMarkerStyles: () => void
  addLikeStyles: () => void
  skipUserLocationSetView?: boolean // Prop to control whether to set view on user location
  skipMarkersAddition?: boolean // Nova prop para controlar se os marcadores devem ser adicionados durante a inicialização
}

export const initializeMap = async ({
  mapRef,
  mapInstanceRef,
  userLocationMarkerRef,
  leafletRef,
  iconsRef,
  defaultLocation,
  defaultZoom,
  loadMarkersFromFirebase,
  onLikeMarker,
  onResolvedMarker,
  setIsLoading,
  addLeafletCSS,
  addMarkerStyles,
  addLikeStyles,
  skipUserLocationSetView = false, // Default to false for backward compatibility
  skipMarkersAddition = false, // Nova opção com valor padrão false para compatibilidade com código existente
}: MapInitializerProps) => {
  try {
    // Verificar se o elemento do mapa existe
    if (!mapRef.current) {
      console.error("Elemento do mapa não encontrado")
      setIsLoading(false)
      return
    }

    // Add required styles
    addLeafletCSS()
    addMarkerStyles()
    addLikeStyles()

    // Load Leaflet library only once
    if (!leafletRef.current) {
      const L = await import("leaflet")
      leafletRef.current = L
    }

    const L = leafletRef.current
    console.log("Inicializando mapa Leaflet")

    // Verificação adicional antes da criação do mapa
    if (mapInstanceRef.current) {
      console.log("Mapa já existe, pulando inicialização")
      setIsLoading(false)
      return
    }

    // Create custom icons once
    if (Object.keys(iconsRef.current).length === 0) {
      iconsRef.current = createMapIcons(L)
    }

    // Initialize map
    const mapInstance = L.map(mapRef.current, {
      zoomControl: false,
      attributionControl: false,
    }).setView(defaultLocation, defaultZoom)

    // Add tile layer
    L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
      maxZoom: 20,
      minZoom: 13,
    }).addTo(mapInstance)

    // Store map instance
    mapInstanceRef.current = mapInstance

    // Carregar marcadores do Firebase
    const firebaseMarkers = await loadMarkersFromFirebase()
    let shouldCenterOnMarker = !skipUserLocationSetView; // Only center on marker if not centering on user

    // Adicionar marcadores ao mapa apenas se skipMarkersAddition for false
    if (!skipMarkersAddition && firebaseMarkers && firebaseMarkers.length > 0) {
      // Add all saved markers to the map
      firebaseMarkers.forEach((marker) => {
        const icon = iconsRef.current[marker.type] || iconsRef.current.default
        const mapMarker = L.marker([marker.lat, marker.lng], {
          icon,
        }).addTo(mapInstance)

        // Converter timestamp de forma segura
        const createdAt = convertToDate(marker.createdAt)

        // Criar popup personalizado com botão de like ou verificação
        const popupContent = document.createElement("div")
        popupContent.classList.add("marker-popup")
        const likesCount = marker.likedBy?.length || 0
        const resolvedCount = marker.resolvedBy?.length || 0
        // Conteúdo base do popup
        let popupHTML = `
          <strong>Problema: ${getProblemLabel(marker.type)}</strong><br>
          Reportado em: ${createdAt.toLocaleDateString()} ${createdAt.toLocaleTimeString()}<br>
          Por: ${marker.userEmail || "Usuário anônimo"}<br>
        `

        // Adicionar botão apropriado com base no número de likes
        if (likesCount >= 1) {
          if (resolvedCount >= 1) {
            // Mostrar botão de verificação se tiver 1 ou mais likes
            popupHTML += `
              <button class="resolved-button">
                RESOLVIDO
              </button>
            `
          } else {
            // Mostrar botão de verificação se tiver 1 ou mais likes
            popupHTML += `
              <button class="resolved-button">
                Resolvido?
                <span class="like-count">(${likesCount})</span>
              </button>
            `
          }
        } else {
          // Mostrar botão de like se não tiver likes
          popupHTML += `
            <button class="like-button">
              Curtir 
              <span class="like-count">(${likesCount})</span>
            </button>
          `
        }

        popupContent.innerHTML = popupHTML

        // Adicionar evento de clique no botão apropriado
        if (likesCount >= 1) {
          popupContent.querySelector(".resolved-button")?.addEventListener("click", () => {
            onResolvedMarker(marker) // Reutilizando a mesma função para simplificar
          })
        } else {
          popupContent.querySelector(".like-button")?.addEventListener("click", () => {
            onLikeMarker(marker)
          })
        }

        mapMarker.bindPopup(popupContent)
      })

      // Center map on most recent marker only if not centering on user
      if (shouldCenterOnMarker) {
        // Ordenar marcadores por data descendente (mais recente primeiro)
        const sortedMarkers = [...firebaseMarkers].sort((a, b) => {
          const dateA = convertToDate(a.createdAt)
          const dateB = convertToDate(b.createdAt)
          return dateB.getTime() - dateA.getTime()
        })

        if (sortedMarkers.length > 0) {
          const mostRecent = sortedMarkers[0]
          mapInstance.setView([mostRecent.lat, mostRecent.lng], defaultZoom)
        }
      }
    }

    // Get user location and create marker
    if ("geolocation" in navigator) {
      // Create user location marker
      const userIcon = iconsRef.current.userLocation

      // First create marker at default location
      userLocationMarkerRef.current = L.marker(defaultLocation, {
        icon: userIcon,
        zIndexOffset: 1000, // Make sure user marker is on top
      })
        .addTo(mapInstance)
        .bindPopup("Sua localização")

      // Get position and update marker
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords

          // Update user marker position
          if (userLocationMarkerRef.current) {
            userLocationMarkerRef.current.setLatLng([latitude, longitude])
              .bindPopup("Sua localização")
          }

          // Update map view only if we weren't told to skip it
          if (!skipUserLocationSetView) {
            mapInstance.setView([latitude, longitude], defaultZoom)
          }
        },
        (error) => {
          console.error("Erro ao obter localização do usuário:", error)
          // Marker already created at default location
        },
      )
    }

    // Force size recalculation
    setTimeout(() => {
      mapInstance.invalidateSize()
    }, 100)

    setIsLoading(false)
    return mapInstance
  } catch (error) {
    console.error("Erro ao inicializar o mapa:", error)
    setIsLoading(false)
    throw error
  }
}

export const setupLocationTracking = (
  mapInstanceRef: React.MutableRefObject<any>,
  userLocationMarkerRef: React.MutableRefObject<any>,
  defaultZoom: number,
  centerMapOnLocationUpdate = true // New parameter to control automatic centering
) => {
  if (!("geolocation" in navigator)) {
    return null
  }

  return navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords

      // Update user marker position
      if (userLocationMarkerRef.current) {
        userLocationMarkerRef.current.setLatLng([latitude, longitude])
      }

      // Update map view to follow user only if requested
      if (centerMapOnLocationUpdate && mapInstanceRef.current) {
        mapInstanceRef.current.setView([latitude, longitude], mapInstanceRef.current.getZoom())
      }
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
}