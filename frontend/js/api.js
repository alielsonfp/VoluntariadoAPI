const API_BASE_URL = 'http://localhost:3000';

export async function fetchAPI(endpoint, method = 'GET', body = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
    credentials: 'include', // Permite o envio de cookies
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
}

export async function register(email, password, name) {
  return fetchAPI('/api/auth/register', 'POST', { email, password, name });
}

export async function login(email, password) {
  return fetchAPI('/api/auth/login', 'POST', { email, password });
}