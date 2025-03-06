import { login, register } from './api.js';

export async function handleLogin(email, password) {
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
}

export async function handleRegister(name, email, password) {
  try {
    const response = await register(email, password, name);

    if (response.message === 'Usuário registrado com sucesso') {
      alert('Registro realizado com sucesso!');
    } else {
      alert('Erro ao registrar: ' + response.message);
    }
  } catch (error) {
    console.error('Erro ao registrar:', error);
    alert('Erro ao registrar. Tente novamente.');
  }
}

export function handleLogout() {
  // Remova o cookie no backend ao fazer logout
  fetch('http://localhost:3000/api/auth/logout', {
    method: 'POST',
    credentials: 'include', // Permite o envio de cookies
  })
    .then(() => {
      alert('Logout realizado com sucesso!');
      window.location.href = '/login'; // Redireciona para a página de login
    })
    .catch(error => {
      console.error('Erro ao fazer logout:', error);
      alert('Erro ao fazer logout. Tente novamente.');
    });
}

export function checkAuth() {
  // Verifique se o usuário está autenticado fazendo uma requisição ao backend
  fetch('http://localhost:3000/api/auth/check', {
    method: 'GET',
    credentials: 'include', // Permite o envio de cookies
  })
    .then(response => {
      if (response.ok) {
        // Se autenticado, redirecione para /main se estiver em /login ou /register
        const currentPath = window.location.pathname;
        if (currentPath === '/login' || currentPath === '/register') {
          window.location.href = '/main';
        }
      } else {
        // Se não autenticado, redirecione para /login se estiver em /main
        if (window.location.pathname === '/main') {
          window.location.href = '/login';
        }
      }
    })
    .catch(error => {
      console.error('Erro ao verificar autenticação:', error);
    });
}
