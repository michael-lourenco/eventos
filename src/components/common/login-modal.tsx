"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { UserData } from "@/components/user/types/user"
import { useEffect, useState } from "react"

interface LoginModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  handleLogin: () => Promise<void>
  user: UserData | null
}

export function LoginModal({ 
  open, 
  onOpenChange, 
  handleLogin,
  user 
}: LoginModalProps) {
  const [isMounted, setIsMounted] = useState(false)
  const [isLoggingIn, setIsLoggingIn] = useState(false)

  // Verifica se o componente foi montado (lado do cliente)
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Se o usuário estiver logado ou o componente não estiver montado, não mostramos o modal
  if (!isMounted || user) return null

  // Função para lidar com o login e exibir estado de carregamento
  const handleLoginClick = async () => {
    try {
      setIsLoggingIn(true)
      // Salvar a página atual antes do login
      if (typeof window !== 'undefined') {
        const currentPath = window.location.pathname;
        localStorage.setItem('redirectAfterLogin', currentPath);
      }
      await handleLogin()
    } catch (error) {
      console.error("Erro durante o login:", error)
    } finally {
      setIsLoggingIn(false)
    }
  }

  // Intercepta a tentativa de fechar o modal para mantê-lo aberto quando necessário
  const handleOpenChange = (newOpen: boolean) => {
    // Se o usuário estiver logado, permitimos fechar
    if (user) {
      onOpenChange(false)
      return
    }
    
    // Se o usuário tentar fechar e não estiver logado, mantemos aberto
    if (!newOpen && !user) return
    
    // Caso contrário, passamos o valor para o callback
    onOpenChange(newOpen)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md" onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Autenticação Necessária</DialogTitle>
          <DialogDescription>
            Para utilizar o mapa e reportar problemas na cidade, é necessário fazer login.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center space-y-4 py-4">
          <div className="max-w-xs">
            <div className="mx-auto h-[150px] w-[150px] flex items-center justify-center bg-muted rounded-md">
              <span className="text-xl font-bold">Me Arrume</span>
            </div>
          </div>
          <p className="text-center text-sm text-muted-foreground">
            Ao fazer login, você poderá reportar problemas na cidade, 
            acompanhar o status dos problemas reportados e contribuir 
            para a melhoria da sua comunidade.
          </p>
        </div>
        <DialogFooter className="flex flex-col-reverse sm:flex-row sm:justify-center">
          <Button 
            variant="default" 
            onClick={handleLoginClick}
            disabled={isLoggingIn}
            className="w-full sm:w-auto"
          >
            {isLoggingIn ? "Entrando..." : "Entrar com Google"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 