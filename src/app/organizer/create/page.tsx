"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
// import { EventForm } from "@/components/event/event-form"
import { useEventCreation } from "@/hooks/use-event-creation"
import { useAuth } from "@/hooks/use-auth"
import { useGeolocation } from "@/hooks/use-geolocation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, MapPin, AlertCircle, Calendar, Clock, Users, DollarSign } from "lucide-react"
import type { EventFormData } from "@/components/event/types/event"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

export default function CreateEventPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()
  const { createEvent, loading: createLoading, error } = useEventCreation()
  const { location, loading: locationLoading, error: locationError, permissionDenied, requestLocationPermission } = useGeolocation()
  const [showLocationError, setShowLocationError] = useState(false)

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login")
    }
  }, [user, authLoading, router])

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
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto mb-4"></div>
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
    <div className="container mx-auto py-8 px-4">
      {/* Header */}
      <div className="mb-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        
        <div className="flex items-center gap-2 mb-2">
          <MapPin className="h-6 w-6 text-emerald-500" />
          <h1 className="text-3xl font-bold">Criar Evento</h1>
        </div>
        <p className="text-muted-foreground">
          Publique seu evento no mapa para que pessoas próximas possam encontrá-lo
        </p>
      </div>

      {/* Location Error Alert */}
      {showLocationError && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
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
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-emerald-500"></div>
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
            <div className="flex items-center gap-2 text-sm text-emerald-600">
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
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      {/* Geolocation Required Message */}
      {(!location && !locationLoading) && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <MapPin className="h-5 w-5" />
              Geolocalização Necessária
            </CardTitle>
            <CardDescription className="text-orange-700">
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
              <p className="text-sm text-orange-700">
                <strong>Como permitir a geolocalização:</strong>
              </p>
              <ul className="text-sm text-orange-600 space-y-1 ml-4">
                <li>• Clique no ícone de localização na barra de endereços</li>
                <li>• Selecione "Permitir" quando solicitado</li>
                <li>• Recarregue a página</li>
              </ul>
            </div>

            <div className="flex gap-2">
              <Button 
                onClick={requestLocationPermission}
                variant="outline"
                className="border-orange-300 text-orange-700 hover:bg-orange-100"
              >
                <MapPin className="h-4 w-4 mr-2" />
                Tentar Novamente
              </Button>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-orange-600 hover:bg-orange-700"
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
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-emerald-500"></div>
              <p className="text-muted-foreground">Obtendo sua localização...</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Event Form - Only show when location is available */}
      {location && (
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
    </div>
  )
}

// Componente de formulário para criação de eventos
function EventCreationForm({ onSubmit, loading }: { onSubmit: (data: EventFormData) => void, loading: boolean }) {
  const { location } = useGeolocation()
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "music",
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
            <span className="block mt-2 text-sm text-emerald-600">
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
            <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="music">🎵 Música</SelectItem>
                <SelectItem value="food">🍕 Gastronomia</SelectItem>
                <SelectItem value="sports">⚽ Esporte</SelectItem>
                <SelectItem value="culture">🎭 Cultura</SelectItem>
                <SelectItem value="business">💼 Negócios</SelectItem>
                <SelectItem value="education">📚 Educação</SelectItem>
                <SelectItem value="health">💪 Saúde</SelectItem>
                <SelectItem value="technology">💻 Tecnologia</SelectItem>
                <SelectItem value="art">🎨 Arte</SelectItem>
                <SelectItem value="fashion">👗 Moda</SelectItem>
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
