//app.js
// Função para obter o token do localStorage
function getToken() {
  return localStorage.getItem('token');
}

// Função para fazer uma solicitação à rota '/usuario' usando o token de autorização
async function getUserDetails() {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Token de autenticação não encontrado');
    }

    const response = await fetch('/usuario', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Erro ao obter detalhes do usuário');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao obter detalhes do usuário:', error);
    throw error;
  }
}


// Suponha que você tenha uma função para exibir os detalhes do usuário
async function displayUserDetails() {
  try {
    const userDetails = await getUserDetails();
    // Aqui você pode exibir os detalhes do usuário no DOM
  } catch (error) {
    // Se houver algum erro ao obter os detalhes do usuário, você pode lidar com ele aqui
    console.error('Erro ao exibir detalhes do usuário:', error);
  }
}

// Chame a função displayUserDetails quando a página for carregada, por exemplo:
window.addEventListener('DOMContentLoaded', () => {
  displayUserDetails();
});

async function loginUser(email, password) {
  try {
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || 'Erro ao fazer login');
    }
    // Armazena o token retornado no localStorage
    localStorage.setItem('token', data.token);
    return data.token;
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    throw error;
  }
}


// Event listener para o formulário de login
document.getElementById('loginForm').addEventListener('submit', async (event) => {
  event.preventDefault(); // Impede o comportamento padrão de envio do formulário
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    const token = await loginUser(email, password);
    // Exibe uma mensagem de sucesso para o usuário
    alert('Login bem-sucedido!');
    // Você também pode redirecionar o usuário para outra página após o login, se necessário
    // window.location.href = '/outra_pagina';
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    // Exibe uma mensagem de erro para o usuário, informando que o login falhou
    alert('Erro ao fazer login. Verifique seu e-mail e senha.');
  }
});



