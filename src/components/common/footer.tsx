"use client"

import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import Link from "next/link"
import { usePathname } from "next/navigation"

const menuItems = [
  { icon: "LuHome", label: "Home", href: "/" },
  { icon: "LuHelpCircle", label: "Sobre", href: "/about" },
  { icon: "LuUser", label: "Perfil", href: "/user" },
] as const

export function Footer() {
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <footer className="bg-background sticky bottom-0 w-full border-t border-dashed">
        <nav className="mx-auto max-w-md px-0 py-0">
          <div className="flex items-center justify-between">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant={isActive ? "ghost" : "secondary"}
                      className="flex h-16 flex-1 flex-col items-center justify-center space-y-1 rounded-none"
                    >
                      <Link href={item.href}>
                        <span className="text-xs font-medium">
                          {item.label}
                        </span>
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </nav>
      </footer>
    </TooltipProvider>
  )
}
