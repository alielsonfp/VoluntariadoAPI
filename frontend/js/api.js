// api.js - Centraliza todas as chamadas à API
const API_BASE_URL = 'http://localhost:3000';

// Função genérica para fazer requisições à API
export const fetchAPI = async (endpoint, method = 'GET', body = null) => {
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
    const errorText = await response.text();
    throw new Error(`Erro na requisição: ${response.status} - ${errorText}`);
  }

  return response.json();
};

// Autenticação
export const register = async (email, password, name) => {
  return fetchAPI('/api/auth/register', 'POST', { email, password, name });
};

export const login = async (email, password) => {
  return fetchAPI('/api/auth/login', 'POST', { email, password });
};

export const logout = async () => {
  return fetchAPI('/api/auth/logout', 'POST');
};

export const checkAuth = async () => {
  return fetchAPI('/api/auth/check', 'GET');
};

export const getCurrentUser = async () => {
  return fetchAPI('/api/auth/me', 'GET');
};

// Atividades
export const getActivities = async () => {
  return fetchAPI('/api/activities', 'GET');
};

export const joinActivity = async (activityId, userEmail) => {
  return fetchAPI(`/api/activities/${activityId}/join`, 'POST', { userEmail });
};

export const leaveActivity = async (activityId, userEmail) => {
  return fetchAPI(`/api/activities/${activityId}/leave`, 'POST', { userEmail });
};

export const createActivity = async (activityData) => {
  return fetchAPI('/api/activities', 'POST', activityData);
};

export const deleteActivity = async (activityId) => {
  return fetchAPI(`/api/activities/${activityId}`, 'DELETE');
};

// api.js - Adicionar a função de edição
export const updateActivity = async (activityId, activityData) => {
  return fetchAPI(`/api/activities/${activityId}`, 'PUT', activityData);
};