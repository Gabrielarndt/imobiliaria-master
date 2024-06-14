// cadastrarImovel.js

const form = document.getElementById('cadastro-imovel-form');
const selectedPhotosContainer = document.getElementById('selected-photos-container');
let selectedPhotos = [];
let selectedPhotoIndex = null;
let jsonData = {}; // Adicionando jsonData aqui

// Função para exibir as fotos selecionadas
function displaySelectedPhotos() {
    selectedPhotosContainer.innerHTML = ''; // Limpa o conteúdo atual

    selectedPhotos.forEach((photo, index) => {
        const img = document.createElement('img');
        img.src = URL.createObjectURL(photo);
        img.dataset.index = index;
        img.addEventListener('click', () => selectPhoto(index));

        // Se a foto estiver selecionada, adiciona a classe 'selected'
        if (index === selectedPhotoIndex) {
            img.classList.add('selected');
        }

        selectedPhotosContainer.appendChild(img);
    });
}

// Função para selecionar uma foto
function selectPhoto(index) {
    selectedPhotoIndex = index;
    displaySelectedPhotos();
}

// Função para mover a foto selecionada para cima
function movePhotoUp() {
    if (selectedPhotoIndex > 0) {
        const temp = selectedPhotos[selectedPhotoIndex];
        selectedPhotos[selectedPhotoIndex] = selectedPhotos[selectedPhotoIndex - 1];
        selectedPhotos[selectedPhotoIndex - 1] = temp;
        selectedPhotoIndex--;
        displaySelectedPhotos();
    }
}

// Função para mover a foto selecionada para baixo
function movePhotoDown() {
    if (selectedPhotoIndex < selectedPhotos.length - 1) {
        const temp = selectedPhotos[selectedPhotoIndex];
        selectedPhotos[selectedPhotoIndex] = selectedPhotos[selectedPhotoIndex + 1];
        selectedPhotos[selectedPhotoIndex + 1] = temp;
        selectedPhotoIndex++;
        displaySelectedPhotos();
    }
}

// Ouvinte de eventos para o botão "Mover para cima"
document.getElementById('move-up-btn').addEventListener('click', movePhotoUp);

// Ouvinte de eventos para o botão "Mover para baixo"
document.getElementById('move-down-btn').addEventListener('click', movePhotoDown);

// Ouvinte de eventos para o input de seleção de arquivos
document.getElementById('fotos').addEventListener('change', (event) => {
    selectedPhotos = Array.from(event.target.files);
    displaySelectedPhotos();
});


// Event listener para o envio do formulário
form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(form);

    const userId = obterUserIdDoCookie();

    // Adiciona o ID do usuário ao formData
    formData.append('idUsuario', userId);

    const filesData = [];
    
    const files = document.getElementById('fotos').files;
    for (let i = 0; i < files.length; i++) {
        const file = files[i];
        filesData.push({
            name: file.name,
            type: file.type,
            size: file.size,
            file: file
        });
    }

    console.log('Files Data:', filesData); // Adiciona um log para verificar os dados dos arquivos

    // Verificar se já existem fotos em jsonData['fotos']
    if (jsonData['fotos']) {
        // Se já existirem, adicione as novas fotos à lista existente
        jsonData['fotos'] = jsonData['fotos'].concat(filesData);
    } else {
        // Se não existirem, defina as novas fotos como a lista de fotos
        jsonData['fotos'] = filesData;
    }

    formData.forEach((value, key) => {
        if (key !== 'fotos') {
            jsonData[key] = value;
        }
    });

    try {
        const response = await fetch('http://localhost:3000/api/imoveis', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(Object.fromEntries(formData.entries()))
        });

        if (response.ok) {
            window.location.href = '/usuario';
        } else {
            console.error('Erro ao cadastrar imóvel:', response.statusText);
        }
    } catch (error) {
        console.error('Erro ao cadastrar imóvel:', error);
    }
});

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

