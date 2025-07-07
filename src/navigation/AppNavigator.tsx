import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';


import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import AddPlaceScreen from '../screens/AddPlaceScreen';
import EditPlaceScreen from '../screens/EditPlaceScreen';
import ReservationsScreen from '../screens/ReservationsScreen';
import MapSelectScreen from '../screens/MapSelectScreen';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  Register: undefined;
  AddPlace: { lat?: number; lng?: number };
  EditPlace: { id: number; lat?: number; lng?: number };
  Reservations: { placeId: number };
  MapSelect: {
    initialLat: number;
    initialLng: number;
    returnTo: 'AddPlace' | 'EditPlace';
    placeId?: number;
  };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerStyle: { backgroundColor: '#007BFF' },
        headerTintColor: '#fff',
        headerTitleAlign: 'center',
        headerTitleStyle: {
          fontWeight: 'bold',
          fontSize: 20,
        },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: 'Inicio' }}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ title: 'Iniciar Sesión' }}
      />
      <Stack.Screen
        name="Register"
        component={RegisterScreen}
        options={{ title: 'Registro' }}
      />
      <Stack.Screen
        name="AddPlace"
        component={AddPlaceScreen}
        options={{ title: 'Agregar Lugar' }}
      />
      <Stack.Screen
        name="EditPlace"
        component={EditPlaceScreen}
        options={{ title: 'Editar Lugar' }}
      />
      <Stack.Screen
        name="Reservations"
        component={ReservationsScreen}
        options={{ title: 'Reservas' }}
      />
      <Stack.Screen
        name="MapSelect"
        component={MapSelectScreen}
        options={{ title: 'Seleccionar en el Mapa' }}
      />
    </Stack.Navigator>
  );
}
