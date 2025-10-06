import { Button } from "@/components/ui/button"
import { UserData } from "@/components/user/types/user"
import React from "react"

interface UserLogoutProps {
  user: UserData | null
  handleLogin: () => void
  handleLogout: () => void
}

export const UserLogout: React.FC<UserLogoutProps> = ({
  user,
  handleLogout,
}) => {
  const localStorageUser =
    typeof window !== "undefined" && localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null

  return (
    <>
      {user || (localStorageUser && localStorage.getItem("user") != null) ? (
        <div className="text-primary bg-background mb-4 flex flex-col rounded-lg p-4">
          <div className="grid grid-cols-[1fr,auto,auto] items-center gap-2">
            <Button
              onClick={handleLogout}
              variant="destructive"
              size="sm"
              className="whitespace-nowrap"
            >
              Logout
            </Button>
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  )
}
