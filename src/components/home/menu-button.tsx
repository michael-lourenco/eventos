import { Button } from "@/components/ui/button"
import React from "react"

export interface MenuButtonProps {
  label: string
  onClick: () => void
}

export const MenuButton: React.FC<MenuButtonProps> = ({ label, onClick }) => (
  <Button
    className="border-lime-500 text-lime-500 hover:bg-lime-500 hover:text-slate-900"
    variant="outline"
    onClick={onClick}
  >
    {label}
  </Button>
)
