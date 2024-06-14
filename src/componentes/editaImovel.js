document.addEventListener("DOMContentLoaded", async function () {
    const urlParams = new URLSearchParams(window.location.search);
    const imovelId = urlParams.get('id');

    if (imovelId) {
        try {
            const response = await fetch(`/api/imoveis/${imovelId}`);
            if (!response.ok) {
                throw new Error(`Erro: ${response.status}`);
            }
            const imovel = await response.json();

            if (imovel) {
                // Preencher o formulário com os dados do imóvel
                document.getElementById('titulo').value = imovel.titulo || '';
                document.getElementById('descricao').value = imovel.descricao || '';
                document.getElementById('tipo').value = imovel.tipo || '';
                document.getElementById('tipoImovel').value = imovel.tipoImovel || '';
                document.getElementById('quartos').value = imovel.quartos || '';
                document.getElementById('garagens').value = imovel.garagens || '';
                document.getElementById('suites').value = imovel.suites || '';
                document.getElementById('preco').value = imovel.preco || '';
                document.getElementById('cidade').value = imovel.cidade || '';
                document.getElementById('bairro').value = imovel.bairro || '';
                document.getElementById('rua').value = imovel.rua || '';
                document.getElementById('status').value = imovel.status || '';
            }
        } catch (error) {
            console.error('Erro ao buscar dados do imóvel:', error);
        }
    }

    const form = document.getElementById('editarImovelForm');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        try {
            const response = await fetch(`/api/imoveis/${imovelId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(Object.fromEntries(formData.entries()))
            });

            if (response.ok) {
                window.location.href = '/usuario';
            } else {
                const data = await response.json();
                console.error('Erro ao editar imóvel:', data.message);
                alert(data.message);
            }
        } catch (error) {
            console.error('Erro ao editar imóvel:', error);
        }
    });
});
