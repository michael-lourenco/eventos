import { MARKER_STYLES } from "@/components/marker/marker-styles";
import { useCallback } from "react";

export const useMarkerStyles = () => {
  return useCallback(() => {
    // Evita duplicação de estilos
    if (document.querySelector('style[data-id="marker-styles"]')) return;

    const style = document.createElement("style");
    style.dataset.id = "marker-styles";

    // Gera os estilos dinamicamente a partir do objeto MARKER_STYLES
    let styleContent = Object.entries(MARKER_STYLES)
      .map(([type, style]) => {
        // Para o marcador de localização do usuário, tratamos diferente
        if (type === 'userLocation') {
          return `.user-location-icon { ${style} }`;
        }
        return `.${type}-icon { ${style} }`;
      })
      .join('\n');

    // Adiciona a animação de pulse
    styleContent += `
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.6; }
        100% { opacity: 1; }
      }
    `;

    style.textContent = styleContent;
    document.head.appendChild(style);
  }, []);
};