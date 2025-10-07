"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Calendar, Clock, Users, DollarSign, AlertCircle, MapPin } from "lucide-react"
import type { Event, EventFormData } from "@/components/event/types/event"
import { EventCategory } from "@/components/event/types/event"

interface EventEditModalProps {
  event: Event
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (eventId: string, updatedData: Partial<Event>) => Promise<boolean>
  loading?: boolean
}

export function EventEditModal({ event, open, onOpenChange, onSave, loading = false }: EventEditModalProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: EventCategory.MUSIC,
    startDate: "",
    endDate: "",
    priceType: "free" as "free" | "paid",
    priceAmount: "0",
    capacity: "100"
  })

  const [error, setError] = useState<string | null>(null)

  // Preencher o formulário com os dados do evento quando o modal abrir
  useEffect(() => {
    if (event && open) {
      const startDate = event.startDate instanceof Date ? event.startDate : event.startDate.toDate()
      const endDate = event.endDate instanceof Date ? event.endDate : event.endDate.toDate()
      
      setFormData({
        title: event.title,
        description: event.description,
        category: event.category,
        startDate: startDate.toISOString().slice(0, 16), // Format for datetime-local input
        endDate: endDate.toISOString().slice(0, 16),
        priceType: event.price?.type || "free",
        priceAmount: event.price?.amount?.toString() || "0",
        capacity: event.capacity?.toString() || "100"
      })
      setError(null)
    }
  }, [event, open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    // Validações básicas
    if (!formData.title.trim()) {
      setError("Título é obrigatório")
      return
    }

    if (!formData.description.trim()) {
      setError("Descrição é obrigatória")
      return
    }

    const startDate = new Date(formData.startDate)
    const endDate = new Date(formData.endDate)

    if (startDate >= endDate) {
      setError("Data de término deve ser posterior à data de início")
      return
    }

    if (new Date() >= startDate) {
      setError("Data de início deve ser no futuro")
      return
    }

    // Preparar dados para atualização
    const updatedData: Partial<Event> = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: formData.category,
      startDate: startDate,
      endDate: endDate,
      capacity: parseInt(formData.capacity),
      updatedAt: new Date()
    }

    // Adicionar preço se necessário
    if (formData.priceType === "paid") {
      updatedData.price = {
        type: "paid",
        amount: parseFloat(formData.priceAmount),
        currency: "BRL"
      }
    }
    // Se for gratuito, não incluir o campo price (será removido pelo cleanEventData)

    const success = await onSave(event.id, updatedData)
    if (success) {
      onOpenChange(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Editar Evento
          </DialogTitle>
          <DialogDescription>
            Atualize as informações do seu evento
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Error Alert */}
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Título do Evento */}
          <div className="space-y-2">
            <Label htmlFor="title">Título do Evento *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Ex: Show de Rock na Praça"
              required
            />
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descreva seu evento..."
              rows={4}
              required
            />
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value as EventCategory)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={EventCategory.MUSIC}>🎵 Música</SelectItem>
                <SelectItem value={EventCategory.FOOD}>🍕 Gastronomia</SelectItem>
                <SelectItem value={EventCategory.SPORTS}>⚽ Esporte</SelectItem>
                <SelectItem value={EventCategory.CULTURE}>🎭 Cultura</SelectItem>
                <SelectItem value={EventCategory.BUSINESS}>💼 Negócios</SelectItem>
                <SelectItem value={EventCategory.EDUCATION}>📚 Educação</SelectItem>
                <SelectItem value={EventCategory.HEALTH}>💪 Saúde</SelectItem>
                <SelectItem value={EventCategory.TECHNOLOGY}>💻 Tecnologia</SelectItem>
                <SelectItem value={EventCategory.ART}>🎨 Arte</SelectItem>
                <SelectItem value={EventCategory.FASHION}>👗 Moda</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Data de Início *
              </Label>
              <Input
                id="startDate"
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => handleInputChange("startDate", e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Data de Término *
              </Label>
              <Input
                id="endDate"
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => handleInputChange("endDate", e.target.value)}
                required
              />
            </div>
          </div>

          {/* Preço */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Preço do Evento *
            </Label>
            <div className="flex gap-4">
              <Select value={formData.priceType} onValueChange={(value: "free" | "paid") => handleInputChange("priceType", value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="free">Gratuito</SelectItem>
                  <SelectItem value="paid">Pago</SelectItem>
                </SelectContent>
              </Select>
              {formData.priceType === "paid" && (
                <Input
                  type="number"
                  placeholder="Valor"
                  value={formData.priceAmount}
                  onChange={(e) => handleInputChange("priceAmount", e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-32"
                />
              )}
            </div>
          </div>

          {/* Capacidade */}
          <div className="space-y-2">
            <Label htmlFor="capacity" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Capacidade Máxima
            </Label>
            <Input
              id="capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => handleInputChange("capacity", e.target.value)}
              placeholder="100"
              min="1"
              max="10000"
            />
          </div>

          {/* Localização (readonly) */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Localização
            </Label>
            <Input
              value={`${event.lat.toFixed(6)}, ${event.lng.toFixed(6)}`}
              disabled
              className="bg-gray-50"
            />
            <p className="text-xs text-muted-foreground">
              A localização não pode ser alterada após a criação do evento
            </p>
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
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Salvando...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Salvar Alterações
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
