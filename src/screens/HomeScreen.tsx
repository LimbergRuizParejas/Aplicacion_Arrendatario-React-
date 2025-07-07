import React, { useEffect, useState, useCallback } from 'react';
import {
  View, Text, FlatList, Image, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, RefreshControl
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';
import { getPlaces, Place } from '../services/placeService';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;  //es como la comunicacion entre componentes

export default function HomeScreen({ navigation }: Props) {
  const { user, logout } = useAuth();
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadPlaces = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await getPlaces(user.id);
      setPlaces(data);
    } catch (err) {
      console.error('❌ Error cargando lugares:', err);
      Alert.alert('Error', 'No se pudieron cargar tus lugares. Intenta más tarde.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaces();
  }, [user]);

  const onRefresh = useCallback(async () => {
    if (!user) return;
    setRefreshing(true);
    try {
      const data = await getPlaces(user.id);
      setPlaces(data);
    } catch (err) {
      console.error('❌ Error al refrescar:', err);
    } finally {
      setRefreshing(false);
    }
  }, [user]);

  const renderItem = ({ item }: { item: Place }) => (
    <View style={styles.card}>
      <Image
        source={{ uri: item.fotos?.[0]?.url || 'https://via.placeholder.com/300x200?text=Sin+Imagen' }}
        style={styles.image}
      />
      <View style={styles.info}>
        <Text style={styles.name}>{item.nombre ?? 'Sin Nombre'}</Text>
        <Text style={styles.city}>{item.ciudad ?? 'Sin Ciudad'}</Text>
        <Text style={styles.price}>
          {item.precioNoche ? `Bs.${item.precioNoche} / noche` : 'Sin Precio'}
        </Text>

        <View style={styles.buttonGroup}>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('EditPlace', { id: item.id })}
          >
            <Text style={styles.actionText}>Editar Lugar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: '#6c757d' }]}
            onPress={() => navigation.navigate('Reservations', { placeId: item.id })}
          >
            <Text style={styles.actionText}>Ver Reservas</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={places}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#5e60ce']} />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Image
              source={require('../../assets/casa.png')}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.title}>Mis Lugares</Text>

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: '#28a745' }]}
                onPress={() => navigation.navigate('AddPlace', {})}
              >
                <Image source={require('../../assets/agregar-ubicacion.png')} style={styles.icon} />
                <Text style={styles.buttonText}>Agregar Lugar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.iconButton, { backgroundColor: '#dc3545' }]}
                onPress={async () => {
                  await logout();
                  navigation.reset({ index: 0, routes: [{ name: 'Login' }] });
                }}
              >
                <Image source={require('../../assets/favicon.png')} style={styles.icon} />
                <Text style={styles.buttonText}>Salir</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          loading ? null : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No tienes lugares registrados aún.</Text>
            </View>
          )
        }
      />

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#5e60ce" />
          <Text style={styles.loadingText}>Cargando tus lugares...</Text>
        </View>
      )}
    </View>
  );
}

const PRIMARY_COLOR = '#5e60ce';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { alignItems: 'center', marginTop: 20, marginBottom: 10 },
  logo: { width: 140, height: 60, marginBottom: 10 },
  title: { fontSize: 28, fontWeight: 'bold', color: PRIMARY_COLOR, marginBottom: 15 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '90%',
    marginTop: 10,
  },
  iconButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    elevation: 3,
  },
  icon: { width: 24, height: 24, marginRight: 8 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  card: {
    marginHorizontal: 20,
    marginBottom: 15,
    backgroundColor: '#f4f4f8',
    borderRadius: 12,
    overflow: 'hidden',
    elevation: 4,
  },
  image: { width: '100%', height: 180 },
  info: { padding: 15 },
  name: { fontSize: 18, fontWeight: 'bold', color: PRIMARY_COLOR },
  city: { fontSize: 14, color: '#555', marginTop: 4 },
  price: { fontSize: 16, color: PRIMARY_COLOR, marginTop: 6 },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  actionButton: {
    flex: 1,
    backgroundColor: PRIMARY_COLOR,
    padding: 10,
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  actionText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  emptyContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', marginTop: 50 },
  emptyText: { fontSize: 16, color: '#777' },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(255,255,255,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: { marginTop: 10, fontSize: 16, color: PRIMARY_COLOR },

reservasButton: {
  marginTop: 10,
  backgroundColor: '#007BFF',
  paddingVertical: 8,
  borderRadius: 6,
  alignItems: 'center',
},
reservasButtonText: {
  color: '#fff',
  fontWeight: 'bold',
  fontSize: 14,
},

});
