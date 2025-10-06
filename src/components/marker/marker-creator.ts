// marker-creator.ts
"use client";
import { getProblemLabel } from "@/components/map/map";
import type { Marker } from "@/components/marker/types/marker";
import { addMarker, dbFirestore } from "@/services/firebase/FirebaseService";

/**
 * Cria e salva um novo marcador no mapa e no Firebase
 */
export const createAndSaveMarker = async ({
  markerPosition,
  selectedProblemType,
  iconsRef,
  mapInstanceRef,
  leafletRef,
  setMarkers
}: {
  markerPosition: any;
  selectedProblemType: string;
  iconsRef: React.MutableRefObject<Record<string, any>>;
  mapInstanceRef: React.MutableRefObject<any>;
  leafletRef: React.MutableRefObject<any>;
  setMarkers: React.Dispatch<React.SetStateAction<Marker[]>>;
}) => {
  try {
    // Obter informações do usuário atual do localStorage
    const userDataString = localStorage.getItem("user");
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const userEmail = userData?.email || "Usuário anônimo";

    // Criar objeto de marcador para salvar
    const markerId = `marker_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;
    const newMarkerData: Marker = {
      id: markerId,
      lat: markerPosition.lat,
      lng: markerPosition.lng,
      type: selectedProblemType,
      userEmail,
      createdAt: new Date(),
      likedBy: [],
      currentStatus: "reportado"
    };

    // Adicionar ao Firebase usando o FirebaseService
    await addMarker(dbFirestore, newMarkerData);
    console.log("Marcador salvo com sucesso:", newMarkerData);

    // Atualizar o estado local de marcadores
    setMarkers(prev => [...prev, newMarkerData]);

    // Adicionar marker no mapa com o ícone correto (mas manter o user location marker)
    const L = leafletRef.current;
    const newMarker = L.marker([markerPosition.lat, markerPosition.lng], {
      icon: iconsRef.current[selectedProblemType],
    }).addTo(mapInstanceRef.current);

    // Criar popup personalizado com botão de like
    const popupContent = document.createElement('div');
    popupContent.classList.add('marker-popup');
    popupContent.innerHTML = `
      <strong>Problema: ${selectedProblemType}</strong><br>
      Reportado em: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}<br>
      Por: ${userEmail}<br>
      <button class="like-button">
        Curtir 
        <span class="like-count">(0)</span>
      </button>
    `;

    newMarker
      .bindPopup(popupContent)
      .openPopup();

    return newMarker;
  } catch (error) {
    console.error("Erro ao salvar marcador no Firebase:", error);
    return null;
  }
};
