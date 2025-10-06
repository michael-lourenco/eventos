"use client"

import { Footer } from "@/components/common/footer"
import { useAuth } from "@/hooks/use-auth"

export default function About() {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <p>Carregando...</p>
      </div>
    )
  }

  return (
    <div className="bg-background text-primary flex min-h-screen flex-col">
      <main className="flex flex-grow flex-col items-center justify-start pt-4">
        <div className="mx-auto max-w-4xl">
          <h1> Me Arrume </h1>
        </div>
      </main>
      <Footer />
    </div>
  )
}
