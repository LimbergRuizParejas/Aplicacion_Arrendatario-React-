import api from '../api/api';

export const login = async (email: string, password: string) => {
  try {
    console.log('Enviando login con:', { email, password });
    const response = await api.post('/arrendatario/login', { email, password });
    console.log('Respuesta login:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en login:', error);
    throw error;
  }
};

export const register = async (data: {
  nombrecompleto: string;
  email: string;
  telefono: string;
  password: string;
}) => {
  try {
    console.log('Enviando registro con:', data);
    const response = await api.post('/arrendatario/registro', data);
    console.log('Respuesta registro:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error en registro:', error);
    throw error;
  }
};
