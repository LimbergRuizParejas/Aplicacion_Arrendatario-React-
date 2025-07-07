import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

interface User {
  id: number;
  email: string;
  nombrecompleto: string;
  token: string;
}

interface AuthContextProps {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const jsonValue = await AsyncStorage.getItem('@user');
        if (jsonValue) {
          const savedUser: User = JSON.parse(jsonValue);
          setUser(savedUser);
          console.log('✅ Usuario cargado desde storage:', savedUser);
        }
      } catch (error) {
        console.error('Error cargando usuario desde AsyncStorage', error);
      }
    };
    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await axios.post(
        'https://261d-200-87-196-6.ngrok-free.app/api/arrendatario/login',
        { email, password },
        {
          headers: {
            'ngrok-skip-browser-warning': 'true',
          },
        }
      );

      const userData: User = {
        id: response.data.id,
        email: response.data.email,
        nombrecompleto: response.data.nombrecompleto,
        token: response.data.token,
      };

      setUser(userData);
      await AsyncStorage.setItem('@user', JSON.stringify(userData));
      console.log('✅ Login exitoso y usuario guardado:', userData);
    } catch (error: any) {
      console.error('❌ Error en login', error);
      throw new Error('Credenciales inválidas o error del servidor');
    }
  };

  const logout = async () => {
    try {
      setUser(null);
      await AsyncStorage.removeItem('@user');
      console.log('👋 Sesión cerrada, storage limpiado');
    } catch (error) {
      console.error('Error al cerrar sesión', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};
