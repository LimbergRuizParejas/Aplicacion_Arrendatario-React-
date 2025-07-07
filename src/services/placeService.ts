import api from '../api/api';

// === Tipos ===
export interface Place {
  id: number;
  nombre: string;
  descripcion: string;
  precioNoche: string;
  ciudad: string;
  cantPersonas: number;
  cantHabitaciones: number;
  cantCamas: number;
  cantBanios: number;
  tieneWifi: number;
  cantVehiculosParqueo: number;
  costoLimpieza: string;
  latitud: string;
  longitud: string;
  fotos: { url: string }[];
  arrendatario_id: number;
}

export interface Reserva {
  id: number;
  fechaInicio: string;
  fechaFin: string;
  precioNoches: string;
  precioLimpieza: string;
  precioServicio: string;
  precioTotal: string;
  cliente: {
    id: number;
    nombrecompleto: string;
    email: string;
    telefono: string;
  };
  lugar?: Place;  
}


export const getPlaces = async (arrendatarioId: number): Promise<Place[]> => {
  try {
    console.log(`🌍 Solicitando lugares del arrendatario ID: ${arrendatarioId}`);
    const { data } = await api.get(`/lugares/arrendatario/${arrendatarioId}`);

    if (!Array.isArray(data)) {
      console.warn('⚠️ La API devolvió algo distinto a un array:', data);
      return [];
    }

    console.log(`✅ Lugares cargados: ${data.length}`);
    return data;
  } catch (error: any) {
    console.error('❌ Error al obtener lugares:', error?.response?.data || error.message);
    throw error;
  }
};

/**
 * 🔍 Obtener un lugar específico por ID
 * GET /lugares/:id
 */
export const getPlaceById = async (id: number): Promise<Place> => {
  try {
    console.log(`🔍 Obteniendo lugar ID: ${id}`);
    const { data } = await api.get(`/lugares/${id}`);
    console.log('✅ Lugar obtenido:', data);
    return data;
  } catch (error: any) {
    console.error(`❌ Error al obtener lugar ${id}:`, error?.response?.data || error.message);
    throw error;
  }
};


export const createPlace = async (placeData: Partial<Place>): Promise<Place> => {
  try {
    console.log('📝 Creando lugar con:', placeData);
    const { data } = await api.post('/lugares', placeData);
    console.log('✅ Lugar creado:', data);
    return data;
  } catch (error: any) {
    console.error('❌ Error al crear lugar:', error?.response?.data || error.message);
    throw error;
  }
};


export const updatePlace = async (id: number, placeData: Partial<Place>): Promise<Place> => {
  try {
    console.log(`✏️ Actualizando lugar ID ${id}`, placeData);
    const { data } = await api.put(`/lugares/${id}`, placeData);
    console.log('✅ Lugar actualizado:', data);
    return data;
  } catch (error: any) {
    console.error(`❌ Error al actualizar lugar ${id}:`, error?.response?.data || error.message);
    throw error;
  }
};


export const uploadPlaceImages = async (placeId: number, localUris: string[]): Promise<void> => {
  try {
    console.log(`📤 Subiendo ${localUris.length} imágenes para lugar ID ${placeId}`);
    const formData = new FormData();

    localUris.forEach((localUri) => {
      const filename = localUri.split('/').pop() ?? `image_${Date.now()}.jpg`;
      const match = /\.(\w+)$/.exec(filename);
      const type = match ? `image/${match[1]}` : `image`;

      formData.append('foto[]', {
        uri: localUri,
        name: filename,
        type,
      } as any);
    });

    await api.post(`/lugares/${placeId}/foto`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });

    console.log('✅ Imágenes subidas correctamente');
  } catch (error: any) {
    console.error(`❌ Error al subir imágenes para lugar ${placeId}:`, error?.response?.data || error.message);
    throw error;
  }
};

export const getReservations = async (placeId: number): Promise<Reserva[]> => {
  try {
    console.log(`📅 Obteniendo reservas para lugar ID: ${placeId}`);
    const { data } = await api.get(`/reservas/lugar/${placeId}`);

    // El backend puede devolver array o un objeto con array en data.reservas
    let reservas: any[] = [];

    if (Array.isArray(data)) {
      reservas = data;
    } else if (Array.isArray(data.reservas)) {
      reservas = data.reservas;
    } else {
      console.warn('⚠️ El backend no devolvió reservas en formato esperado:', data);
      return [];
    }

    console.log(`✅ ${reservas.length} reservas obtenidas`);
    return reservas;
  } catch (error: any) {
    console.error(`❌ Error al obtener reservas para lugar ${placeId}:`, error?.response?.data || error.message);
    throw error;
  }
};
