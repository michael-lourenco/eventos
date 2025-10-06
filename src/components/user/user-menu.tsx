import { Card, CardContent } from "@/components/ui/card"
import { LucideInfo, LucidePlay } from "lucide-react"
import React from "react"
import UserMenuButton from "./user-menu-button"

export interface UserMenuProps {
  onPlay: () => void
  onHowToPlay: () => void
}

export const UserMenu: React.FC<UserMenuProps> = ({ onPlay, onHowToPlay }) => (
  <Card className="right-0 bottom-0 left-0 m-0 bg-slate-900 p-0">
    <CardContent className="flex flex-row justify-center space-x-4 py-4">
      <UserMenuButton
        label={
          <>
            <LucidePlay size={24} /> Jogar
          </>
        }
        onClick={onPlay}
      />
      <UserMenuButton
        label={
          <>
            <LucideInfo size={24} /> Aprender
          </>
        }
        onClick={onHowToPlay}
      />
    </CardContent>
  </Card>
)

export default UserMenu
