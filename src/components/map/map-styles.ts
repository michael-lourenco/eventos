"use client";

/**
 * Adiciona estilos para o botão de like
 */
export const addLikeStyles = () => {
  if (document.querySelector('style[data-id="like-styles"]')) return;

  const style = document.createElement("style");
  style.dataset.id = "like-styles";
  style.textContent = `
    .marker-popup .like-button {
      background-color: #f0f0f0;
      border: 1px solid #ddd;
      border-radius: 4px;
      padding: 5px 10px;
      margin-top: 10px;
      cursor: pointer;
      transition: background-color 0.3s;
    }
    .marker-popup .like-button:hover {
      background-color: #e0e0e0;
    }
    .marker-popup .like-count {
      margin-left: 5px;
      font-weight: bold;
    }
  `;
  document.head.appendChild(style);
};

/**
 * Adiciona o CSS do Leaflet ao documento
 */
export const addLeafletCSS = () => {
  if (document.querySelector('link[href*="leaflet.css"]')) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
  link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=";
  link.crossOrigin = "";
  document.head.appendChild(link);
};

/**
 * Função para configurar o evento de centralização no usuário
 */
export const setupCenterOnUserEvent = (
  mapInstanceRef: React.MutableRefObject<any>,
  userLocationMarkerRef: React.MutableRefObject<any>,
  defaultZoom: number
) => {
  const handleCenterOnUser = (e: CustomEvent) => {
    if (mapInstanceRef.current && userLocationMarkerRef.current) {
      const latlng = userLocationMarkerRef.current.getLatLng();
      mapInstanceRef.current.setView([latlng.lat, latlng.lng], defaultZoom);
    }
  };

  document.addEventListener(
    "centerOnUser",
    handleCenterOnUser as EventListener
  );

  return () => {
    document.removeEventListener(
      "centerOnUser",
      handleCenterOnUser as EventListener
    );
  };
};

/**
 * Função para configurar o evento de redimensionamento da janela
 */
export const setupResizeHandler = (mapInstanceRef: React.MutableRefObject<any>) => {
  const handleResize = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.invalidateSize();
    }
  };

  window.addEventListener("resize", handleResize);

  return () => {
    window.removeEventListener("resize", handleResize);
  };
};
