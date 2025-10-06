import type { Marker } from "@/components/marker/types/marker"
import { dbFirestore, updateMarkerLikes, updateMarkerResolved } from "@/services/firebase/FirebaseService"
import { getDistance } from "@/utils/distance"
import { toast } from "sonner"

// Função para obter o email do usuário atual
export const getCurrentUserEmail = () => {
  const userDataString = localStorage.getItem("user")
  const userData = userDataString ? JSON.parse(userDataString) : null
  return userData?.email || null
}

// Função para verificar se o marcador tem likes e deve mostrar o botão de resolução
export const shouldShowResolvedButton = (marker: Marker): boolean => {
  // Verifica explicitamente se likedBy existe e tem pelo menos 1 elemento
  return Boolean(marker.likedBy && marker.likedBy.length >= 1)
}

// Função para manipular a ação de curtir um marcador
export const handleLikeMarker = async (
  marker: Marker,
  userLocationMarker: any,
  markers: Marker[],
  setMarkers: (markers: Marker[]) => void,
) => {
  try {
    const userEmail = getCurrentUserEmail()


    if (!userEmail) {
      toast.error("Por favor, faça login para curtir um marcador.")
      return
    }

    // Verificar distância do usuário ao marcador
    if (!userLocationMarker) {
      toast.error("Localização do usuário não disponível.")
      return
    }

    const userLocation = userLocationMarker.getLatLng()
    const markerLocation = { lat: marker.lat, lng: marker.lng }
    const distance = getDistance(userLocation, markerLocation)

    // Verificar se o usuário está dentro de 100 metros
    if (distance > 100) {
      toast("Você precisa estar a até 100 metros do marcador para curtir.", { icon: "📍" })
      return
    }

    // Verificar se o usuário está tentando curtir seu próprio marcador
    if (marker.userEmail === userEmail) {
      toast("Você não pode curtir seu próprio marcador.", { icon: "🚫" })
      return
    }

    // Verificar se o usuário já curtiu o marcador
    if (marker.likedBy?.includes(userEmail)) {
      toast("Você já curtiu este marcador.", { icon: "👍" })
      return
    }

    // Atualizar likes no Firebase
    await updateMarkerLikes(dbFirestore, marker.id, userEmail)

    await updateMarkerResolved(dbFirestore, marker.id, userEmail)

    // Atualizar estado local dos marcadores
    const updatedMarkers = markers.map((m) =>
      m.id === marker.id ? { ...m, likedBy: m.likedBy ? [...m.likedBy, userEmail] : [userEmail] } : m,
    )
    setMarkers(updatedMarkers)

    return true // Retorna true se o like foi bem-sucedido
  } catch (error) {
    console.error("Erro ao curtir marcador:", error)
    toast.error("Não foi possível curtir o marcador. Tente novamente.")
    return false
  }
}


export const handleResolvedMarker = async (
  marker: Marker,
  userLocationMarker: any,
  markers: Marker[],
  setMarkers: (markers: Marker[]) => void,
) => {
  try {
    const userEmail = getCurrentUserEmail()


    if (!userEmail) {
      toast.error("Por favor, faça login para confirmar resolução.")
      return
    }

    // Verificar distância do usuário ao marcador
    if (!userLocationMarker) {
      toast.error("Localização do usuário não disponível.")
      return
    }

    const userLocation = userLocationMarker.getLatLng()
    const markerLocation = { lat: marker.lat, lng: marker.lng }
    const distance = getDistance(userLocation, markerLocation)

    // Verificar se o usuário está dentro de 100 metros
    if (distance > 100) {
      toast("Você precisa estar a até 100 metros do marcador para confirmar.", { icon: "📍" })
      return
    }

    // Verificar se o usuário já confirmou resolução
    if (marker.resolvedBy?.includes(userEmail)) {
      toast("Você já confirmou que este problema foi solucionado.", { icon: "✅" })
      return
    }

    // Atualizar likes no Firebase
    await updateMarkerResolved(dbFirestore, marker.id, userEmail)

    // Atualizar estado local dos marcadores
    const updatedMarkers = markers.map((m) =>
      m.id === marker.id ? { ...m, resolvedBy: m.resolvedBy ? [...m.resolvedBy, userEmail] : [userEmail] } : m,
    )
    setMarkers(updatedMarkers)

    return true // Retorna true se o like foi bem-sucedido
  } catch (error) {
    console.error("Erro ao curtir marcador:", error)
    toast.error("Não foi possível confirmar resolução. Tente novamente.")
    return false
  }
}

// Função para converter timestamp para Date
export const convertToDate = (timestamp: any): Date => {
  if (timestamp instanceof Date) {
    return timestamp
  }

  if (timestamp && typeof timestamp === "object" && "seconds" in timestamp) {
    // Firestore Timestamp object
    return new Date(timestamp.seconds * 1000)
  }

  // Fallback para outros formatos de timestamp
  return new Date(timestamp)
}
