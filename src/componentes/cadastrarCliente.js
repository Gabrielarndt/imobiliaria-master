document.getElementById('cadastroForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);
    const jsonData = {};

    formData.forEach((value, key) => {
        jsonData[key] = value;
    });

    try {
        const response = await fetch('/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(jsonData)
        });

        if (!response.ok) {
            const errorMessage = await response.json(); // Faz o parse da resposta JSON
            document.getElementById('mensagemErro').innerText = errorMessage.message; // Exibe apenas a mensagem de erro
            document.getElementById('mensagemErro').style.display = 'block'; // Mostra o elemento de mensagem de erro
            return;
        }

        const responseData = await response.json();
        alert(responseData.message); // Exibe mensagem de sucesso
        window.location.href = '/login'; // Redireciona para a página de login
    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error);
        alert('Erro ao cadastrar usuário. Verifique os dados e tente novamente.');
    }
});
