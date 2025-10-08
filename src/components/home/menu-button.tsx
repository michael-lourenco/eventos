import { Button } from "@/components/ui/button"
import React from "react"

export interface MenuButtonProps {
  label: string
  onClick: () => void
}

export const MenuButton: React.FC<MenuButtonProps> = ({ label, onClick }) => (
  <Button
    className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
    variant="outline"
    onClick={onClick}
  >
    {label}
  </Button>
)
