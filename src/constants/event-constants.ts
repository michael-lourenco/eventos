export const EVENT_CATEGORIES = [
  {
    id: "music",
    label: "Música",
    icon: "musica",
    description: "Shows, festivais, apresentações musicais"
  },
  {
    id: "food",
    label: "Gastronomia", 
    icon: "gastronomia",
    description: "Festivais de comida, degustações, workshops culinários"
  },
  {
    id: "sports",
    label: "Esporte",
    icon: "esporte", 
    description: "Competições, treinos, eventos esportivos"
  },
  {
    id: "culture",
    label: "Cultura",
    icon: "cultura",
    description: "Teatro, cinema, exposições, eventos culturais"
  },
  {
    id: "business",
    label: "Negócios",
    icon: "negocios",
    description: "Conferências, networking, workshops empresariais"
  },
  {
    id: "education",
    label: "Educação",
    icon: "educacao",
    description: "Palestras, cursos, workshops educacionais"
  },
  {
    id: "health",
    label: "Saúde",
    icon: "saude",
    description: "Eventos de bem-estar, fitness, saúde mental"
  },
  {
    id: "technology",
    label: "Tecnologia",
    icon: "tecnologia",
    description: "Meetups tech, hackathons, conferências de TI"
  },
  {
    id: "art",
    label: "Arte",
    icon: "arte",
    description: "Exposições, galerias, workshops artísticos"
  },
  {
    id: "fashion",
    label: "Moda",
    icon: "moda",
    description: "Desfiles, feiras de moda, eventos fashion"
  }
]

export const DEFAULT_EVENT_LOCATION = {
  lat: -23.5902,
  lng: -48.0338
}

export const EVENT_PRICE_LIMITS = {
  MIN_PAID: 5,
  MAX_PAID: 10000
}

export const EVENT_CAPACITY_LIMITS = {
  MIN: 1,
  MAX: 10000
}

export const EVENT_IMAGE_LIMITS = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp']
}
