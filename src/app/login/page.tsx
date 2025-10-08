"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/hooks/use-auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { MapPin, ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const { handleLogin, loading, user } = useAuth()
  const [error, setError] = useState<string | null>(null)

  // Redirecionar usuário já logado
  useEffect(() => {
    if (user) {
      const redirectPath = localStorage.getItem('redirectAfterLogin');
      if (redirectPath && redirectPath !== '/login') {
        localStorage.removeItem('redirectAfterLogin');
        router.push(redirectPath);
      } else {
        router.push("/user");
      }
    }
  }, [user, router])

  const handleGoogleLogin = async () => {
    try {
      setError(null)
      await handleLogin()
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      setError("Erro ao fazer login. Tente novamente.")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-white to-slate-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-primary hover:text-primary mb-4">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao início
          </Link>
          
          <div className="flex items-center justify-center gap-2 mb-4">
            <MapPin className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-primary">Eventos Locais</h1>
          </div>
          
          <p className="text-muted-foreground">
            Faça login para criar eventos e participar da comunidade
          </p>
        </div>

        {/* Login Card */}
        <Card>
          <CardHeader className="text-center">
            <CardTitle>Entrar na Plataforma</CardTitle>
            <CardDescription>
              Conecte-se com sua conta Google para começar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full"
              size="lg"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Entrando...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Entrar com Google
                </>
              )}
            </Button>

            <div className="text-center text-sm text-muted-foreground">
              Ao continuar, você concorda com nossos{" "}
              <Link href="#" className="text-primary hover:underline">
                Termos de Serviço
              </Link>{" "}
              e{" "}
              <Link href="#" className="text-primary hover:underline">
                Política de Privacidade
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Features */}
        <div className="mt-8 text-center">
          <h3 className="text-lg font-medium mb-4">O que você pode fazer:</h3>
          <div className="grid grid-cols-1 gap-3 text-sm text-muted-foreground">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Criar e publicar eventos</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Demonstrar interesse em eventos</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Confirmar participação</span>
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary rounded-full"></div>
              <span>Acessar dashboard do organizador</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
