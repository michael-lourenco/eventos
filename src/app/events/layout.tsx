import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Eventos Próximos | Me Arrume",
  description: "Descubra eventos próximos a você e participe da vida cultural da sua cidade",
}

export default function EventsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="h-screen w-full">
      {children}
    </div>
  )
}
