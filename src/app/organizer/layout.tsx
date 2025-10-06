import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Organizador | Me Arrume",
  description: "Gerencie seus eventos e conecte-se com sua audiência",
}

export default function OrganizerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  )
}
