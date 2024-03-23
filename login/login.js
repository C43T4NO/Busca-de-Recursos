const form = document.querySelector('#login-form');

form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const username = document.querySelector('#username').value;
    const password = document.querySelector('#password').value;

    if (username.trim() === '' || password.trim() === '') {
        alert('Por favor, preencha todos os campos.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                usuario: username,
                senha: password
            })
        });

        if (!response.ok) {
            const errorMessage = await response.json();
            throw new Error(errorMessage.message);
        }

        // Se o login for bem-sucedido, exiba o pop-up de sucesso
        mostrarPopup('Login efetuado com sucesso!', '#4CAF50');
        
        // Redirecione para a página de pesquisa após 2 segundos
        setTimeout(() => {
            window.location.href = '../pesquisa/index.html';
        }, 2000);
    } catch (error) {
        // Se houver um erro durante o login, exiba o pop-up de erro
        mostrarPopup(error.message || 'Ocorreu um erro durante o login.', '#FF5733');
    }
});

function mostrarPopup(mensagem, cor) {
    const popup = document.createElement('div');
    popup.className = 'popup';
    popup.textContent = mensagem;
    popup.style.backgroundColor = cor;

    document.body.appendChild(popup);

    // Remover o pop-up após 2 segundos
    setTimeout(() => {
        popup.remove();
    }, 2000);
}
