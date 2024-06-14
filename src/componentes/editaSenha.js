document.getElementById('editarSenhaForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const oldPassword = document.getElementById('oldPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (newPassword !== confirmPassword) {
        alert('A nova senha e a confirmação não coincidem.');
        return;
    }

    try {
        const response = await fetch('/api/editarSenha', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ oldPassword, newPassword })
        });

        const data = await response.json();

        if (response.ok) {
            alert(data.message);
            // Redirecione para a página desejada após a atualização bem-sucedida
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Erro ao atualizar a senha:', error);
        alert('Erro ao atualizar a senha. Por favor, tente novamente.');
    }
});

document.getElementById('password-toggle').addEventListener('click', function () {
    const passwordInput = document.getElementById('oldPassword');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        this.innerHTML = '<i class="fas fa-eye"></i>';
    }
});

document.getElementById('password-toggle2').addEventListener('click', function () {
    const passwordInput = document.getElementById('newPassword');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        this.innerHTML = '<i class="fas fa-eye"></i>';
    }
});

document.getElementById('password-toggle3').addEventListener('click', function () {
    const passwordInput = document.getElementById('confirmPassword');
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        this.innerHTML = '<i class="fas fa-eye-slash"></i>';
    } else {
        passwordInput.type = 'password';
        this.innerHTML = '<i class="fas fa-eye"></i>';
    }
});
