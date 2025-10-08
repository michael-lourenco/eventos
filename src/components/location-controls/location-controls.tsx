"use client"
import { Button } from "@/components/ui/button"
import { Locate, MapPin } from "lucide-react"
import Image from "next/image"

interface LocationControlsProps {
  centerOnUserLocation: () => void
  followMode: boolean
  toggleReportMenu: () => void
}

const LocationControls = ({
  centerOnUserLocation,
  followMode,
  toggleReportMenu,
}: LocationControlsProps) => {
  return (
    <div className="fixed right-4 bottom-5 z-50 flex flex-col gap-2">
      <Button
        variant={followMode ? "floating" : "floating"}
        size="icon-lg"
        className={`${followMode ? "bg-primary text-primary-foreground hover:bg-primary/90" : ""}`}
        title={
          followMode
            ? "Desativar centralização automática"
            : "Ativar centralização automática"
        }
        onClick={centerOnUserLocation}
      >
        {followMode ? (
          <MapPin className="size-10" />
        ) : (
          <Locate className="size-10" />
        )}
      </Button>
      <Button
        variant="floating"
        title="Reportar problema"
        onClick={toggleReportMenu}
        size="icon-lg"
      >
        <Image
          src="/map-icons/alerta.svg"
          alt="map-icons"
          width={40}
          height={40}
          style={{ width: 40, height: 40, objectFit: 'contain' }}
          sizes="40px"
        />
      </Button>
    </div>
  )
}

export { LocationControls }

