import { EventCategory } from "./types/event"

// Mapeamento de categorias de eventos para ícones existentes
export const EVENT_CATEGORY_ICONS: Record<EventCategory, string> = {
  [EventCategory.MUSIC]: "som-alto", // Usar ícone de som alto para música
  [EventCategory.FOOD]: "padrao", // Usar ícone padrão para gastronomia
  [EventCategory.SPORTS]: "padrao", // Usar ícone padrão para esporte
  [EventCategory.CULTURE]: "padrao", // Usar ícone padrão para cultura
  [EventCategory.BUSINESS]: "padrao", // Usar ícone padrão para negócios
  [EventCategory.EDUCATION]: "padrao", // Usar ícone padrão para educação
  [EventCategory.HEALTH]: "padrao", // Usar ícone padrão para saúde
  [EventCategory.TECHNOLOGY]: "padrao", // Usar ícone padrão para tecnologia
  [EventCategory.ART]: "padrao", // Usar ícone padrão para arte
  [EventCategory.FASHION]: "padrao", // Usar ícone padrão para moda
}

// Função para criar ícones de eventos usando os ícones existentes
export const createEventIcons = (L: any) => {
  // Default base configuration for unconfigured icons
  const baseIconConfig = {
    iconUrl: "/map-icons-fixed/padrao.svg",
    iconRetinaUrl: "/map-icons-fixed/padrao.svg",
    shadowUrl: "/map-icons-fixed/sombra.svg",
    iconSize: [52, 52],
    iconAnchor: [2, 50],
    popupAnchor: [1, -34],
    shadowSize: [52, 52],
  }

  // Default icon for unmapped cases
  const defaultIcon = new L.Icon(baseIconConfig)

  // User location icon (mantido do sistema original)
  const userLocationSvg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <!-- Círculo externo pulsante -->
      <circle cx="12" cy="12" r="6" fill="var(--brand)" opacity="0.8">
        <animate 
          attributeName="r" 
          from="6" 
          to="15" 
          dur="1.5s" 
          begin="0s" 
          repeatCount="indefinite" 
        />
        <animate 
          attributeName="opacity" 
          from="0.8" 
          to="0" 
          dur="1.5s" 
          begin="0s" 
          repeatCount="indefinite" 
        />
      </circle>
      
      <!-- Círculo central fixo de 12x12 com stroke branco de 1px -->
      <circle cx="12" cy="12" r="6" fill="var(--brand)" stroke="white" stroke-width="1" />
    </svg>
  `

  const userLocationIcon = new L.DivIcon({
    html: userLocationSvg,
    className: "user-location-icon",
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  })

  // Initialize the icons object with default icons
  const icons: Record<string, any> = {
    default: defaultIcon,
    userLocation: userLocationIcon,
  }

  // Create icons for each event category using existing icons
  Object.entries(EVENT_CATEGORY_ICONS).forEach(([category, iconName]) => {
    icons[category] = new L.Icon({
      ...baseIconConfig,
      iconUrl: `/map-icons-fixed/${iconName}.svg`,
      iconRetinaUrl: `/map-icons-fixed/${iconName}.svg`,
      shadowUrl: baseIconConfig.shadowUrl,
      className: `${category.toLowerCase()}-icon`,
    })
  })

  return icons
}

// Função para obter o ícone de uma categoria específica
export const getEventCategoryIcon = (category: EventCategory): string => {
  return EVENT_CATEGORY_ICONS[category] || "padrao"
}

// Função para obter o label de uma categoria
export const getEventCategoryLabel = (category: EventCategory): string => {
  const labels: Record<EventCategory, string> = {
    [EventCategory.MUSIC]: "Música",
    [EventCategory.FOOD]: "Gastronomia",
    [EventCategory.SPORTS]: "Esporte",
    [EventCategory.CULTURE]: "Cultura",
    [EventCategory.BUSINESS]: "Negócios",
    [EventCategory.EDUCATION]: "Educação",
    [EventCategory.HEALTH]: "Saúde",
    [EventCategory.TECHNOLOGY]: "Tecnologia",
    [EventCategory.ART]: "Arte",
    [EventCategory.FASHION]: "Moda",
  }
  return labels[category] || "Outros"
}
