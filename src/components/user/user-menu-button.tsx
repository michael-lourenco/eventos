import { Button } from "@/components/ui/button"
import React from "react"

export interface UserMenuButtonProps {
  label: React.ReactNode
  onClick: () => void
}

export const UserMenuButton: React.FC<UserMenuButtonProps> = ({
  label,
  onClick,
}) => (
  <Button
    className="justify-centerbg-slate-800 flex items-center text-white hover:bg-slate-700"
    onClick={onClick}
  >
    {label}
  </Button>
)

export default UserMenuButton
