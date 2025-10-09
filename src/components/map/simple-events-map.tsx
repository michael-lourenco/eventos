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
  const [mapReady, setMapReady] = useState(false)
  const [showLocationSuccess, setShowLocationSuccess] = useState(false)

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
        <circle cx="12" cy="12" r="6" fill="var(--brand)" opacity="0.8">
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
        <circle cx="12" cy="12" r="6" fill="var(--brand)" stroke="white" stroke-width="1" />
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

  // Show location success message temporarily
  useEffect(() => {
    if (location && !locationLoading) {
      setShowLocationSuccess(true)
      const timer = setTimeout(() => {
        setShowLocationSuccess(false)
      }, 3000) // Hide after 3 seconds

      return () => clearTimeout(timer)
    }
  }, [location, locationLoading])

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
      zIndexOffset: 1000, // Ensure user marker is always on top
    }).addTo(map)

    // Bind popup to user location marker
    userLocationMarkerRef.current.bindPopup("Sua localização atual")
    
    // Center map on user location (only if this is the first time)
    if (!userLocationMarkerRef.current._alreadyCentered) {
      map.setView([location.lat, location.lng], defaultZoom)
      userLocationMarkerRef.current._alreadyCentered = true
    }
    
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

        console.log("Mapa inicializado com sucesso")

        // Wait a bit for everything to be ready, then add markers
        setTimeout(() => {
          setMapReady(true)
          if (location && iconsRef.current.userLocation) {
            addUserLocationMarker(L, map)
          }
        }, 100)
      } catch (error) {
        console.error("Erro ao inicializar mapa:", error)
      }
    }

    initializeMap()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Add markers when events are loaded and user location is available
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !leafletRef.current || !iconsRef.current.userLocation) return

    const L = leafletRef.current
    const map = mapInstanceRef.current

    // Clear existing markers (except user location)
    map.eachLayer((layer: any) => {
      if (layer instanceof L.Marker && layer !== userLocationMarkerRef.current) {
        map.removeLayer(layer)
      }
    })

    // Add user location marker first (if location is available)
    if (location && !userLocationMarkerRef.current) {
      addUserLocationMarker(L, map)
    }

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
              <p class="text-sm text-muted-foreground mb-2">${event.description}</p>
              <p class="text-xs text-muted-foreground">Categoria: ${event.category}</p>
              <p class="text-xs text-muted-foreground">Organizador: ${event.organizerEmail}</p>
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [events, location, mapReady])

  // Update user location marker when location changes (separate effect)
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current || !leafletRef.current || !location || !iconsRef.current.userLocation) return
    
    // Only update if we don't already have a marker or if location changed significantly
    if (!userLocationMarkerRef.current) {
      addUserLocationMarker(leafletRef.current, mapInstanceRef.current)
    } else {
      // Update existing marker position
      const currentPos = userLocationMarkerRef.current.getLatLng()
      const newPos = { lat: location.lat, lng: location.lng }
      
      // Only update if position changed significantly (more than 10 meters)
      const distance = Math.sqrt(
        Math.pow(currentPos.lat - newPos.lat, 2) + Math.pow(currentPos.lng - newPos.lng, 2)
      ) * 111000 // rough conversion to meters
      
      if (distance > 10) {
        userLocationMarkerRef.current.setLatLng(newPos)
        mapInstanceRef.current.setView(newPos, mapInstanceRef.current.getZoom())
        console.log("SimpleEventsMap: Posição do usuário atualizada")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location, mapReady])

  return (
    <div className="h-full w-full">
      <div ref={mapRef} className="h-full w-full" />
      
      {/* Location Status */}
      {locationLoading && (
        <div className="absolute top-4 left-4 bg-card p-2 rounded shadow z-[1000]">
          <p className="text-sm">Obtendo localização...</p>
        </div>
      )}
      
      {locationError && (
        <div className="absolute top-4 left-4 bg-destructive/10 border border-destructive/30 p-2 rounded shadow z-[1000]">
          <p className="text-sm text-destructive">
            {permissionDenied 
              ? "Permissão de localização negada. Permita o acesso para ver sua localização no mapa."
              : "Erro ao obter localização. Usando localização padrão."
            }
          </p>
        </div>
      )}
      
      {showLocationSuccess && (
        <div className="absolute top-4 left-4 bg-primary/10 border border-primary/30 p-2 rounded shadow z-[1000] animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-sm text-primary">Localização obtida com sucesso!</p>
        </div>
      )}
    </div>
  )
}

export default SimpleEventsMap
