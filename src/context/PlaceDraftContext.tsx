import React, { createContext, useContext, useState } from 'react';

type PlaceDraft = {
  nombre: string;
  descripcion: string;
  precio: string;
  ciudad: string;
  personas: string;
  habitaciones: string;
  camas: string;
  banos: string;
  wifi: boolean;
  parqueo: string;
  costoLimpieza: string;
  latitud: string;
  longitud: string;
  imagenes: string[];
};

const defaultDraft: PlaceDraft = {
  nombre: '',
  descripcion: '',
  precio: '',
  ciudad: '',
  personas: '',
  habitaciones: '',
  camas: '',
  banos: '',
  wifi: false,
  parqueo: '',
  costoLimpieza: '',
  latitud: '',
  longitud: '',
  imagenes: []
};

const PlaceDraftContext = createContext<{
  draft: PlaceDraft;
  setDraft: React.Dispatch<React.SetStateAction<PlaceDraft>>;
}>({
  draft: defaultDraft,
  setDraft: () => {}
});

export const usePlaceDraft = () => useContext(PlaceDraftContext);

export function PlaceDraftProvider({ children }: { children: React.ReactNode }) {
  const [draft, setDraft] = useState<PlaceDraft>(defaultDraft);

  return (
    <PlaceDraftContext.Provider value={{ draft, setDraft }}>
      {children}
    </PlaceDraftContext.Provider>
  );
}
