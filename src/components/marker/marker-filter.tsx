"use client"

import { Button } from "@/components/ui/button"
import { Filter } from "lucide-react"
import { useState } from "react"

interface MarkerFilterProps {
  availableTypes: string[]
  selectedTypes: string[]
  onFilterChange: (selectedTypes: string[]) => void
}

export function MarkerFilter({
  availableTypes,
  selectedTypes,
  onFilterChange,
}: MarkerFilterProps) {
  const [isOpen, setIsOpen] = useState(false)

  const toggleFilter = () => {
    setIsOpen(!isOpen)
  }

  return (
    <div className="flex flex-col items-end">
      <Button
        variant="floating"
        title="Filtro"
        onClick={toggleFilter}
        className="relative"
        size="icon-sm"
      >
        <Filter className="size-6" />
        {selectedTypes.length > 0 && (
          <span className="bg-primary text-primary-foreground absolute -top-1 -right-2 ml-1 flex h-5 w-5 items-center justify-center rounded-full text-sm">
            {selectedTypes.length}
          </span>
        )}
      </Button>

      {isOpen && (
        <div className="bg-secondary w-64 rounded-lg p-3 shadow-md">
          <h3 className="mb-2 text-sm font-medium">Filtrar por tipo:</h3>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedTypes.length === 0 ? "default" : "outline"}
              onClick={() => onFilterChange([])}
            >
              Todos
            </Button>
            {availableTypes.map((type) => (
              <Button
                key={type}
                size="sm"
                variant={selectedTypes.includes(type) ? "default" : "outline"}
                onClick={() => {
                  if (selectedTypes.includes(type)) {
                    onFilterChange(selectedTypes.filter((t) => t !== type))
                  } else {
                    onFilterChange([...selectedTypes, type])
                  }
                }}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
