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

        // Parse do JSON da resposta
        const responseData = await response.json();

        // Verifica se a resposta inclui a permissao do usuário
        if (!responseData.permissao) {
            throw new Error('Permissão do usuário não encontrada.');
        }

        // Exibe pop-up de sucesso
        mostrarPopup('Login efetuado com sucesso.', '#4CAF50');

        // Redireciona para a página de pesquisa com base na permissão
        const permissao = responseData.permissao;
        const redirectURL = `../pesquisa-e-resultado/index.html?permissao=${permissao}`;
        setTimeout(() => {
            window.location.href = redirectURL;
        }, 1500); // Redireciona após 1,5 segundos

    } catch (error) {
        // Exibe pop-up de erro para usuário ou senha incorretos
        mostrarPopup(error.message || 'Usuário ou senha incorretos.', '#FF5733');
    }
});

function mostrarPopup(mensagem, cor) {
    iziToast.show({
        message: mensagem,
        backgroundColor: cor,
        position: 'topRight', // Posição do pop-up na tela
        timeout: 1500 // Tempo em milissegundos que o pop-up ficará visível
    });
}
