
// Aguarda até que o DOM esteja completamente carregado
document.addEventListener("DOMContentLoaded", function () {
    // Seleciona os elementos do formulário
    const selectCidade = document.querySelector("#cidade");
    const selectbairro = document.querySelector("#bairro");

    // Função para carregar os bairros de acordo com a cidade selecionada
    function loadbairros() {
        // Verifica se uma cidade foi selecionada
        if (selectCidade.value) {
            // Simula uma chamada assíncrona para obter os bairros da cidade selecionada
            // Neste exemplo, usamos um array fixo, mas na prática, você buscaria os bairros no servidor
            const bairros = getbairrosByCidade(selectCidade.value);

            // Limpa as opções atuais
            selectbairro.innerHTML = "";

            // Adiciona as novas opções de bairro ao elemento select
            bairros.forEach(bairro => {
                const option = document.createElement("option");
                option.value = bairro;
                option.textContent = bairro;
                selectbairro.appendChild(option);
            });
        }
    }

    // Adiciona um ouvinte de evento ao formulário para lidar com a mudança na seleção da cidade
    selectCidade.addEventListener("change", loadbairros);

    // Função simulada para obter os bairros da cidade selecionada
    function getbairrosByCidade(cidade) {
        // Simula uma busca no servidor para obter os bairros da cidade selecionada
        // Aqui, retornamos um array fixo, mas na prática, você buscaria os bairros no banco de dados
        if (cidade === "itajai") {
            return ["Bairro", "Bairro Fazenda", "Centro", "Praia Brava", "Vila Operária", "São João", "Cabeçudas", "Cordeiros"];
        } else if (cidade === "balneario-camboriu") {
            return ["Bairro", "Centro", "Ariribá", "Barra", "Pioneiros", "Praia dos Amores", "Santa Regina"];
        } else if (cidade === "itapema") {
            return ["Bairro", "Meia Praia", "Morretes"];
        } else {
            return ["Bairro"]; // Retornar um array vazio se nenhuma cidade corresponder
        }
    }
});

const grupos = document.querySelectorAll('.btn-group');

// Variáveis para armazenar os valores selecionados
let quartosSelecionados = "";
let suitesSelecionadas = "";
let garagensSelecionadas = "";

grupos.forEach(grupo => {
    const opcoes = grupo.querySelectorAll('.opcao');

    opcoes.forEach(opcao => {
        opcao.addEventListener('click', () => {
            // Verificar se o botão está selecionado
            const isSelected = opcao.classList.contains('selected');

            // Remover a classe 'selected' de todos os botões do grupo
            opcoes.forEach(op => op.classList.remove('selected'));

            // Se o botão não estiver selecionado, armazenar o valor selecionado
            if (!isSelected) {
                opcao.classList.add('selected');

                // Armazenar o valor do botão selecionado
                if (grupo.getAttribute('aria-label') === 'Quartos') {
                    quartosSelecionados = opcao.value;
                } else if (grupo.getAttribute('aria-label') === 'Suítes') {
                    suitesSelecionadas = opcao.value;
                } else if (grupo.getAttribute('aria-label') === 'Vagas de Garagem') {
                    garagensSelecionadas = opcao.value;
                }
            }
        });
    });
});

// Função para lidar com o envio do formulário de pesquisa
function handleSearchFormSubmit(event) {
    event.preventDefault();

    // Obtendo os valores dos campos do formulário
    var tipo = document.querySelector('[name="tipo"]').value;
    var tipoImovel = document.querySelector('[name="tipoImovel"]').value;
    var cidade = document.querySelector('[name="cidade"]').value;
    var precoMinimo = document.querySelector('[name="precoMinimo"]').value;
    var precoMaximo = document.querySelector('[name="precoMaximo"]').value;
    var bairro = document.querySelector('[name="bairro"]').value;

    // Criar a URL com os parâmetros do formulário
    var url = 'resultado?tipo=' + tipo +
        '&tipoImovel=' + tipoImovel +
        '&cidade=' + cidade +
        '&precoMinimo=' + precoMinimo +
        '&precoMaximo=' + precoMaximo +
        '&bairro=' + bairro +
        '&quartos=' + quartosSelecionados +
        '&suites=' + suitesSelecionadas +
        '&garagens=' + garagensSelecionadas;

    // Redirecionar para a página de resultados com os parâmetros do formulário
    window.location.href = url;
}

// Adicionar um ouvinte de evento para o formulário de pesquisa
document.getElementById('searchForm').addEventListener('submit', handleSearchFormSubmit);

