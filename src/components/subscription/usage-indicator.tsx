import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { AlertTriangle, Check } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

interface UsageIndicatorProps {
  title: string
  used: number
  limit: number | null
  unit: string
  description?: string
}

export function UsageIndicator({ title, used, limit, unit, description }: UsageIndicatorProps) {
  // Garantir que used é um número válido
  const safeUsed = isNaN(used) ? 0 : used
  // Garantir que limit é um número válido ou null
  const safeLimit = limit === null || limit === undefined ? null : (isNaN(limit) ? 0 : limit)
  
  const isUnlimited = safeLimit === null
  const progress = isUnlimited ? 0 : (safeLimit > 0 ? (safeUsed / safeLimit) * 100 : 0)
  const remaining = isUnlimited ? null : (safeLimit !== null ? Math.max(0, safeLimit - safeUsed) : null)
  const isNearLimit = progress >= 80 && !isUnlimited
  const isOverLimit = safeUsed >= (safeLimit || 0) && !isUnlimited

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{title}</CardTitle>
            {description && (
              <CardDescription className="text-xs mt-1">{description}</CardDescription>
            )}
          </div>
          {isUnlimited && (
            <Badge variant="secondary" className="bg-green-50 text-green-700 border-green-200">
              Ilimitado
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Usados</span>
            <span className="font-semibold">
              {safeUsed} {isUnlimited ? unit : `de ${safeLimit} ${unit}`}
            </span>
          </div>

          {!isUnlimited && (
            <>
              <Progress 
                value={progress} 
                className={`h-2 ${isOverLimit ? 'bg-red-100' : isNearLimit ? 'bg-amber-100' : ''}`}
              />

              <div className="flex items-center justify-between">
                {isOverLimit ? (
                  <div className="flex items-center gap-2 text-xs text-red-600">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Limite atingido</span>
                  </div>
                ) : isNearLimit ? (
                  <div className="flex items-center gap-2 text-xs text-amber-600">
                    <AlertTriangle className="h-3 w-3" />
                    <span>Próximo do limite</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-xs text-green-600">
                    <Check className="h-3 w-3" />
                    <span>Dentro do limite</span>
                  </div>
                )}
                
                {remaining !== null && (
                  <span className="text-xs text-muted-foreground">
                    {remaining} restantes
                  </span>
                )}
              </div>
            </>
          )}

          {isUnlimited && (
            <p className="text-xs text-muted-foreground">
              Você tem acesso ilimitado a este recurso! 🎉
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

