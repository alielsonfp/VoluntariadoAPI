// auth.js - Gerencia autenticação e estado do usuário
import { login, register, logout, checkAuth, getCurrentUser } from './api.js';

// Lida com o login
export const handleLogin = async (email, password) => {
  try {
    const response = await login(email, password);

    if (response.message === 'Login realizado com sucesso') {
      alert('Login realizado com sucesso!');
      window.location.href = '/main'; // Redireciona para a página principal
    } else {
      alert('Credenciais inválidas');
    }
  } catch (error) {
    console.error('❌ Erro ao fazer login:', error);
    alert('Erro ao fazer login. Tente novamente.');
  }
};

// Lida com o registro
export const handleRegister = async (name, email, password) => {
  try {
    const response = await register(email, password, name);

    if (response.message === 'Usuário registrado com sucesso') {
      alert('Registro realizado com sucesso!');
      window.location.href = '/login'; // Redireciona para a página de login
    } else {
      alert('Erro ao registrar: ' + response.message);
    }
  } catch (error) {
    console.error('Erro ao registrar:', error);
    alert('Erro ao registrar. Tente novamente.');
  }
};

// Lida com o logout
export const handleLogout = async () => {
  try {
    await logout();
    alert('Logout realizado com sucesso!');
    window.location.href = '/login'; // Redireciona para a página de login
  } catch (error) {
    console.error('Erro ao fazer logout:', error);
    alert('Erro ao fazer logout. Tente novamente.');
  }
};

// Verifica se o usuário está autenticado
export const checkAuthentication = async () => {
  try {
    const response = await checkAuth();

    if (response.authenticated) {
      const currentPath = window.location.pathname;
      if (currentPath === '/login' || currentPath === '/register') {
        window.location.href = '/main'; // Redireciona para a página principal
      }
    } else {
      if (window.location.pathname === '/main') {
        window.location.href = '/login'; // Redireciona para a página de login
      }
    }
  } catch (error) {
    console.error('Erro ao verificar autenticação:', error);
  }
};

// Obtém o email do usuário logado
export const getCurrentUserEmail = async () => {
  try {
    const userData = await getCurrentUser();
    return userData.email;
  } catch (error) {
    console.error('Erro ao obter informações do usuário:', error);
    alert('Erro ao obter informações do usuário. Faça login novamente.');
    window.location.href = '/login'; // Redireciona para a página de login
    return null;
  }
};