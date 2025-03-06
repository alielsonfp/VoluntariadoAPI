// frontend/js/api.js

const API_BASE_URL = 'http://localhost:3000'; // Substitua pelo URL do seu back-end

// Função genérica para fazer requisições à API
async function fetchAPI(endpoint, method = 'GET', body = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

// Funções específicas para interagir com a API

// Registro
export async function register(email, password, name) {
  return fetchAPI('/api/auth/register', 'POST', { email, password, name }); // Envia o nome
}

// Login
export async function login(email, password) {
  return fetchAPI('/api/auth/login', 'POST', { email, password });
}