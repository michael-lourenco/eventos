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
    className="justify-center bg-card flex items-center text-primary-foreground hover:bg-muted"
    onClick={onClick}
  >
    {label}
  </Button>
)

export default UserMenuButton
