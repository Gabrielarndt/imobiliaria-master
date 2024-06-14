// Obtém o ID do usuário logado
const userId = obterUserIdDoCookie();

// Função para buscar e exibir os imóveis do usuário logado
async function fetchAndDisplayUserImoveis() {
    try {
        // Construir a URL da rota de busca de imóveis do usuário logado
        const url = `/api/imoveis/usuario/${userId}`;

        // Realizar uma solicitação GET para a rota de busca de imóveis do usuário logado
        const response = await fetch(url);
        const imoveis = await response.json();

        console.log('Imóveis do usuário:', imoveis); // Adiciona este console.log

        // Exibir os imóveis do usuário na página
        displayImoveis(imoveis);
    } catch (error) {
        console.error('Erro ao buscar imóveis do usuário:', error);
    }
}

function obterUserIdDoCookie() {
    const cookies = document.cookie.split(';'); // Divide os cookies por ponto e vírgula
    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim(); // Remove espaços em branco do início e do fim do cookie
        if (cookie.startsWith('userId=')) { // Verifica se o cookie começa com 'userId='
            return cookie.substring('userId='.length); // Retorna o ID do usuário removendo 'userId=' do início do cookie
        }
    }
    return null; // Retorna null se o cookie 'userId' não for encontrado
}


// Função para exibir os imóveis na página
function displayImoveis(imoveis) {
    const searchResultsList = document.getElementById('search-results-list');

    // Limpa a lista de resultados
    searchResultsList.innerHTML = '';
    // Loop pelos imóveis e cria os elementos HTML correspondentes
    imoveis.forEach(imovel => {
        const imovelCard = document.createElement('div');
        imovelCard.classList.add('col-md-4');
        imovelCard.innerHTML = `
            <div class="card mb-4">
                <div class="card-body">
                ${(imovel.fotos && imovel.fotos.length > 0) ? imovel.fotos.map(foto => `<img src="/api/imoveis/imagens/${foto}" alt="Imagem do imóvel" class="img-fluid">`).join('') : ''}
                    <h5 class="card-title">${imovel.tipo}</h5>
                    <p class="card-text">Preço: R$ ${imovel.preco}</p>
                    <p class="card-text">Cidade: ${imovel.cidade}</p>
                    <p class="card-text">Quartos: ${imovel.quartos}</p>
                    <p class="card-text">Suítes: ${imovel.suites}</p>
                    <p class="card-text">Vagas de Garagem: ${imovel.garagens}</p>
                    <p class="card-text">Tipo Imovel: ${imovel.tipoImovel}</p>
                    <button class="btn btn-primary btn-detalhes" data-imovel-id="${imovel.id}">Detalhes</button>
                </div>
            </div>
        `;
        searchResultsList.appendChild(imovelCard);
    });
    const btnDetalhesList = document.querySelectorAll('.btn-detalhes');
    btnDetalhesList.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const imovelId = event.target.dataset.imovelId;
            window.location.href = `/detalhes?id=${imovelId}`;
        });
    });
}

// Chama a função para buscar e exibir os imóveis do usuário quando a página é carregada
fetchAndDisplayUserImoveis();