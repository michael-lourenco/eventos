"use client"

import "leaflet/dist/leaflet.css"
import { useRef, useEffect, useState, useMemo, useCallback } from "react"
import { useEvents } from "@/hooks/use-events"
import { useGeolocation } from "@/hooks/use-geolocation"
import { createEventIcons, getEventCategoryLabel } from "@/components/event/event-icons"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, Heart, Calendar, DollarSign } from "lucide-react"
import { format } from "date-fns"
import type { Event, EventCategory } from "@/components/event/types/event"

interface EventsMapProps {
  onNeedLogin: () => void
}

const EventsMap = ({ onNeedLogin }: EventsMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const userLocationMarkerRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  const iconsRef = useRef<Record<string, any>>({})
  const mapInitializedRef = useRef<boolean>(false)
  const markersLayerRef = useRef<any>(null)
  const initialCenteringDoneRef = useRef<boolean>(false)

  const { location, loading: locationLoading } = useGeolocation()
  const { events, loadEventsFromFirebase, handleEventInterest, handleEventAttendance, isUserInterested, isUserAttending } = useEvents()
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [followMode, setFollowMode] = useState<boolean>(true)

  const defaultZoom = 16

  // Load events on component mount
  useEffect(() => {
    loadEventsFromFirebase()
  }, [loadEventsFromFirebase])

  // Filter events by selected categories
  const filteredEvents = useMemo(() => {
    if (!selectedCategories.length) {
      return events
    }
    return events.filter(event => selectedCategories.includes(event.category))
  }, [events, selectedCategories])

  // Add user location marker
  const addUserLocationMarker = useCallback((L: any, map: any) => {
    if (!location) return
    
    if (userLocationMarkerRef.current) {
      map.removeLayer(userLocationMarkerRef.current)
    }

    const userLocationIcon = iconsRef.current.userLocation
    userLocationMarkerRef.current = L.marker([location.lat, location.lng], {
      icon: userLocationIcon,
    }).addTo(map)

    if (!initialCenteringDoneRef.current) {
      map.setView([location.lat, location.lng], defaultZoom)
      initialCenteringDoneRef.current = true
    }
  }, [location])

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInitializedRef.current) return

    const initializeMap = async () => {
      try {
        const L = (await import("leaflet")).default
        leafletRef.current = L

        // Create icons
        iconsRef.current = createEventIcons(L)

        const defaultLocation: [number, number] = [-23.5902, -48.0338]

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
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }

    initializeMap()
  }, [addUserLocationMarker, location])

  // Update user location marker when location changes
  useEffect(() => {
    if (mapInstanceRef.current && leafletRef.current && location) {
      addUserLocationMarker(leafletRef.current, mapInstanceRef.current)
    }
  }, [location, addUserLocationMarker])

  // Update event markers
  const updateMapMarkers = useCallback(() => {
    if (!mapInstanceRef.current || !leafletRef.current) return

    // Clear existing markers
    if (markersLayerRef.current) {
      mapInstanceRef.current.removeLayer(markersLayerRef.current)
    }

    markersLayerRef.current = new leafletRef.current.LayerGroup()

    filteredEvents.forEach((event) => {
      const { lat, lng, category } = event

      if (lat === undefined || lng === undefined || !category) {
        return
      }

      const icon = iconsRef.current[category] || iconsRef.current.default
      const leafletMarker = leafletRef.current.marker([lat, lng], { icon })

      leafletMarker.eventData = event

      const popupContent = document.createElement("div")
      popupContent.className = "event-popup"
      
      const startDate = event.startDate instanceof Date ? event.startDate : event.startDate.toDate()
      const endDate = event.endDate instanceof Date ? event.endDate : event.endDate.toDate()
      const isInterested = isUserInterested(event)
      const isAttending = isUserAttending(event)

      popupContent.innerHTML = `
        <div class="p-3 min-w-[250px]">
          <div class="flex items-start justify-between mb-2">
            <h3 class="font-semibold text-sm leading-tight">${event.title}</h3>
            <span class="text-xs bg-cyan-100 text-cyan-800 px-2 py-1 rounded-full ml-2">
              ${getEventCategoryLabel(event.category)}
            </span>
          </div>
          
          <p class="text-xs text-gray-600 mb-3 line-clamp-2">${event.description}</p>
          
          <div class="space-y-1 mb-3">
            <div class="flex items-center text-xs text-gray-500">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              ${format(startDate, "dd/MM/yyyy HH:mm")}
            </div>
            
            <div class="flex items-center text-xs text-gray-500">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              ${event.organizerName}
            </div>
            
            ${event.price?.type === 'paid' ? `
              <div class="flex items-center text-xs text-gray-500">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"></path>
                </svg>
                R$ ${event.price.amount?.toFixed(2)}
              </div>
            ` : `
              <div class="flex items-center text-xs text-cyan-600">
                <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                Gratuito
              </div>
            `}
          </div>
          
          <div class="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span class="flex items-center">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
              </svg>
              ${event.interestedBy?.length || 0} interessados
            </span>
            <span class="flex items-center">
              <svg class="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
              ${event.attendedBy?.length || 0} participantes
            </span>
          </div>
          
          <div class="flex gap-2">
            <button 
              class="flex-1 px-3 py-1 text-xs rounded-md transition-colors ${
                isInterested 
                  ? 'bg-cyan-100 text-cyan-800 hover:bg-emerald-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }"
              data-event-id="${event.id}"
              data-action="interest"
            >
              ${isInterested ? 'Interessado' : 'Tenho Interesse'}
            </button>
            <button 
              class="flex-1 px-3 py-1 text-xs rounded-md transition-colors ${
                isAttending 
                  ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }"
              data-event-id="${event.id}"
              data-action="attendance"
            >
              ${isAttending ? 'Participando' : 'Vou Participar'}
            </button>
          </div>
        </div>
      `

      // Add click handlers
      popupContent.addEventListener('click', async (e) => {
        const target = e.target as HTMLElement
        const button = target.closest('button')
        if (!button) return

        const eventId = button.dataset.eventId
        const action = button.dataset.action
        const eventData = leafletMarker.eventData

        if (!eventId || !eventData) return

        try {
          if (action === 'interest') {
            await handleEventInterest(eventData)
          } else if (action === 'attendance') {
            await handleEventAttendance(eventData)
          }
        } catch (error) {
          if (error instanceof Error && error.message.includes('não autenticado')) {
            onNeedLogin()
          }
        }
      })

      leafletMarker.bindPopup(popupContent)
      markersLayerRef.current.addLayer(leafletMarker)
    })

    markersLayerRef.current.addTo(mapInstanceRef.current)
  }, [filteredEvents, isUserInterested, isUserAttending, handleEventInterest, handleEventAttendance, onNeedLogin])

  // Update markers when events change
  useEffect(() => {
    updateMapMarkers()
  }, [updateMapMarkers])

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category) 
        ? prev.filter(c => c !== category)
        : [...prev, category]
    )
  }

  const availableCategories = useMemo(() => {
    const categories = new Set<string>()
    events.forEach(event => categories.add(event.category))
    return Array.from(categories) as EventCategory[]
  }, [events])

  return (
    <div className="relative h-full w-full">
      {/* Map Container */}
      <div ref={mapRef} className="h-full w-full" />

      {/* Category Filter */}
      {availableCategories.length > 0 && (
        <div className="absolute top-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3 max-w-xs">
          <h3 className="text-sm font-medium mb-2">Filtrar por Categoria</h3>
          <div className="space-y-1">
            {availableCategories.map((category) => (
              <label key={category} className="flex items-center space-x-2 text-xs">
                <input
                  type="checkbox"
                  checked={selectedCategories.includes(category)}
                  onChange={() => toggleCategory(category)}
                  className="rounded"
                />
                <span>{getEventCategoryLabel(category)}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Location Status */}
      {locationLoading && (
        <div className="absolute top-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
          <div className="flex items-center gap-2 text-sm">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-cyan-500"></div>
            <span>Obtendo localização...</span>
          </div>
        </div>
      )}

      {/* Events Count */}
      <div className="absolute bottom-4 left-4 z-[1000] bg-white rounded-lg shadow-lg p-3">
        <div className="flex items-center gap-2 text-sm">
          <MapPin className="h-4 w-4 text-cyan-500" />
          <span>{filteredEvents.length} eventos próximos</span>
        </div>
      </div>
    </div>
  )
}

export default EventsMap
