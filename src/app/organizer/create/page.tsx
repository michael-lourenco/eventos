"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// import { EventForm } from "@/components/event/event-form"
import { useEventCreation } from "@/hooks/use-event-creation"
import { useAuth } from "@/hooks/use-auth"
import { useSubscription } from "@/hooks/use-subscription"
import { useGeolocation } from "@/hooks/use-geolocation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, MapPin, AlertCircle, Calendar, Clock, Users, DollarSign } from "lucide-react"
import type { EventFormData } from "@/components/event/types/event"
import { EventCategory } from "@/components/event/types/event"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { InternalLayout } from "@/components/common/internal-layout"
import { UpgradeModal } from "@/components/subscription/upgrade-modal"

export default function CreateEventPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { canCreateEvent } = useSubscription()
  const { createEvent, loading: createLoading, error } = useEventCreation()
  const { location, loading: locationLoading, error: locationError, permissionDenied, requestLocationPermission } = useGeolocation()
  const [showLocationError, setShowLocationError] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

  // Verificar permissão para criar evento
  useEffect(() => {
    if (user && !canCreateEvent.allowed) {
      setShowUpgradeModal(true)
    }
  }, [user, canCreateEvent])

  useEffect(() => {
    if (locationError) {
      setShowLocationError(true)
    }
  }, [locationError])

  const handleSubmit = async (formData: EventFormData) => {
    if (!location) {
      setShowLocationError(true)
      return
    }

    try {
      const createdEvent = await createEvent(formData, location)
      console.log("Evento criado com sucesso:", createdEvent)
      
      // Redirect to organizer dashboard
      router.push("/organizer/dashboard")
    } catch (error) {
      console.error("Erro ao criar evento:", error)
    }
  }

  if (authLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Carregando...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to login
  }

  return (
    <InternalLayout
      title="Criar Evento"
      subtitle="Publique seu evento no mapa para que pessoas próximas possam encontrá-lo"
    >
      <div className="max-w-4xl mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </div>

      {/* Location Error Alert */}
      {showLocationError && (
        <Alert className="mb-6 border-destructive/20 bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive-foreground">
            Não foi possível obter sua localização. Por favor, permita o acesso à localização 
            no seu navegador e recarregue a página.
          </AlertDescription>
        </Alert>
      )}

      {/* Location Status */}
      {locationLoading && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
              <span className="text-sm text-muted-foreground">
                Obtendo sua localização...
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {location && !locationLoading && (
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-sm text-primary">
              <MapPin className="h-4 w-4" />
              <span>
                Localização obtida: {location.lat.toFixed(6)}, {location.lng.toFixed(6)}
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Error Alert */}
      {error && (
        <Alert className="mb-6 border-destructive/20 bg-destructive/10">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <AlertDescription className="text-destructive-foreground">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Geolocation Required Message */}
      {(!location && !locationLoading) && (
        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-primary">
              <MapPin className="h-5 w-5" />
              Geolocalização Necessária
            </CardTitle>
            <CardDescription className="text-primary">
              Para criar eventos, precisamos saber sua localização atual.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {locationError && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{locationError}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <p className="text-sm text-primary">
                <strong>Como permitir a geolocalização:</strong>
              </p>
              <ul className="text-sm text-primary space-y-1 ml-4">
                <li>• Clique no ícone de localização na barra de endereços</li>
                <li>• Selecione &quot;Permitir&quot; quando solicitado</li>
                <li>• Recarregue a página</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={requestLocationPermission}
                variant="outline"
                className="border-primary/30 text-primary hover:bg-primary/10"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-primary hover:bg-primary/90"
              >
                Recarregar Página
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Loading State */}
      {locationLoading && (
        <Card className="mb-6">
          <CardContent className="py-8">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
              <p className="text-muted-foreground">Obtendo sua localização...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Form - Only show when location is available */}
      {location && canCreateEvent.allowed && (
        <EventCreationForm onSubmit={handleSubmit} loading={createLoading} />
      )}

      {/* Info Card */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle className="text-lg">Informações Importantes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <p>• Seu evento será publicado no mapa usando sua localização atual</p>
          <p>• Eventos gratuitos são publicados imediatamente</p>
          <p>• Eventos pagos requerem confirmação de pagamento</p>
          <p>• Você pode editar ou cancelar seu evento a qualquer momento</p>
          <p>• O evento ficará visível até a data de término</p>
        </CardContent>
      </Card>

      {/* Upgrade Modal */}
      <UpgradeModal
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        reason={canCreateEvent.reason || 'Você precisa de um plano para criar eventos'}
        action={canCreateEvent.action}
      />
      </div>
    </InternalLayout>
  )
}

// Componente de formulário para criação de eventos
function EventCreationForm({ onSubmit, loading }: { onSubmit: (data: EventFormData) => void, loading: boolean }) {
  const { location } = useGeolocation()
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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    const eventData: EventFormData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      startDate: new Date(formData.startDate),
      endDate: new Date(formData.endDate),
      price: {
        type: formData.priceType,
        amount: parseFloat(formData.priceAmount)
      },
      capacity: parseInt(formData.capacity)
    }

    onSubmit(eventData)
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5" />
          Criar Novo Evento
        </CardTitle>
        <CardDescription>
          Preencha os detalhes do seu evento para publicá-lo no mapa
          {location && (
            <span className="block mt-2 text-sm text-primary">
              📍 Localização atual: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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

          {/* Botão de Submit */}
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Criando Evento...
              </>
            ) : (
              <>
                <Calendar className="h-4 w-4 mr-2" />
                Criar Evento
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
