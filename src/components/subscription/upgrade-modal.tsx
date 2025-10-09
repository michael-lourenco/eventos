'use client'

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { Crown, Zap, ArrowRight } from 'lucide-react'

interface UpgradeModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  reason: string
  action?: 'pay_per_event' | 'upgrade_subscription'
}

export function UpgradeModal({ open, onOpenChange, reason, action = 'pay_per_event' }: UpgradeModalProps) {
  const router = useRouter()

  const handleUpgrade = () => {
    router.push('/pricing')
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
            {action === 'pay_per_event' ? (
              <Zap className="h-8 w-8 text-primary" />
            ) : (
              <Crown className="h-8 w-8 text-primary" />
            )}
          </div>
          <DialogTitle className="text-center text-xl">
            {action === 'pay_per_event' 
              ? 'Criar Seu Primeiro Evento'
              : 'Faça Upgrade do Seu Plano'
            }
          </DialogTitle>
          <DialogDescription className="text-center">
            {reason}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {action === 'pay_per_event' ? (
            <>
              <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-6 text-center border border-primary/20">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Zap className="h-5 w-5 text-primary" />
                  <p className="text-3xl font-bold text-primary">R$ 29,90</p>
                </div>
                <p className="text-sm text-muted-foreground">por evento criado</p>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <Crown className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Evento fica ativo até data fim</p>
                    <p className="text-xs text-muted-foreground">Publicado imediatamente após pagamento</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <Crown className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Dashboard de organizador</p>
                    <p className="text-xs text-muted-foreground">Gerencie seus eventos criados</p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="mt-1 flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 flex-shrink-0">
                    <Crown className="h-3 w-3 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">Sem limite de eventos</p>
                    <p className="text-xs text-muted-foreground">Crie quantos precisar</p>
                  </div>
                </div>
              </div>

              <div className="rounded-lg bg-blue-50 border border-blue-200 p-4">
                <p className="text-sm text-blue-800">
                  <strong>💡 Dica:</strong> Se você criar eventos frequentemente, o plano Mensal 
                  (R$ 199,90/mês) sai mais em conta a partir de 7 eventos/mês.
                </p>
              </div>
            </>
          ) : (
            <>
              <div className="rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 p-6 border border-primary/20">
                <p className="text-center font-semibold mb-4">Planos Disponíveis</p>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-primary" />
                      Mensal (8 eventos/mês)
                    </span>
                    <span className="font-semibold">R$ 199,90/mês</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <Crown className="h-4 w-4 text-primary" />
                      Anual (8 eventos/mês)
                    </span>
                    <span className="font-semibold">R$ 1.999,00/ano</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <p className="font-medium">Recursos Premium inclusos:</p>
                <ul className="space-y-1 text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Crown className="h-3 w-3 text-primary" />
                    Analytics avançado
                  </li>
                  <li className="flex items-center gap-2">
                    <Crown className="h-3 w-3 text-primary" />
                    Destaque no mapa
                  </li>
                  <li className="flex items-center gap-2">
                    <Crown className="h-3 w-3 text-primary" />
                    Eventos recorrentes
                  </li>
                  <li className="flex items-center gap-2">
                    <Crown className="h-3 w-3 text-primary" />
                    Exportação de dados
                  </li>
                </ul>
              </div>
            </>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancelar
            </Button>
            <Button onClick={handleUpgrade} className="flex-1">
              Ver Planos
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

