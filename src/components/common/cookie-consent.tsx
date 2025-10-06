"use client"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"

export default function CookieConsent() {
  const [consent, setConsent] = useState<boolean | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  // Verifica se o componente foi montado (lado do cliente)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Carrega o consentimento do localStorage apenas no lado do cliente
  useEffect(() => {
    if (isMounted) {
      try {
        const storedConsent = localStorage.getItem("cookieConsent")
        if (storedConsent !== null) {
          setConsent(storedConsent === "true")
        }
      } catch (error) {
        console.error("Erro ao acessar localStorage:", error)
      }
    }
  }, [isMounted])

  const handleAccept = () => {
    try {
      localStorage.setItem("cookieConsent", "true")
      setConsent(true)
    } catch (error) {
      console.error("Erro ao salvar consentimento:", error)
    }
  }

  const handleReject = () => {
    try {
      localStorage.setItem("cookieConsent", "false")
      setConsent(false)
    } catch (error) {
      console.error("Erro ao salvar consentimento:", error)
    }
  }

  // Não mostre nada durante a hidratação ou se o usuário já deu consentimento
  if (!isMounted || consent !== null) return null

  return (
    <div className="bg-background text-foreground fixed bottom-0 left-0 z-50 flex w-full flex-col items-center justify-between p-4 shadow-md md:flex-row">
      <p className="text-sm">
        Usamos cookies para melhorar sua experiência. Ao continuar, você
        concorda com nossa{" "}
        <a
          href="/politica-de-cookies"
          className="text-blue-400 underline"
        >
          Política de Cookies
        </a>
        .
      </p>
      <div className="mt-2 flex space-x-2 md:mt-0">
        <Button
          onClick={handleAccept}
          variant="default"
        >
          Aceitar
        </Button>
        <Button
          onClick={handleReject}
          variant="outline"
        >
          Recusar
        </Button>
      </div>
    </div>
  )
}
