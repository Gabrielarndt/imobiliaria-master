//logar.js

document.getElementById('loginForm').addEventListener('submit', async (event) => {
    event.preventDefault(); // Impede o comportamento padrão de envio do formulário

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        if (response.ok) {
            window.location.href = '/usuario';
        } else if (response.status === 401) {
            alert('Email ou senha incorretos. Por favor, tente novamente.');
        } else {
            console.error('Erro ao fazer login:', response.statusText);
            alert('Erro ao fazer login. Por favor, tente novamente.');
        }
    } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login. Por favor, tente novamente.');
    }
});

document.getElementById('password-toggle').addEventListener('click', function () {
    const passwordInput = document.getElementById('password');
    const passwordIcon = document.querySelector('#password-toggle i');

    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        passwordIcon.classList.remove('bx-hide');
        passwordIcon.classList.add('bx-show');
    } else {
        passwordInput.type = 'password';
        passwordIcon.classList.remove('bx-show');
        passwordIcon.classList.add('bx-hide');
    }
});

document.getElementById('email').addEventListener('focus', function () {
    document.querySelector('.input_box').classList.add('email-focused');
});

document.getElementById('email').addEventListener('blur', function () {
    if (!this.value) {
        document.querySelector('.input_box').classList.remove('email-focused');
    }
});
