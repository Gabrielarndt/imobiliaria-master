async function fetchAndDisplayImoveis() {
    try {
        // Construir a URL da rota de busca de imóveis apenas com o filtro de status
        const url = '/api/imoveis/buscar?status=analise';

        // Realizar uma solicitação GET para a rota de busca de imóveis
        const response = await fetch(url);
        const imoveis = await response.json();

        // Exibir os imóveis na página
        displayImoveis(imoveis);
    } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
    }
}


// Função para exibir os imóveis na página
function displayImoveis(imoveis) {
    const searchResultsList = document.getElementById('search-results-list');

    // Limpa a lista de resultados
    searchResultsList.innerHTML = '';

    // Filtra os imóveis com o status "analise"
    const imoveisAnalise = imoveis.filter(imovel => imovel.status === 'analise');

    // Loop pelos imóveis filtrados e cria os elementos HTML correspondentes
    imoveisAnalise.forEach(imovel => {
        const imovelCard = document.createElement('div');
        imovelCard.classList.add('col-md-4');
        imovelCard.innerHTML = `
            <div class="card mb-4">
                <div class="card-body">
                    ${imovel.fotos.map(foto => `<img src="/api/imoveis/imagens/${foto}" alt="Imagem do imóvel" class="img-fluid">`).join('')}
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

// Chama a função para buscar e exibir os imóveis quando a página é carregada
fetchAndDisplayImoveis();
