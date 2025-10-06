import { Button } from "@/components/ui/button"
import React from "react"

interface GridButtonsProps {
  gridValues: number[]
  isAuthenticated: (value: number) => boolean
  handleGridItemClick: (value: number) => void
  allDisabled: boolean
}

export const GridButtons: React.FC<GridButtonsProps> = ({
  gridValues,
  isAuthenticated,
  handleGridItemClick,
  allDisabled,
}) => (
  <div className="w-full max-w-full overflow-hidden">
    <div className="mx-0 grid grid-cols-8 gap-1 px-0 sm:gap-2">
      {gridValues.map((value, index) => (
        <Button
          key={index}
          variant="outline"
          className={`border-muted-foreground text-primary flex aspect-square w-full items-center justify-center rounded-lg border border-dashed p-0 text-xs sm:text-sm md:text-base ${
            isAuthenticated(value)
              ? "authenticated border-muted-foreground text-primary bg-chart-4 border border-dashed opacity-100"
              : "border-muted-foreground"
          } ${
            !isAuthenticated(value)
              ? ""
              : "hover:text-chart-4 hover:bg-background opacity-100"
          } transition-colors`}
          onClick={() => handleGridItemClick(value)}
          disabled={allDisabled || isAuthenticated(value)}
        >
          {value}
        </Button>
      ))}
    </div>
  </div>
)
