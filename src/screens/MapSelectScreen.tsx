import React, { useState } from 'react';
import { View, StyleSheet, Text, Image, TouchableOpacity, Alert } from 'react-native';
import MapView, { Marker, MapPressEvent } from 'react-native-maps';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'MapSelect'>;

export default function MapSelectScreen({ route, navigation }: Props) {
  const { initialLat, initialLng, returnTo, placeId } = route.params;

  const [selectedLocation, setSelectedLocation] = useState({
    latitude: initialLat,
    longitude: initialLng,
  });

  const handleSelectLocation = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setSelectedLocation({ latitude, longitude });
    console.log(`📍 Ubicación seleccionada: ${latitude}, ${longitude}`);
  };

  const handleConfirm = () => {
    if (!selectedLocation) {
      Alert.alert('Selecciona una ubicación primero');
      return;
    }

    console.log('✅ Confirmando ubicación seleccionada:', selectedLocation);

    if (returnTo === 'AddPlace') {
      navigation.replace('AddPlace', {
        lat: selectedLocation.latitude,
        lng: selectedLocation.longitude,
      });
    } else if (returnTo === 'EditPlace' && placeId !== undefined) {
      navigation.replace('EditPlace', {
        id: placeId,
        lat: selectedLocation.latitude,
        lng: selectedLocation.longitude,
      });
    } else {
      Alert.alert('Error', 'No se pudo retornar a la pantalla anterior.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image
          source={require('../../assets/favicon.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Selecciona la ubicación</Text>
      </View>

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: initialLat,
          longitude: initialLng,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }}
        onPress={handleSelectLocation}
      >
        <Marker coordinate={selectedLocation} />
      </MapView>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleConfirm} style={styles.imageButton}>
          <Image
            source={require('../../assets/favicon.png')}
            style={styles.buttonImage}
            resizeMode="contain"
          />
          <Text style={styles.buttonText}>Confirmar Ubicación</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const PRIMARY_COLOR = '#5e60ce';

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 5,
  },
  logo: {
    width: 140,
    height: 60,
    marginBottom: 5,
  },
  title: {
    fontSize: 18,
    color: PRIMARY_COLOR,
    fontWeight: 'bold',
  },
  map: {
    flex: 1,
    borderTopWidth: 1,
    borderColor: '#ccc',
  },
  buttonContainer: {
    backgroundColor: PRIMARY_COLOR,
    alignItems: 'center',
    padding: 15,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 8,
  },
  imageButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonImage: {
    width: 32,
    height: 32,
    marginRight: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});
