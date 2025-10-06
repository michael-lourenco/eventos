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

  const { location, loading: locationLoading } = useGeolocation()
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

    const icons: Record<string, any> = {
      default: new L.Icon(baseIconConfig),
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
      } catch (error) {
        console.error("Erro ao inicializar mapa:", error)
      }
    }

    initializeMap()
  }, [])

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
      {locationLoading && (
        <div className="absolute top-4 left-4 bg-white p-2 rounded shadow">
          <p className="text-sm">Obtendo localização...</p>
        </div>
      )}
    </div>
  )
}

export default SimpleEventsMap
