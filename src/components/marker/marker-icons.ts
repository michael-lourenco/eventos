import type { ProblemCategory, ProblemSubcategory } from "@/components/map/types/map"
import { PROBLEM_CATEGORIES } from "@/constants/map-constants"

// Refactored function to create icons dynamically using mapIcon config from each category/subcategory
export const createMapIcons = (L: any) => {
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

  // Icone de localização atual do usuario
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

  // User location icon usando divIcon com SVG incorporado
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

  // Process all main categories
  PROBLEM_CATEGORIES.forEach((category: ProblemCategory) => {
    console.log(category)
    icons[category.icon] = new L.Icon({
      ...(category.mapIcon || baseIconConfig),
      className: `${category.id.toLowerCase()}-icon`,
    })

    // Process subcategories if they exist
    if (category.subcategories && category.subcategories.length > 0) {
      category.subcategories.forEach((subCategory: ProblemSubcategory) => {
        // Criar ícone para cada subcategoria, adicionando o prefixo da pasta
        icons[subCategory.type as unknown as string] = new L.Icon({
          ...baseIconConfig,
          iconUrl: `/map-icons-fixed/${subCategory.icon.toLowerCase()}`,
          iconRetinaUrl: `/map-icons-fixed/${subCategory.icon.toLowerCase()}`,
          shadowUrl: baseIconConfig.shadowUrl,
          className: `${subCategory.id.toLowerCase()}-icon`,
        });
      });
    }
  })


  return icons
}