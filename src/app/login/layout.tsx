import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | Eventos Locais",
  description: "Faça login para criar eventos e participar da comunidade",
}

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      {children}
    </div>
  )
}
