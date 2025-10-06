"use client"

import "leaflet/dist/leaflet.css"
import { useRef, useEffect, useState } from "react"
import { useEvents } from "@/hooks/use-events"
import { useGeolocation } from "@/hooks/use-geolocation"

interface SimpleEventsMapProps {
  onNeedLogin: () => void
}

const SimpleEventsMap = ({ onNeedLogin }: SimpleEventsMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  const mapInitializedRef = useRef<boolean>(false)
  const iconsRef = useRef<Record<string, any>>({})
  const userLocationMarkerRef = useRef<any>(null)

  const { location, loading: locationLoading, error: locationError, permissionDenied } = useGeolocation()
  const { events, loadEventsFromFirebase } = useEvents()

  const defaultZoom = 16

  // Função para criar ícones personalizados
  const createEventIcons = (L: any) => {
    const baseIconConfig = {
      iconUrl: "/map-icons-fixed/padrao.svg",
      iconRetinaUrl: "/map-icons-fixed/padrao.svg",
      shadowUrl: "/map-icons-fixed/sombra.svg",
      iconSize: [52, 52],
      iconAnchor: [2, 50],
      popupAnchor: [1, -34],
      shadowSize: [52, 52],
    }

    // Mapeamento de categorias para ícones existentes
    const categoryIcons: Record<string, string> = {
      music: "som-alto",        // Ícone de som alto para música
      food: "padrao",           // Ícone padrão para gastronomia
      sports: "padrao",         // Ícone padrão para esporte
      culture: "padrao",        // Ícone padrão para cultura
      business: "padrao",       // Ícone padrão para negócios
      education: "padrao",      // Ícone padrão para educação
      health: "padrao",         // Ícone padrão para saúde
      technology: "padrao",     // Ícone padrão para tecnologia
      art: "padrao",            // Ícone padrão para arte
      fashion: "padrao",        // Ícone padrão para moda
    }

    // User location icon
    const userLocationSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
        <!-- Círculo externo pulsante -->
        <circle cx="12" cy="12" r="6" fill="#4285F4" opacity="0.8">
          <animate 
            attributeName="r" 
            from="6" 
            to="15" 
            dur="1.5s" 
            begin="0s" 
            repeatCount="indefinite" 
          />
          <animate 
            attributeName="opacity" 
            from="0.8" 
            to="0" 
            dur="1.5s" 
            begin="0s" 
            repeatCount="indefinite" 
          />
        </circle>
        
        <!-- Círculo central fixo -->
        <circle cx="12" cy="12" r="6" fill="#4285F4" stroke="white" stroke-width="1" />
      </svg>
    `

    const userLocationIcon = new L.DivIcon({
      html: userLocationSvg,
      className: "user-location-icon",
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    })

    const icons: Record<string, any> = {
      default: new L.Icon(baseIconConfig),
      userLocation: userLocationIcon,
    }

    // Criar ícones para cada categoria
    Object.entries(categoryIcons).forEach(([category, iconName]) => {
      icons[category] = new L.Icon({
        ...baseIconConfig,
        iconUrl: `/map-icons-fixed/${iconName}.svg`,
        iconRetinaUrl: `/map-icons-fixed/${iconName}.svg`,
        className: `${category}-icon`,
      })
    })

    return icons
  }

  // Load events on component mount
  useEffect(() => {
    loadEventsFromFirebase()
  }, [loadEventsFromFirebase])

  // Add user location marker
  const addUserLocationMarker = (L: any, map: any) => {
    if (!location) {
      console.log("SimpleEventsMap: Localização não disponível para criar marcador")
      return
    }
    
    console.log("SimpleEventsMap: Criando marcador de localização do usuário:", location)
    
    if (userLocationMarkerRef.current) {
      map.removeLayer(userLocationMarkerRef.current)
    }

    const userLocationIcon = iconsRef.current.userLocation
    if (!userLocationIcon) {
      console.error("SimpleEventsMap: Ícone de localização do usuário não encontrado")
      return
    }

    userLocationMarkerRef.current = L.marker([location.lat, location.lng], {
      icon: userLocationIcon,
    }).addTo(map)

    // Center map on user location
    map.setView([location.lat, location.lng], defaultZoom)
    console.log("SimpleEventsMap: Marcador de localização criado e mapa centralizado")
  }

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInitializedRef.current) return

    const initializeMap = async () => {
      try {
        const L = (await import("leaflet")).default
        leafletRef.current = L

        // Criar ícones personalizados
        iconsRef.current = createEventIcons(L)

        const defaultLocation: [number, number] = [-23.5902, -48.0338]

        // Verificar se o container já foi inicializado
        if (mapRef.current && mapInitializedRef.current) {
          console.log("Mapa já inicializado, pulando...")
          return
        }

        // Initialize map
        const map = L.map(mapRef.current!, {
          center: defaultLocation,
          zoom: defaultZoom,
          zoomControl: true,
        })

        // Add tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        }).addTo(map)

        mapInstanceRef.current = map
        mapInitializedRef.current = true

        // Add user location marker when location is available
        if (location) {
          addUserLocationMarker(L, map)
        }

        console.log("Mapa inicializado com sucesso")
      } catch (error) {
        console.error("Erro ao inicializar mapa:", error)
      }
    }

    initializeMap()
  }, [])

  // Update user location marker when location changes
  useEffect(() => {
    if (mapInstanceRef.current && leafletRef.current && location) {
      addUserLocationMarker(leafletRef.current, mapInstanceRef.current)
    }
  }, [location])

  // Add markers when events are loaded
  useEffect(() => {
    if (!mapInstanceRef.current || !leafletRef.current) return

    const L = leafletRef.current
    const map = mapInstanceRef.current

    // Clear existing markers
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer)
      }
    })

    // Add event markers
    if (events.length > 0) {
      events.forEach((event) => {
        try {
          // Selecionar ícone baseado na categoria
          const icon = iconsRef.current[event.category] || iconsRef.current.default
          
          const marker = L.marker([event.lat, event.lng], {
            title: event.title,
            icon: icon
          })

          const popupContent = `
            <div class="p-2">
              <h3 class="font-bold text-lg mb-2">${event.title}</h3>
              <p class="text-sm text-gray-600 mb-2">${event.description}</p>
              <p class="text-xs text-gray-500">Categoria: ${event.category}</p>
              <p class="text-xs text-gray-500">Organizador: ${event.organizerEmail}</p>
            </div>
          `

          marker.bindPopup(popupContent)
          marker.addTo(map)
        } catch (error) {
          console.error("Erro ao adicionar marcador:", error, event)
        }
      })

      console.log(`Adicionados ${events.length} marcadores ao mapa`)
    } else {
      console.log("Nenhum evento encontrado para exibir no mapa")
    }
  }, [events])

  return (
    <div className="h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
      
      {/* Location Status */}
      {locationLoading && (
        <div className="absolute top-4 left-4 bg-white p-2 rounded shadow z-[1000]">
          <p className="text-sm">Obtendo localização...</p>
        </div>
      )}
      
      {locationError && (
        <div className="absolute top-4 left-4 bg-red-100 border border-red-300 p-2 rounded shadow z-[1000]">
          <p className="text-sm text-red-700">
            {permissionDenied 
              ? "Permissão de localização negada. Permita o acesso para ver sua localização no mapa."
              : "Erro ao obter localização. Usando localização padrão."
            }
          </p>
        </div>
      )}
      
      {location && (
        <div className="absolute top-4 left-4 bg-green-100 border border-green-300 p-2 rounded shadow z-[1000]">
          <p className="text-sm text-green-700">Localização obtida com sucesso!</p>
        </div>
      )}
    </div>
  )
}

export default SimpleEventsMap
