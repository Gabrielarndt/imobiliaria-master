document.getElementById('editarForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/editarUsuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, phone, password })
        });

        const data = await response.json();

        if (response.ok) {
            // Se a atualização for bem-sucedida, redirecione para a página do usuário
            window.location.href = '/usuario';
        } else {
            // Se ocorrer um erro, exiba a mensagem de erro recebida do servidor
            alert(data.message); // Aqui estamos usando data.message para exibir a mensagem de erro
        }
    } catch (error) {
        console.error('Erro ao atualizar informações do usuário:', error);
        alert('Erro ao atualizar informações do usuário. Por favor, tente novamente.');
    }
});

document.getElementById('password-toggle').addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        this.innerHTML = '<i class="fas fa-eye"></i>';
    }
});
