"use client"

import type { Marker as MarkerType } from "@/components/marker/types/marker"
import { ProblemStatus } from "@/services/firebase/FirebaseService"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { Loader } from "lucide-react"
import { useEffect, useRef, useState } from "react"
interface ProblemMapProps {
  markers: MarkerType[]
}

export function ProblemMap({ markers }: ProblemMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [mapLoaded, setMapLoaded] = useState(false)
  const [map, setMap] = useState<L.Map | null>(null)
  const [leafletMarkers, setLeafletMarkers] = useState<L.Marker[]>([])

  // Corrigir o problema dos ícones do Leaflet
  useEffect(() => {
    // Apenas execute no lado do cliente
    if (typeof window !== "undefined") {
      // Corrigir os ícones do Leaflet no Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl

      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "/map-icons-fixed/padrao.svg",
        iconUrl: "/map-icons-fixed/padrao.svg",
        shadowUrl: "/map-icons-fixed/sombra.svg",
      })
    }
  }, [])

  // Inicializar o mapa
  useEffect(() => {
    if (!mapRef.current || map) return

    // Criar o mapa Leaflet
    const leafletMap = L.map(mapRef.current).setView([-23.5505, -46.6333], 12)

    // Adicionar camada de tiles (OpenStreetMap)
    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        attribution: '© <a href="https://carto.com/attributions">CARTO</a>',
      },
    ).addTo(leafletMap)

    setMap(leafletMap)
    setMapLoaded(true)

    // Limpar ao desmontar
    return () => {
      leafletMap.remove()
    }
  }, [map])

  // Adicionar marcadores ao mapa
  useEffect(() => {
    if (!map || !mapLoaded) return

    // Limpar marcadores existentes
    leafletMarkers.forEach((marker) => marker.remove())

    // Criar novos marcadores
    const newMarkers = markers.map((marker) => {
      // Determinar a cor do ícone com base no status
      let iconColor = "red"

      switch (marker.currentStatus) {
        case ProblemStatus.RESOLVED:
          iconColor = "green"
          break
        case ProblemStatus.IN_PROGRESS:
          iconColor = "orange"
          break
        case ProblemStatus.UNDER_ANALYSIS:
        case ProblemStatus.VERIFIED:
          iconColor = "blue"
          break
        default:
          iconColor = "red"
      }

      // Criar ícone personalizado
      const markerIcon = L.divIcon({
        className: "custom-div-icon",
        html: `<div style="background-color: ${iconColor}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white;"></div>`,
        iconSize: [20, 20],
        iconAnchor: [10, 10],
      })

      // Criar o marcador
      const leafletMarker = L.marker([marker.lat, marker.lng], {
        icon: markerIcon,
      }).addTo(map)

      // Adicionar popup com informações
      leafletMarker.bindPopup(`
        <div style="padding: 8px;">
          <h3 style="margin: 0 0 8px 0; font-weight: bold;">${marker.type}</h3>
          <p style="margin: 0 0 4px 0;"><strong>Status:</strong> ${marker.currentStatus || ProblemStatus.REPORTED}</p>
          <p style="margin: 0 0 4px 0;"><strong>Reportado por:</strong> ${marker.userEmail}</p>
          <p style="margin: 0 0 4px 0;"><strong>Data:</strong> ${new Date(marker.createdAt instanceof Date ? marker.createdAt : marker.createdAt.toDate()).toLocaleDateString("pt-BR")}</p>
        </div>
      `)

      return leafletMarker
    })

    setLeafletMarkers(newMarkers)

    // Ajustar o zoom para mostrar todos os marcadores
    if (newMarkers.length > 0 && markers.length > 0) {
      const bounds = L.latLngBounds(
        markers.map((marker) => [marker.lat, marker.lng]),
      )
      map.fitBounds(bounds)
    }
  }, [map, mapLoaded, markers, setLeafletMarkers])

  return (
    <div className="relative h-full w-full">
      {!mapLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <Loader className="text-muted-foreground h-8 w-8 animate-spin" />
        </div>
      )}
      <div
        ref={mapRef}
        className="h-full w-full"
      />
    </div>
  )
}
