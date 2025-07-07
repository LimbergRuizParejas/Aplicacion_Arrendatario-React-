import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthProvider, useAuth } from './src/context/AuthContext';

import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import AddPlaceScreen from './src/screens/AddPlaceScreen';
import EditPlaceScreen from './src/screens/EditPlaceScreen';
import ReservationsScreen from './src/screens/ReservationsScreen';
import MapSelectScreen from './src/screens/MapSelectScreen';

// ✅ Tipado explícito para las rutas
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

// ✅ Stack que responde dinámicamente según autenticación
function AppNavigator() {
  const { user } = useAuth();

  return (
    <Stack.Navigator
      initialRouteName={user ? 'Home' : 'Login'}
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
      {!user ? (
        <>
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
        </>
      ) : (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Inicio' }}
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
        </>
      )}
    </Stack.Navigator>
  );
}

// ✅ App envuelta con el proveedor de contexto de autenticación
export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </AuthProvider>
  );
}
