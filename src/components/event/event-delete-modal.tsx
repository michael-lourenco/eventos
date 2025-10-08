"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Trash2, AlertCircle } from "lucide-react"
import type { Event } from "@/components/event/types/event"

interface EventDeleteModalProps {
  event: Event
  open: boolean
  onOpenChange: (open: boolean) => void
  onConfirm: (eventId: string) => Promise<boolean>
  loading?: boolean
}

export function EventDeleteModal({ event, open, onOpenChange, onConfirm, loading = false }: EventDeleteModalProps) {
  const [error, setError] = useState<string | null>(null)

  const handleConfirm = async () => {
    setError(null)
    
    const success = await onConfirm(event.id)
    if (success) {
      onOpenChange(false)
    } else {
      setError("Erro ao excluir evento. Tente novamente.")
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <Trash2 className="h-5 w-5" />
            Excluir Evento
          </DialogTitle>
          <DialogDescription>
            Esta ação não pode ser desfeita. O evento será permanentemente removido.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Event Info */}
          <div className="bg-muted p-4 rounded-lg">
            <h4 className="font-medium text-foreground">{event.title}</h4>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{event.description}</p>
            <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
              <span>📅 {new Date(event.startDate instanceof Date ? event.startDate : event.startDate.toDate()).toLocaleDateString()}</span>
              <span>👥 {event.interestedBy?.length || 0} interessados</span>
              <span>✅ {event.attendedBy?.length || 0} participantes</span>
            </div>
          </div>

          {/* Warning */}
          <Alert className="border-destructive/20 bg-destructive/10">
            <AlertCircle className="h-4 w-4 text-destructive" />
            <AlertDescription className="text-destructive">
              <strong>Atenção:</strong> Todos os dados do evento, incluindo interessados e participantes, serão perdidos permanentemente.
            </AlertDescription>
          </Alert>
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Excluindo...
              </>
            ) : (
              <>
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir Evento
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
