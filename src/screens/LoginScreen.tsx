import React, { useState } from 'react';
import {
  View, Text, TextInput, Button,
  StyleSheet, Alert, Image
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';
import { useAuth } from '../context/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export default function LoginScreen({ navigation }: Props) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Completa todos los campos');
      return;
    }
    try {
      console.log('Intentando login con:', email);
      await login(email, password);
      Alert.alert('✅ Éxito', 'Inicio de sesión correcto');
      navigation.reset({
        index: 0,
        routes: [{ name: 'Home' }],
      });
    } catch (error) {
      console.error('❌ Error en login:', error);
      Alert.alert('Error', 'Credenciales inválidas o error del servidor');
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../../assets/casa.png')} // pon tu logo aquí
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Bienvenido</Text>
      <Text style={styles.subtitle}>Inicia sesión para continuar</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="next"
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="done"
      />

      <View style={styles.buttonContainer}>
        <Button title="Iniciar Sesión" onPress={handleLogin} color="#28a745" />
      </View>
      <View style={styles.spacing} />
      <Button
        title="¿No tienes cuenta? Regístrate"
        onPress={() => navigation.navigate('Register')}
        color="#007BFF"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    padding: 20, backgroundColor: '#f9f9f9'
  },
  logo: {
    width: 120, height: 120, marginBottom: 20
  },
  title: {
    fontSize: 28, fontWeight: 'bold',
    marginBottom: 5, textAlign: 'center', color: '#007BFF'
  },
  subtitle: {
    fontSize: 16, color: '#666', marginBottom: 30, textAlign: 'center'
  },
  input: {
    width: '100%',
    borderWidth: 1, borderColor: '#ccc',
    padding: 12, marginBottom: 15, borderRadius: 8,
    backgroundColor: '#fff', fontSize: 16
  },
  buttonContainer: {
    width: '100%', marginTop: 10
  },
  spacing: { height: 15 },
});
