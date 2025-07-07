import React, { useState, useEffect } from 'react';
import {
  ScrollView, View, Text, StyleSheet, TextInput,
  Button, Alert, Image, Switch
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createPlace, uploadPlaceImages } from '../services/placeService';
import { RootStackParamList } from '../navigation/AppNavigator';
import { useAuth } from '../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'AddPlace'>;
type RouteParams = RouteProp<RootStackParamList, 'AddPlace'>;

export default function AddPlaceScreen() {
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<RouteParams>();
  const { user } = useAuth();

  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [precio, setPrecio] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [personas, setPersonas] = useState('');
  const [habitaciones, setHabitaciones] = useState('');
  const [camas, setCamas] = useState('');
  const [banos, setBanos] = useState('');
  const [wifi, setWifi] = useState(false);
  const [parqueo, setParqueo] = useState('');
  const [costoLimpieza, setCostoLimpieza] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [imagenes, setImagenes] = useState<string[]>([]);

  useEffect(() => {
    if (route.params?.lat !== undefined) setLatitud(String(route.params.lat));
    if (route.params?.lng !== undefined) setLongitud(String(route.params.lng));
  }, [route.params?.lat, route.params?.lng]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 1,
    });

    if (!result.canceled) {
      const uris = result.assets.map(asset => asset.uri);
      setImagenes(prev => [...prev, ...uris]);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert('Error', 'No hay usuario autenticado.');
      return;
    }

    if (!nombre || !precio || !ciudad || !latitud || !longitud) {
      Alert.alert('Campos requeridos', 'Completa nombre, precio, ciudad y ubicación en el mapa.');
      return;
    }

    try {
      const data = {
        nombre: nombre.trim(),
        descripcion: descripcion.trim(),
        precioNoche: precio.trim(),
        ciudad: ciudad.trim(),
        cantPersonas: parseInt(personas) || 0,
        cantHabitaciones: parseInt(habitaciones) || 0,
        cantCamas: parseInt(camas) || 0,
        cantBanios: parseInt(banos) || 0,
        tieneWifi: wifi ? 1 : 0,
        cantVehiculosParqueo: parseInt(parqueo) || 0,
        costoLimpieza: costoLimpieza.trim(),
        latitud: latitud.trim(),
        longitud: longitud.trim(),
        arrendatario_id: user.id
      };

      const nuevoLugar = await createPlace(data);

      if (imagenes.length > 0) {
        await uploadPlaceImages(nuevoLugar.id, imagenes);
      }

      Alert.alert('✅ Lugar creado exitosamente');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (err: any) {
      console.error('❌ Error al crear lugar:', err?.response?.data || err.message);
      Alert.alert('Error', 'No se pudo crear el lugar. Verifica los campos o intenta más tarde.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Agregar Nuevo Lugar</Text>

      <TextInput placeholder="Nombre" style={styles.input} value={nombre} onChangeText={setNombre} />
      <TextInput placeholder="Descripción" style={[styles.input, styles.textarea]} value={descripcion} onChangeText={setDescripcion} multiline />
      <TextInput placeholder="Precio por noche" style={styles.input} value={precio} onChangeText={setPrecio} keyboardType="numeric" />
      <TextInput placeholder="Ciudad" style={styles.input} value={ciudad} onChangeText={setCiudad} />
      <TextInput placeholder="Personas" style={styles.input} value={personas} onChangeText={setPersonas} keyboardType="numeric" />
      <TextInput placeholder="Habitaciones" style={styles.input} value={habitaciones} onChangeText={setHabitaciones} keyboardType="numeric" />
      <TextInput placeholder="Camas" style={styles.input} value={camas} onChangeText={setCamas} keyboardType="numeric" />
      <TextInput placeholder="Baños" style={styles.input} value={banos} onChangeText={setBanos} keyboardType="numeric" />

      <View style={styles.switchContainer}>
        <Text style={styles.label}>¿Tiene Wi-Fi?</Text>
        <Switch value={wifi} onValueChange={setWifi} />
      </View>

      <TextInput placeholder="Vehículos Parqueo" style={styles.input} value={parqueo} onChangeText={setParqueo} keyboardType="numeric" />
      <TextInput placeholder="Costo Limpieza" style={styles.input} value={costoLimpieza} onChangeText={setCostoLimpieza} keyboardType="numeric" />

      <View style={styles.buttonContainer}>
        <Button
          title="Seleccionar ubicación en el mapa"
          onPress={() =>
            navigation.navigate('MapSelect', {
              initialLat: latitud ? parseFloat(latitud) : -17.7833,
              initialLng: longitud ? parseFloat(longitud) : -63.1821,
              returnTo: 'AddPlace'
            })
          }
          color="#28a745"
        />
      </View>

      {latitud && longitud && (
        <Text style={{ marginTop: 10 }}>
           Ubicación: {latitud}, {longitud}
        </Text>
      )}

      <View style={styles.buttonContainer}>
        <Button title="Elegir Imágenes" onPress={pickImage} color="#6c757d" />
      </View>

      <ScrollView horizontal style={{ marginVertical: 10 }}>
        {imagenes.map((uri, idx) => (
          <Image key={idx} source={{ uri }} style={styles.image} />
        ))}
      </ScrollView>

      <View style={styles.buttonContainer}>
        <Button title="Guardar Lugar" onPress={handleSubmit} color="#007BFF" />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, padding: 20, backgroundColor: '#fff' },
  title: { fontSize: 26, fontWeight: 'bold', marginBottom: 20 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 12, marginBottom: 15, borderRadius: 8 },
  textarea: { height: 80 },
  buttonContainer: { marginVertical: 8 },
  image: { width: 80, height: 80, marginRight: 8, borderRadius: 8 },
  switchContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  label: { fontSize: 16, marginRight: 10 }
});
