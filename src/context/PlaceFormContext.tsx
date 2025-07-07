// src/context/PlaceFormContext.tsx
import React, { createContext, useContext, useState } from 'react';

export type PlaceFormData = {
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
  imagenes: string[];
};

const defaultData: PlaceFormData = {
  nombre: '', descripcion: '', precio: '', ciudad: '',
  personas: '', habitaciones: '', camas: '', banos: '',
  wifi: false, parqueo: '', costoLimpieza: '', imagenes: []
};

const PlaceFormContext = createContext<{
  data: PlaceFormData;
  setData: (data: PlaceFormData) => void;
}>({
  data: defaultData,
  setData: () => {},
});

export const PlaceFormProvider = ({ children }: { children: React.ReactNode }) => {
  const [data, setData] = useState<PlaceFormData>(defaultData);
  return (
    <PlaceFormContext.Provider value={{ data, setData }}>
      {children}
    </PlaceFormContext.Provider>
  );
};

export const usePlaceForm = () => useContext(PlaceFormContext);
