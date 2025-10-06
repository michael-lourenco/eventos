// src/types/map.ts
import { PROBLEM_TYPES } from "@/constants/map-constants";
import type React from "react";

// Reuse your existing type interfaces
export interface MapIcon {
  iconUrl: string;
  iconRetinaUrl: string;
  shadowUrl: string;
  iconSize: [number, number];
  iconAnchor: [number, number];
  popupAnchor: [number, number];
  shadowSize: [number, number];
  className?: string;
}

// Define types for the map-related objects
export interface LeafletMap {
  setView: (center: [number, number], zoom: number) => void;
  // Add other methods you use
}

export interface LeafletMarker {
  setLatLng: (latLng: [number, number]) => void;
  // Add other methods you use
}

export interface LeafletInstance {
  map: (element: HTMLElement) => LeafletMap;
  marker: (latLng: [number, number]) => LeafletMarker;
  // Add other properties you use
}

export interface MapRefs {
  mapRef: React.RefObject<HTMLDivElement | null>;
  mapInstanceRef: React.RefObject<LeafletMap>;
  currentMarkerRef: React.RefObject<LeafletMarker>;
  leafletRef: React.RefObject<LeafletInstance>;
  iconsRef: React.RefObject<Record<string, MapIcon> | null>;
  mapInitializedRef: React.RefObject<boolean>;
}

export interface MapContentProps {
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  selectedProblemType: string | null;
  userConfirmedProblem: boolean;
  resetConfirmation: () => void;
}

// Add the new type definitions for the problem categories system
export type ProblemType = (typeof PROBLEM_TYPES)[keyof typeof PROBLEM_TYPES]
export interface ProblemCategory {
  id: string;
  type: ProblemType;
  label: string;
  icon: string;
  bgColor: string;
  mapIcon?: MapIcon;
  subcategories?: ProblemSubcategory[];
}

export interface ProblemSubcategory {
  id: string;
  type: ProblemType;
  label: string;
  icon: string;
  mapIcon?: MapIcon;
}

// Define a more specific type for Leaflet
export interface LeafletStatic {
  Icon: new (options: MapIcon) => LeafletIcon;
}

// Define the LeafletIcon interface
export interface LeafletIcon {
  options: MapIcon;
  createIcon: () => HTMLElement;
  createShadow: () => HTMLElement;
}

// Interface for marker style configuration
export interface MarkerStyle {
  filter?: string;
  animation?: string;
}

export interface MarkerStylesMap {
  [key: string]: string;
}