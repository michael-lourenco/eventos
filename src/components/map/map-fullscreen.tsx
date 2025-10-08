"use client"
import { TProblemType } from "@/constants/map-constants"
import { useClientState } from "@/hooks/use-client-state"
import type React from "react"
import { useCallback, useState } from "react"
import { MapContent } from "./map-content"

interface MapFullScreenProps {
  selectedProblemType: TProblemType | undefined
  handleProblemSelect: (problemType: TProblemType) => void
  handleConfirmProblem: () => void
  userConfirmedProblem: boolean
  resetConfirmation: () => void
  toggleReportMenu: () => void
  onNeedLogin: () => void
}

const MapFullScreen: React.FC<MapFullScreenProps> = ({
  selectedProblemType,
  handleProblemSelect,
  handleConfirmProblem,
  userConfirmedProblem,
  resetConfirmation,
  toggleReportMenu,
  onNeedLogin,
}) => {
  const { isLoading, setIsLoading, isClient } = useClientState()

  // Add state for selected filter types
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  // Use useCallback to prevent unnecessary re-renders
  const handleFilterChange = useCallback((types: string[]) => {
    setSelectedTypes(types)
  }, [])

  return (
    <>
      {!isClient || isLoading ? (
        <div className="absolute inset-0 flex animate-pulse items-center justify-center bg-muted">
          <span className="text-muted-foreground">Carregando mapa...</span>
        </div>
      ) : null}

      {isClient && (
        <MapContent
          setIsLoading={setIsLoading}
          selectedProblemType={selectedProblemType}
          handleProblemSelect={handleProblemSelect}
          handleConfirmProblem={handleConfirmProblem}
          userConfirmedProblem={userConfirmedProblem}
          resetConfirmation={resetConfirmation}
          toggleReportMenu={toggleReportMenu}
          selectedTypes={selectedTypes}
          onFilterChange={handleFilterChange}
          onNeedLogin={onNeedLogin}
        />
      )}
    </>
  )
}

export { MapFullScreen }

