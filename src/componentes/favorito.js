//favorito.js
document.addEventListener('DOMContentLoaded', async () => {
  listFavorites();
});

async function listFavorites() {
  try {
    const response = await fetch('/api/favoritos', {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (response.ok) {
      const favoritos = await response.json();
      const favoritosLista = document.getElementById('favoritos-lista');

      favoritos.forEach(imovel => {
        const card = document.createElement('div');
        card.classList.add('card');

        card.innerHTML = `
          <img src="http://localhost:3000/api/imoveis/imagens/${imovel.id}" alt="Imagem do Imóvel">
          <div class="card-body">
            <h5 class="card-title">${imovel.titulo}</h5>
            <p class="card-text">${imovel.descricao}</p>
            <p class="card-text">${imovel.tipo}</p>
            <p class="card-text">${imovel.preco}</p>
            <a href="detalhes.html?id=${imovel.id}" class="btn btn-primary">Detalhes</a>
          </div>
        `;

        favoritosLista.appendChild(card);
      });
    } else {
      console.error('Erro ao listar favoritos:', response.statusText);
    }
  } catch (error) {
    console.error('Erro ao listar favoritos:', error);
  }
}

// Função para adicionar/remover imóvel dos favoritos
async function toggleFavorite(userId, imovelId) { // Adicione userId como parâmetro
  console.log('ToggleFavorite está sendo chamado');
  try {
    const response = await fetch('/api/favoritos/add', { // Corrija a URL para '/api/favorites/add'
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ userId: userId, imovelId: imovelId })
    });
    const data = await response.json();
    if (response.ok) {
      // Imóvel adicionado/removido com sucesso
      // Atualizar a aparência do ícone de coração conforme necessário
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

window.toggleFavorite = async function(userId, imovelId) {
  try {
    const response = await fetch('/api/favoritos/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ userId: userId, imovelId: imovelId })
    });
    const data = await response.json();
    if (response.ok) {
      // Imóvel adicionado/removido com sucesso
      // Atualizar a aparência do ícone de coração conforme necessário
    } else {
      console.error('Error:', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}