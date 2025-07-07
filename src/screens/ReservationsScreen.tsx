import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getReservations } from '../services/placeService';
import { formatDate } from '../utils/helpers';

type Props = NativeStackScreenProps<RootStackParamList, 'Reservations'>;

interface Reservation {
  id: number;
  cliente: string;
  noches: number;
  fechaLlegada: string;
  fechaSalida: string;
  total: number;
  lugarNombre: string;
  imagen: string;
}

export default function ReservationsScreen({ route }: Props) {
  const { placeId } = route.params;

  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const calcularNoches = (inicio?: string, fin?: string): number => {
    if (!inicio || !fin) return 0;
    const start = new Date(inicio);
    const end = new Date(fin);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    const diffTime = end.getTime() - start.getTime();
    return Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
  };

  const loadReservations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getReservations(placeId);

      if (!Array.isArray(data)) {
        console.warn('⚠️ El backend no devolvió un array de reservas:', data);
        setReservations([]);
        return;
      }

      const formatted = data.map((r: any) => {
        // Fechas (seguridad con varios posibles nombres)
        const fechaInicio = r.fechaInicio || r.fecha_llegada || r.created_at || null;
        const fechaFin = r.fechaFin || r.fecha_salida || r.updated_at || null;

        // Nombre cliente
        const clienteNombre = r.usuario?.nombre_completo || r.cliente?.nombrecompleto || 'Desconocido';

        // Total pago (varios posibles nombres)
        const totalPago = r.total ?? r.precioTotal ?? 0;

        // Nombre y foto del lugar
        const lugarNombre = r.lugar?.nombre ?? 'Nombre no disponible';
        const lugarImagen = (r.lugar?.fotos && r.lugar.fotos.length > 0)
          ? r.lugar.fotos[0].url
          : 'https://via.placeholder.com/300x200?text=Sin+Imagen';

        return {
          id: r.id,
          cliente: clienteNombre,
          noches: calcularNoches(fechaInicio, fechaFin),
          fechaLlegada: fechaInicio ? formatDate(fechaInicio) : 'Fecha no disponible',
          fechaSalida: fechaFin ? formatDate(fechaFin) : 'Fecha no disponible',
          total: totalPago,
          lugarNombre,
          imagen: lugarImagen,
        };
      });

      setReservations(formatted);
    } catch (err) {
      console.error('❌ Error al cargar reservas:', err);
      setReservations([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [placeId]);

  useEffect(() => {
    loadReservations();
  }, [loadReservations]);

  const onRefresh = () => {
    setRefreshing(true);
    loadReservations();
  };

  const renderItem = ({ item }: { item: Reservation }) => (
    <View style={styles.card}>
      <Image source={{ uri: item.imagen }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.lugarNombre}>{item.lugarNombre}</Text>
        <Text style={styles.client}>{item.cliente}</Text>
        <Text style={styles.details}>
          {item.noches} {item.noches === 1 ? 'noche' : 'noches'} — {item.fechaLlegada} a {item.fechaSalida}
        </Text>
        <Text style={styles.total}>Total: Bs.{item.total}</Text>
      </View>
    </View>
  );

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007BFF" />
        <Text style={styles.loadingText}>Cargando reservas...</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={reservations}
      keyExtractor={(item) => item.id.toString()}
      renderItem={renderItem}
      ListHeaderComponent={
        <>
          <Text style={styles.title}>Reservas del Lugar</Text>
          <Text style={styles.subtitle}>ID del lugar: {placeId}</Text>
          {reservations.length === 0 && (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No hay reservas registradas para este lugar.</Text>
            </View>
          )}
        </>
      }
      contentContainerStyle={{ padding: 20, flexGrow: 1 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      ListEmptyComponent={null}
    />
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
  },
  loadingText: {
    marginTop: 10, fontSize: 16, color: '#555',
  },
  title: {
    fontSize: 26, fontWeight: 'bold', marginBottom: 10,
  },
  subtitle: {
    fontSize: 18, color: '#555', marginBottom: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f5f5f5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    alignItems: 'center',
    elevation: 2,
  },
  image: {
    width: 80,
    height: 60,
    borderRadius: 4,
    marginRight: 15,
    backgroundColor: '#ddd',
  },
  info: {
    flex: 1,
  },
  lugarNombre: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  client: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 4,
  },
  details: {
    fontSize: 14,
    color: '#555',
    marginTop: 2,
  },
  total: {
    fontSize: 15,
    color: '#007BFF',
    marginTop: 5,
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#777',
  },
});
