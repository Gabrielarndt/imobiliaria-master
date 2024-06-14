async function fetchAndDisplayImoveis() {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const tipo = urlParams.get('tipo');
        const cidade = urlParams.get('cidade');
        const precoMinimo = urlParams.get('precoMinimo');
        const precoMaximo = urlParams.get('precoMaximo');
        const quartos = urlParams.get('quartos');
        const suites = urlParams.get('suites');
        const garagens = urlParams.get('garagens');
        const tipoImovel = urlParams.get('tipoImovel');

        const url = `/api/imoveis/buscar?tipo=${tipo}&cidade=${cidade}&precoMinimo=${precoMinimo}&precoMaximo=${precoMaximo}&quartos=${quartos}&suites=${suites}&garagens=${garagens}&tipoImovel=${tipoImovel}`;

        const response = await fetch(url);
        const imoveis = await response.json();

        // Obter o ID do usuário autenticado
        const userResponse = await fetch('/api/user/id', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });
        const userData = await userResponse.json();
        const userId = userData.userId;
        console.log(`ID do usuário autenticado: ${userId}`);

        displayImoveis(imoveis, userId);
    } catch (error) {
        console.error('Erro ao buscar imóveis:', error);
    }
}

function displayImoveis(imoveis, userId) {
    const searchResultsList = document.getElementById('search-results-list');
    searchResultsList.innerHTML = '';

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
                    <p class="card-text">Tipo Imóvel: ${imovel.tipoImovel}</p>
                    <button class="btn btn-primary btn-detalhes" data-imovel-id="${imovel.id}">Detalhes</button>
                    ${userId === 13 ? `<button class="btn btn-secondary btn-editar" data-imovel-id="${imovel.id}">Editar</button>` : ''}
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

    const btnEditarList = document.querySelectorAll('.btn-editar');
    btnEditarList.forEach(btn => {
        btn.addEventListener('click', (event) => {
            const imovelId = event.target.dataset.imovelId;
            window.location.href = `/editarImovel?id=${imovelId}`;
        });
    });
}

// Chama a função para buscar e exibir os imóveis quando a página é carregada
fetchAndDisplayImoveis();