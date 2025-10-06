import { Button } from "@/components/ui/button"
import { UserData } from "@/components/user/types/user"
import React from "react"

interface UserInfoProps {
  user: UserData | null
  handleLogin: () => void
  handleLogout: () => void
}

export const UserInfo: React.FC<UserInfoProps> = ({ user, handleLogin }) => {
  const localStorageUser =
    typeof window !== "undefined" && localStorage.getItem("user") !== null
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : null
  return (
    <>
      {user || (localStorageUser && localStorage.getItem("user") != null) ? (
        <div className="text-primary bg-background mb-4 flex flex-col rounded-sm p-4">
          <div className="grid grid-cols-[1fr,auto,auto] items-center gap-2">
            <div className="flex items-center truncate text-lg font-semibold">
              <span className="text-primary">{user?.displayName ?? 0}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-primary bg-baclkground mb-4 flex flex-col rounded-lg p-4">
          <div className="grid grid-cols-[1fr,auto] items-center gap-2">
            <Button
              onClick={handleLogin}
              variant="default"
            >
              Sign in with Google
            </Button>
          </div>
        </div>
      )}
    </>
  )
}
