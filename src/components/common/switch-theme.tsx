"use client"

import { useTheme } from "next-themes"

import { useLayoutEffect, useState } from "react"
import { Label } from "../ui/label"
import { Switch } from "../ui/switch"

export function SwitchTheme() {
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  return (
    <div className="flex items-center justify-between">
      <Label
        htmlFor="dark-mode"
        className="cursor-pointer"
      >
        Tema escuro
      </Label>
      <Switch
        id="dark-mode"
        className="cursor-pointer"
        checked={mounted && theme === "dark"}
        onCheckedChange={() => {
          setTheme(theme === "light" ? "dark" : "light")
        }}
      />
    </div>
  )
}
