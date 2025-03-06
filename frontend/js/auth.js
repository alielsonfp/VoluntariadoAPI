// frontend/js/auth.js

import { register, login } from './api.js';

const TOKEN_KEY = 'volunteer_token';

// Salvar o token no localStorage
export function saveToken(token) {
  localStorage.setItem(TOKEN_KEY, token);
}

// Obter o token do localStorage
export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

// Remover o token do localStorage (logout)
export function removeToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Verificar se o usuário está autenticado
export function isAuthenticated() {
  return getToken() !== null;
}

// Função para registrar um novo usuário
export async function handleRegister(email, password, name) {
  try {
    const response = await register(email, password, name); // Envia o nome para o back-end

    if (response.message === 'Usuário registrado com sucesso') {
      alert('Registro realizado com sucesso!');
      window.location.href = '/login.html'; // Redirecionar para a página de login
    } else {
      alert('Erro ao registrar: ' + response.message);
    }
  } catch (error) {
    console.error('Erro ao registrar:', error);
    alert('Erro ao registrar. Tente novamente.');
  }
}

// Função para fazer login
export async function handleLogin(email, password) {
  try {
    const response = await login(email, password);

    if (response.token) {
      saveToken(response.token); // Salva o token no localStorage
      alert('Login realizado com sucesso!');
      window.location.href = '/main.html'; // Redirecionar para a página principal
    } else {
      alert('Credenciais inválidas');
    }
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    alert('Erro ao fazer login. Tente novamente.');
  }
}