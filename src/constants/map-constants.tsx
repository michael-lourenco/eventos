// src/constants/map-constants.ts

import { ProblemCategory, ProblemType } from "@/components/map/types/map"

export type TProblemType = keyof typeof PROBLEM_TYPES
export type TProblemSubcategory =
  keyof (typeof PROBLEM_TYPES)[keyof typeof PROBLEM_TYPES]["subcategories"]

export const PROBLEM_TYPES = {
  POLICIA: {
    label: "Polícia",
    icon: "policia.svg",
    subcategories: {
      POLICIA_SUBCATEGORY: {
        label: "Polícia",
        icon: "policia.svg",
      },
      BAFOMETRO: {
        label: "Bafômetro",
        icon: "bafometro.svg",
      },
      TIROTEIO: {
        label: "Tiroteio",
        icon: "tiroteio.svg",
      },
      BLITZ: {
        label: "Blitz",
        icon: "blitz.svg",
      },
      SOM_ALTO: {
        label: "Som alto",
        icon: "som-alto.svg",
      },
    },
  },
  INFRAESTRUTURA: {
    label: "Infraestrutura",
    icon: "iluminacao.svg",
    subcategories: {
      INFRAESTRUTURA_SUBCATEGORY: {
        label: "Infraestrutura",
        icon: "iluminacao.svg",
      },
      INFRAESTRUTURA_ILUMINACAO_PUBLICA: {
        label: "Iluminação Pública",
        icon: "iluminacao-publica.svg",
      },
      INFRAESTRUTURA_SEMAFORO: {
        label: "Semáforo",
        icon: "semaforo.svg",
      },
      INFRAESTRUTURA_PLACA_QUEBRADA: {
        label: "Placa Quebrada",
        icon: "placa-quebrada.svg",
      },
      INFRAESTRUTURA_MATO_ALTO: {
        label: "Mato Alto",
        icon: "mato-alto.svg",
      },
    },
  },
  PISTA: {
    label: "Em via",
    icon: "pista.svg",
    subcategories: {
      PISTA_SUBCATEGORY: {
        label: "Em via",
        icon: "pista.svg",
      },
      PISTA_BURACO: {
        label: "Buraco na via",
        icon: "pista-buraco.svg",
      },
      PISTA_OBJETO: {
        label: "Objeto na via",
        icon: "pista-objeto.svg",
      },
      PISTA_OLEO: {
        label: "Óleo na via",
        icon: "pista-oleo.svg",
      },
      PISTA_ARVORE: {
        label: "Árvore na via",
        icon: "pista-arvore.svg",
      },
      PISTA_ALERTA: {
        label: "Alerta na via",
        icon: "pista-alerta.svg",
      },
      PISTA_POSTE: {
        label: "Queda de poste",
        icon: "pista-poste.svg",
      },
      PISTA_VEICULO_ABANDONADO: {
        label: "Veículo abandonado",
        icon: "pista-veiculo-abandonado.svg",
      },
    },
  },
  AGUA: {
    label: "Água",
    icon: "agua.svg",
    subcategories: {
      AGUA_SUBCATEGORY: {
        label: "Água",
        icon: "agua.svg",
        iconUrl: "fixed/agua.svg",
        iconRetinaUrl: "fixed/agua.svg",
      },
      AGUA_BUEIRO_ABERTO: {
        label: "Bueiro aberto",
        icon: "agua-bueiro-aberto.svg",
      },
      AGUA_BOEIRO_VAZAMENTO: {
        label: "Bueiro vazando",
        icon: "agua-bueiro-vazamento.svg",
      },
      AGUA_CANO_VAZAMENTO: {
        label: "Cano vazando",
        icon: "agua-cano-vazamento.svg",
      },
      AGUA_BOEIRO_ALERTA: {
        label: "Alerta bueiro",
        icon: "agua-bueiro-alerta.svg",
      },
      AGUA_ENCHENTE: {
        label: "Enchente",
        icon: "agua-enchente.svg",
      },
      AGUA_PISTA: {
        label: "Água na pista",
        icon: "agua-pista-alagamento.svg",
      },
    },
  },
  FOGO: {
    label: "Fogo",
    icon: "fogo.svg",
    subcategories: {
      FOGO_SUBCATEGORY: {
        label: "Fogo",
        icon: "fogo.svg",
      },
      FOGO_VEICULO: {
        label: "Veículo pegando fogo",
        icon: "fogo-veiculo.svg",
      },
      FOGO_CASA: {
        label: "Casa pegando fogo",
        icon: "fogo-casa.svg",
      },
      FOGO_ARVORE: {
        label: "Árvore pegando fogo",
        icon: "fogo-arvore.svg",
      },
    },
  },
} as const

export const PROBLEM_CATEGORIES: ProblemCategory[] = Object.entries(
  PROBLEM_TYPES,
).map(([key, value]) => ({
  id: key,
  type: key as unknown as ProblemType,
  label: value.label,
  icon: value.icon,
  bgColor: "bg-blue-100",
  mapIcon: {
    iconUrl: value.icon,
    iconRetinaUrl: value.icon,
    shadowUrl: "sombra.svg",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41],
  },
  subcategories: Object.entries(value.subcategories).map(
    ([key, subcategory]) => ({
      id: key,
      type: key as any,
      label: subcategory.label,
      icon: subcategory.icon,
      iconUrl: subcategory.icon ?? value.icon,
      iconRetinaUrl: subcategory.icon ?? value.icon,
      mapIcon: {
        iconUrl: subcategory.icon ?? value.icon,
        iconRetinaUrl: subcategory.icon ?? value.icon,
        shadowUrl: "sombra.svg",
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41],
      },
    }),
  ),
}))

export const DEFAULT_LOCATION: [number, number] = [-23.5902, -48.0338]
export const DEFAULT_ZOOM = 16
export const LOCAL_STORAGE_KEY = "mapProblems"
