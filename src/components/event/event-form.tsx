"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Upload, MapPin } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { cn } from "@/lib/utils"
import type { EventFormData, EventCategory } from "./types/event"
import { EventCategory as EventCategoryEnum } from "./types/event"

interface EventFormProps {
  onSubmit: (data: EventFormData) => Promise<void>
  loading?: boolean
  initialData?: Partial<EventFormData>
}

export function EventForm({ onSubmit, loading = false, initialData }: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    title: initialData?.title || "",
    description: initialData?.description || "",
    category: initialData?.category || EventCategoryEnum.CULTURE,
    startDate: initialData?.startDate || new Date(),
    endDate: initialData?.endDate || new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 horas depois
    price: initialData?.price || { type: "free" },
    capacity: initialData?.capacity || undefined,
    coverImage: initialData?.coverImage || undefined,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Título é obrigatório"
    } else if (formData.title.length < 3) {
      newErrors.title = "Título deve ter pelo menos 3 caracteres"
    } else if (formData.title.length > 100) {
      newErrors.title = "Título deve ter no máximo 100 caracteres"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Descrição é obrigatória"
    } else if (formData.description.length < 10) {
      newErrors.description = "Descrição deve ter pelo menos 10 caracteres"
    } else if (formData.description.length > 1000) {
      newErrors.description = "Descrição deve ter no máximo 1000 caracteres"
    }

    if (formData.startDate < new Date()) {
      newErrors.startDate = "Data de início deve ser futura"
    }

    if (formData.endDate <= formData.startDate) {
      newErrors.endDate = "Data de término deve ser posterior à data de início"
    }

    if (formData.price.type === "paid" && (!formData.price.amount || formData.price.amount < 5)) {
      newErrors.price = "Valor mínimo para eventos pagos é R$ 5,00"
    }

    if (formData.capacity && formData.capacity > 10000) {
      newErrors.capacity = "Capacidade máxima é 10.000 pessoas"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    try {
      await onSubmit(formData)
    } catch (error) {
      console.error("Erro ao criar evento:", error)
    }
  }

  const handleInputChange = (field: keyof EventFormData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }))
    }
  }

  const handlePriceTypeChange = (type: "free" | "paid") => {
    setFormData(prev => ({
      ...prev,
      price: {
        type,
        amount: type === "paid" ? prev.price.amount || 5 : undefined
      }
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB
        setErrors(prev => ({
          ...prev,
          coverImage: "Imagem deve ter no máximo 5MB"
        }))
        return
      }
      
      if (!file.type.startsWith("image/")) {
        setErrors(prev => ({
          ...prev,
          coverImage: "Arquivo deve ser uma imagem"
        }))
        return
      }

      handleInputChange("coverImage", file)
    }
  }

  const getCategoryLabel = (category: EventCategory): string => {
    const labels: Record<EventCategory, string> = {
      [EventCategoryEnum.MUSIC]: "Música",
      [EventCategoryEnum.FOOD]: "Gastronomia",
      [EventCategoryEnum.SPORTS]: "Esporte",
      [EventCategoryEnum.CULTURE]: "Cultura",
      [EventCategoryEnum.BUSINESS]: "Negócios",
      [EventCategoryEnum.EDUCATION]: "Educação",
      [EventCategoryEnum.HEALTH]: "Saúde",
      [EventCategoryEnum.TECHNOLOGY]: "Tecnologia",
      [EventCategoryEnum.ART]: "Arte",
      [EventCategoryEnum.FASHION]: "Moda",
    }
    return labels[category] || "Outros"
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Criar Novo Evento
        </CardTitle>
        <CardDescription>
          Preencha as informações do seu evento para publicá-lo no mapa
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Título */}
          <div className="space-y-2">
            <Label htmlFor="title">Título do Evento *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Ex: Festival de Música 2024"
              className={errors.title ? "border-red-500" : ""}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Descreva seu evento, o que os participantes podem esperar..."
              rows={4}
              className={errors.description ? "border-red-500" : ""}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label htmlFor="category">Categoria *</Label>
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange("category", value as EventCategory)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione uma categoria" />
              </SelectTrigger>
              <SelectContent>
                {Object.values(EventCategoryEnum).map((category) => (
                  <SelectItem key={category} value={category}>
                    {getCategoryLabel(category)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Data e Hora */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Data de Início *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startDate && "text-muted-foreground",
                      errors.startDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate ? (
                      format(formData.startDate, "dd/MM/yyyy HH:mm", { locale: ptBR })
                    ) : (
                      <span>Selecionar data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.startDate}
                    onSelect={(date) => date && handleInputChange("startDate", date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.startDate && <p className="text-sm text-red-500">{errors.startDate}</p>}
            </div>

            <div className="space-y-2">
              <Label>Data de Término *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.endDate && "text-muted-foreground",
                      errors.endDate && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate ? (
                      format(formData.endDate, "dd/MM/yyyy HH:mm", { locale: ptBR })
                    ) : (
                      <span>Selecionar data</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.endDate}
                    onSelect={(date) => date && handleInputChange("endDate", date)}
                    disabled={(date) => date <= formData.startDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.endDate && <p className="text-sm text-red-500">{errors.endDate}</p>}
            </div>
          </div>

          {/* Preço */}
          <div className="space-y-2">
            <Label>Tipo de Evento *</Label>
            <div className="flex gap-4">
              <Button
                type="button"
                variant={formData.price.type === "free" ? "default" : "outline"}
                onClick={() => handlePriceTypeChange("free")}
              >
                Gratuito
              </Button>
              <Button
                type="button"
                variant={formData.price.type === "paid" ? "default" : "outline"}
                onClick={() => handlePriceTypeChange("paid")}
              >
                Pago
              </Button>
            </div>
            
            {formData.price.type === "paid" && (
              <div className="space-y-2">
                <Label htmlFor="price">Valor (R$) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="5"
                  step="0.01"
                  value={formData.price.amount || ""}
                  onChange={(e) => handleInputChange("price", {
                    ...formData.price,
                    amount: parseFloat(e.target.value) || 0
                  })}
                  placeholder="5.00"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
              </div>
            )}
          </div>

          {/* Capacidade */}
          <div className="space-y-2">
            <Label htmlFor="capacity">Capacidade (opcional)</Label>
            <Input
              id="capacity"
              type="number"
              min="1"
              max="10000"
              value={formData.capacity || ""}
              onChange={(e) => handleInputChange("capacity", parseInt(e.target.value) || undefined)}
              placeholder="Ex: 100"
              className={errors.capacity ? "border-red-500" : ""}
            />
            {errors.capacity && <p className="text-sm text-red-500">{errors.capacity}</p>}
          </div>

          {/* Imagem de Capa */}
          <div className="space-y-2">
            <Label htmlFor="coverImage">Imagem de Capa (opcional)</Label>
            <div className="flex items-center gap-4">
              <Input
                id="coverImage"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Label
                htmlFor="coverImage"
                className="flex items-center gap-2 px-4 py-2 border border-dashed rounded-md cursor-pointer hover:bg-gray-50"
              >
                <Upload className="h-4 w-4" />
                Escolher Imagem
              </Label>
              {formData.coverImage && (
                <span className="text-sm text-gray-600">
                  {(formData.coverImage as File).name}
                </span>
              )}
            </div>
            {errors.coverImage && <p className="text-sm text-red-500">{errors.coverImage}</p>}
            <p className="text-xs text-gray-500">
              Máximo 5MB. Formatos aceitos: JPG, PNG
            </p>
          </div>

          {/* Botão de Submit */}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Criando Evento..." : "Criar Evento"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
