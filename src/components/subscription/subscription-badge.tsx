import { Badge } from '@/components/ui/badge'
import { Crown, Zap, Star, User } from 'lucide-react'
import { SubscriptionPlan } from '@/types/subscription'

interface SubscriptionBadgeProps {
  plan: SubscriptionPlan | string
  size?: 'sm' | 'md' | 'lg'
  showIcon?: boolean
}

export function SubscriptionBadge({ plan, size = 'md', showIcon = true }: SubscriptionBadgeProps) {
  const config = {
    [SubscriptionPlan.VISITOR]: {
      label: 'Visitante',
      icon: User,
      variant: 'secondary' as const,
      className: 'bg-gray-100 text-gray-700'
    },
    [SubscriptionPlan.PER_EVENT]: {
      label: 'Por Evento',
      icon: Zap,
      variant: 'default' as const,
      className: 'bg-blue-100 text-blue-700 border-blue-200'
    },
    [SubscriptionPlan.MONTHLY]: {
      label: 'Mensal',
      icon: Crown,
      variant: 'default' as const,
      className: 'bg-purple-100 text-purple-700 border-purple-200'
    },
    [SubscriptionPlan.ANNUAL]: {
      label: 'Anual Premium',
      icon: Star,
      variant: 'default' as const,
      className: 'bg-amber-100 text-amber-700 border-amber-200'
    },
  }

  const planConfig = config[plan as SubscriptionPlan] || config[SubscriptionPlan.VISITOR]
  const { label, icon: Icon, className } = planConfig

  const sizeClasses = {
    sm: 'text-xs py-0.5 px-2',
    md: 'text-sm py-1 px-3',
    lg: 'text-base py-1.5 px-4',
  }

  const iconSizes = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  }

  return (
    <Badge 
      variant="outline" 
      className={`${className} ${sizeClasses[size]} font-medium inline-flex items-center gap-1.5`}
    >
      {showIcon && <Icon className={iconSizes[size]} />}
      {label}
    </Badge>
  )
}

