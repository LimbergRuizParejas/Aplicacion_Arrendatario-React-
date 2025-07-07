import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  Text,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { register } from '../services/authService';
import axios from 'axios';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/AppNavigator';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export default function RegisterScreen({ navigation }: Props) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [telefono, setTelefono] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!nombre || !email || !telefono || !password) {
      Alert.alert('Error', 'Por favor completa todos los campos');
      return;
    }

    const payload = {
      nombrecompleto: nombre,
      email,
      telefono,
      password,
    };

    console.log('📤 Enviando registro con:', payload);
    setLoading(true);

    try {
      const response = await register(payload);
      console.log('✅ Registro exitoso:', response);
      Alert.alert('¡Registro exitoso!', 'Ya puedes iniciar sesión.', [
        { text: 'Iniciar Sesión', onPress: () => navigation.replace('Login') }
      ]);

      // Limpiar campos
      setNombre('');
      setEmail('');
      setTelefono('');
      setPassword('');
    } catch (error: any) {
      if (axios.isAxiosError(error)) {
        console.error('❌ Error en registro (Axios):', error.response?.data || error.message);
        Alert.alert('Error', error.response?.data?.message || 'Error del servidor');
      } else {
        console.error('❌ Error inesperado:', error);
        Alert.alert('Error', 'Ocurrió un error inesperado');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Registro de Arrendatario</Text>

        <TextInput
          placeholder="Nombre Completo"
          value={nombre}
          onChangeText={setNombre}
          style={styles.input}
          autoCapitalize="words"
        />
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
        <TextInput
          placeholder="Teléfono"
          value={telefono}
          onChangeText={setTelefono}
          style={styles.input}
          keyboardType="phone-pad"
        />
        <TextInput
          placeholder="Contraseña"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          autoCapitalize="none"
          autoCorrect={false}
        />

        <Button
          title={loading ? 'Registrando...' : 'Registrarse'}
          onPress={handleRegister}
          color="#28a745"
          disabled={loading}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: '#007BFF',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
  },
});
