"use client"
import { LocationControls } from "@/components/location-controls/location-controls"
import { FilterDrawer } from "@/components/map/filter-drawer"
import {
  initializeMap,
  setupLocationTracking,
} from "@/components/map/map-initializer"
import {
  addLeafletCSS,
  addLikeStyles,
  setupCenterOnUserEvent,
  setupResizeHandler,
} from "@/components/map/map-styles"
import { createAndSaveMarker } from "@/components/marker/marker-creator"
import {
  handleLikeMarker,
  handleResolvedMarker,
} from "@/components/marker/marker-interactions"
import type { Marker } from "@/components/marker/types/marker"
import { useMarkerStyles } from "@/components/marker/use-marker-styles"
import { useMarkers } from "@/components/marker/use-markers"
import { Button } from "@/components/ui/button"
import { PROBLEM_CATEGORIES, TProblemType } from "@/constants/map-constants"
import type React from "react"
import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { toast } from "sonner"
import { SidebarTrigger } from "../ui/sidebar"

interface MapContentProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>
  selectedProblemType: TProblemType | undefined
  handleProblemSelect: (problemType: TProblemType) => void
  handleConfirmProblem: () => void
  userConfirmedProblem: boolean
  resetConfirmation: () => void
  toggleReportMenu: () => void
  selectedTypes: string[]
  onFilterChange: (selectedTypes: string[]) => void
  onNeedLogin: () => void
}

const MapContent = ({
  setIsLoading,
  selectedProblemType,
  handleProblemSelect,
  handleConfirmProblem,
  userConfirmedProblem,
  resetConfirmation,
  toggleReportMenu,
  selectedTypes,
  onFilterChange,
  onNeedLogin,
}: MapContentProps) => {
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
  const {
    markers,
    setMarkers,
    loadMarkersFromFirebase,
    markerTypes,
    getFilteredMarkers,
  } = useMarkers()
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<any>(null)
  const userLocationMarkerRef = useRef<any>(null)
  const leafletRef = useRef<any>(null)
  const iconsRef = useRef<Record<string, any>>({})
  const mapInitializedRef = useRef<boolean>(false)
  const defaultZoom = 16
  const watchIdRef = useRef<number | null>(null)

  const markersLayerRef = useRef<any>(null)

  const initialCenteringDoneRef = useRef<boolean>(false)

  const [followMode, setFollowMode] = useState<boolean>(true)

  const addMarkerStyles = useMarkerStyles()

  const filteredMarkers = useMemo(() => {
    return getFilteredMarkers(selectedTypes)
  }, [getFilteredMarkers, selectedTypes])

  const onLikeMarker = useCallback(async (marker: Marker) => {
    const userDataString = localStorage.getItem("user")
    const userData = userDataString ? JSON.parse(userDataString) : null

    if (!userData) {
      onNeedLogin()
      return
    }

    await handleLikeMarker(
      marker,
      userLocationMarkerRef.current,
      markers,
      setMarkers,
    )
  }, [onNeedLogin, markers, setMarkers])

  const onResolvedMarker = useCallback(async (marker: Marker) => {
    const userDataString = localStorage.getItem("user")
    const userData = userDataString ? JSON.parse(userDataString) : null

    if (!userData) {
      onNeedLogin()
      return
    }

    await handleResolvedMarker(
      marker,
      userLocationMarkerRef.current,
      markers,
      setMarkers,
    )
  }, [onNeedLogin, markers, setMarkers])

  const handleReportProblem = () => {
    const userDataString = localStorage.getItem("user")
    const userData = userDataString ? JSON.parse(userDataString) : null

    if (!userData) {
      onNeedLogin()
      return
    }

    toggleReportMenu()
  }

  const centerOnUserLocation = () => {
    if (userLocationMarkerRef.current && mapInstanceRef.current) {
      const position = userLocationMarkerRef.current.getLatLng()
      mapInstanceRef.current.setView(
        [position.lat, position.lng],
        mapInstanceRef.current.getZoom(),
      )
    }
  }

  const updateMapMarkers = useCallback(() => {
    if (
      !mapInstanceRef.current ||
      !leafletRef.current ||
      !iconsRef.current ||
      !filteredMarkers
    ) {
      return
    }

    if (markersLayerRef.current) {
      mapInstanceRef.current.removeLayer(markersLayerRef.current)
    }

    markersLayerRef.current = new leafletRef.current.LayerGroup()

    filteredMarkers.forEach((marker) => {
      const { lat, lng, type } = marker

      if (lat === undefined || lng === undefined || !type) {
        return
      }

      const icon = iconsRef.current[type] || iconsRef.current.default

      const leafletMarker = leafletRef.current.marker([lat, lng], { icon })

      leafletMarker.markerData = marker

      const popupContent = document.createElement("div")
      popupContent.className = "marker-popup"
      
      // Find the category or subcategory that matches the type
      let categoryLabel = type
      
      for (const category of PROBLEM_CATEGORIES) {
        if (category.type as unknown as TProblemType === type) {
          categoryLabel = category.label
          break
        }
        
        // Check subcategories
        const subcategory = category.subcategories?.find(
          sub => sub.type as unknown as TProblemType === type
        )
        
        if (subcategory) {
          categoryLabel = subcategory.label
          break
        }
      }
      
      popupContent.innerHTML = `
        <div class="marker-info" style="font-family: 'Segoe UI', Arial, sans-serif; min-width:220px; padding: 12px 8px; border-radius: 12px; background: #fff; box-shadow: 0 2px 12px rgba(0,0,0,0.10);">
          <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
            <span style="font-size: 1.3em; color: #2563eb;">📍</span>
            <span style="font-weight: 600; font-size: 1.1em;">${categoryLabel}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 6px;">
            <span style="font-size: 1.1em; color: #6366f1;">👤</span>
            <span style="font-size: 0.98em;">${marker.userEmail || "Anônimo"}</span>
          </div>
          <div style="display: flex; align-items: center; gap: 6px; margin-bottom: 10px;">
            <span style="font-size: 1.1em; color: #21b6bf;">📋</span>
            <span style="font-size: 0.98em;">${marker.currentStatus || "Reportado"}</span>
          </div>
          <div style="display: flex; gap: 8px; margin-top: 10px;">
            <button class="like-button" style="display: flex; align-items: center; gap: 4px; background: #f1f5f9; border: none; border-radius: 6px; padding: 4px 10px; cursor: pointer; font-size: 1em; transition: background 0.2s;">
              <span style="color: #f59e42; font-size: 1.1em;">👍</span> <span>${marker.likedBy?.length || 0}</span>
            </button>
            <button class="resolved-button" style="display: flex; align-items: center; gap: 4px; background: #f1f5f9; border: none; border-radius: 6px; padding: 4px 10px; cursor: pointer; font-size: 1em; transition: background 0.2s;">
              <span style="color: #21b6bf; font-size: 1.1em;">✅</span> <span>${marker.resolvedBy?.length || 0}</span>
            </button>
          </div>
        </div>
      `

      const popup = leafletRef.current.popup().setContent(popupContent)
      leafletMarker.bindPopup(popup)

      leafletMarker.on("popupopen", () => {
        const likeButton = document.querySelector(".like-button")
        const resolvedButton = document.querySelector(".resolved-button")

        if (likeButton) {
          likeButton.addEventListener("click", () => onLikeMarker(marker))
        }

        if (resolvedButton) {
          resolvedButton.addEventListener("click", () =>
            onResolvedMarker(marker),
          )
        }
      })

      leafletMarker.addTo(markersLayerRef.current)
    })

    markersLayerRef.current.addTo(mapInstanceRef.current)
  }, [filteredMarkers, leafletRef, iconsRef, onLikeMarker, onResolvedMarker])

  useEffect(() => {
    if (mapInstanceRef.current && leafletRef.current && iconsRef.current) {
      updateMapMarkers()
    }
  }, [filteredMarkers, updateMapMarkers])

  useEffect(() => {
    if (!mapRef.current || mapInitializedRef.current) {
      return
    }

    mapInitializedRef.current = true

    async function initMap() {
      try {
        const userLocationPromise = new Promise<[number, number]>(
          (resolve, reject) => {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                resolve([position.coords.latitude, position.coords.longitude])
              },
              (error) => {
                toast.error("Erro ao obter localização do usuário. Permita o acesso à localização no navegador.")
                reject(error)
              },
              { timeout: 3000, maximumAge: 0 },
            )
          },
        )

        const defaultLocation: [number, number] = [-23.5902, -48.0338]
        let initialLocation = defaultLocation
        try {
          initialLocation = await Promise.race([
            userLocationPromise,
            new Promise<[number, number]>((_, reject) =>
              setTimeout(() => reject(new Error("Timeout")), 3000),
            ),
          ])
          initialCenteringDoneRef.current = true
        } catch (error) {
          toast("Usando localização padrão para inicialização inicial.", {
            description: error instanceof Error ? error.message : String(error),
            icon: "📍"
          })
        }

        const initOptions = {
          mapRef,
          mapInstanceRef,
          userLocationMarkerRef,
          leafletRef,
          iconsRef,
          defaultLocation: initialLocation,
          defaultZoom,
          loadMarkersFromFirebase,
          onLikeMarker,
          onResolvedMarker,
          setIsLoading,
          addLeafletCSS,
          addMarkerStyles,
          addLikeStyles,
          skipUserLocationSetView: initialCenteringDoneRef.current,
          skipMarkersAddition: true,
        }

        await initializeMap(initOptions)

        watchIdRef.current = setupLocationTracking(
          mapInstanceRef,
          userLocationMarkerRef,
          defaultZoom,
          followMode,
        )

        if (!initialCenteringDoneRef.current) {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const { latitude, longitude } = position.coords
              if (mapInstanceRef.current && !initialCenteringDoneRef.current) {
                mapInstanceRef.current.setView(
                  [latitude, longitude],
                  defaultZoom,
                )
                initialCenteringDoneRef.current = true
              }
            },
            (error) => {
              toast.error("Erro ao tentar centralizar no usuário. Permita o acesso à localização.")
            },
            { timeout: 10000, maximumAge: 0 },
          )
        }

        updateMapMarkers()
      } catch (error) {
  toast.error("Erro ao inicializar o mapa.")
  mapInitializedRef.current = false
      }
    }

    initMap()

    const cleanupCenterOnUserEvent = setupCenterOnUserEvent(
      mapInstanceRef,
      userLocationMarkerRef,
      defaultZoom,
    )

    return () => {
      cleanupCenterOnUserEvent()

      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }

      if (markersLayerRef.current && mapInstanceRef.current) {
        mapInstanceRef.current.removeLayer(markersLayerRef.current)
        markersLayerRef.current = null
      }

      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
        mapInitializedRef.current = false
        initialCenteringDoneRef.current = false
      }
    }
  }, [
    loadMarkersFromFirebase,
    addMarkerStyles,
    followMode,
    onLikeMarker,
    onResolvedMarker,
    setIsLoading,
    defaultZoom,
    updateMapMarkers
  ])

  useEffect(() => {
    console.log("Verificando condições para criar marcador:", {
      userConfirmedProblem,
      selectedProblemType,
      mapInitialized: !!mapInstanceRef.current,
      userLocationInitialized: !!userLocationMarkerRef.current,
      leafletInitialized: !!leafletRef.current
    })

    if (
      !userConfirmedProblem ||
      !selectedProblemType ||
      !mapInstanceRef.current ||
      !userLocationMarkerRef.current ||
      !leafletRef.current
    ) {
      return
    }

    console.log("Todas as condições atendidas, criando marcador para o tipo:", selectedProblemType)
    const markerPosition = userLocationMarkerRef.current.getLatLng()

    createAndSaveMarker({
      markerPosition,
      selectedProblemType,
      iconsRef,
      mapInstanceRef,
      leafletRef,
      setMarkers,
    })

    resetConfirmation()
  }, [userConfirmedProblem, selectedProblemType, resetConfirmation, setMarkers, iconsRef, mapInstanceRef, leafletRef])

  useEffect(() => {
    return setupResizeHandler(mapInstanceRef)
  }, [])

  return (
    <div className="relative h-screen w-full">
      <div ref={mapRef} className="h-full w-full" />
      <LocationControls
        centerOnUserLocation={centerOnUserLocation}
        followMode={followMode}
        toggleReportMenu={handleReportProblem}
      />
      <FilterDrawer
        open={filterDrawerOpen}
        onOpenChange={setFilterDrawerOpen}
        availableTypes={markerTypes}
        selectedTypes={selectedTypes}
        onFilterChange={onFilterChange}
      />
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <Button
          variant="floating"
          size="icon-sm"
          onClick={() => setFilterDrawerOpen(true)}
          title="Abrir filtros"
        >
          <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-filter"><line x1="22" x2="2" y1="3" y2="3"/><line x1="16" x2="8" y1="9" y2="9"/><line x1="21" x2="3" y1="15" y2="15"/><line x1="12" x2="12" y1="21" y2="3"/></svg>
        </Button>
        <SidebarTrigger />
      </div>
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false)
    </div>
  )
}

export { MapContent }

