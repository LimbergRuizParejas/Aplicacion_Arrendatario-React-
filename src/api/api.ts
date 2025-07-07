import axios from 'axios';

const api = axios.create({
  baseURL: 'https://261d-200-87-196-6.ngrok-free.app/api',
  headers: {
    'ngrok-skip-browser-warning': 'true'
  }
});

export default api;
