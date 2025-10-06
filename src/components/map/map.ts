import { PROBLEM_TYPES } from "@/constants/map-constants"

export const getProblemLabel = (type: string): string => {
  switch (type) {
    case PROBLEM_TYPES.AGUA.label:
      return "Alerta"
    default:
      return "Desconhecido"
  }
}

export const formatMarkerDate = (createdAt: Date | { seconds: number } | string | number): Date => {
  if (createdAt instanceof Date) {
    return createdAt
  } else if (createdAt && typeof createdAt === "object" && "seconds" in createdAt) {
    // Handle Firestore Timestamp
    return new Date(createdAt.seconds * 1000)
  } else {
    return new Date(createdAt)
  }
}

interface Marker {
  createdAt: Date | { seconds: number }
}

export const sortMarkersByDate = (markers: Marker[]) => {
  return [...markers].sort((a, b) => {
    const dateA = formatMarkerDate(a.createdAt)
    const dateB = formatMarkerDate(b.createdAt)
    return dateB.getTime() - dateA.getTime()
  })
}
