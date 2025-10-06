interface CurrencyData {
  value: number;
  updatedAt: Date;
}

export interface Credit {
  value: number;
  updatedAt: Date;
}

export interface UserMarker {
  id: string;
  lat: number;
  lng: number;
  type: string;
  createdAt: Date;
}

export interface UserData {
  displayName: string;
  credits: Credit;
  currency: CurrencyData;
  email: string;
  photoURL: string;
  userMarkers?: UserMarker[];
}
