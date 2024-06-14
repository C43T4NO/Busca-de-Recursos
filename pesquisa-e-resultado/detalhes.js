// Função para buscar os dados da API e preencher a lista de opções
async function fetchEmpresas() {
    try {
        const response = await fetch('http://localhost:3000/empresas');
        const empresas = await response.json();

        const optionsList = document.getElementById('options');
        optionsList.innerHTML = ''; // Limpar qualquer opção existente

        empresas.forEach(empresa => {
            const li = document.createElement('li');
            li.textContent = empresa.nome;
            li.onclick = () => selectOption(empresa);
            optionsList.appendChild(li);
        });
    } catch (error) {
        console.error('Erro ao buscar empresas:', error);
    }
}
document.getElementById('searchInput').addEventListener('click', toggleOptions);

function toggleOptions() {
    var options = document.getElementById('options');
    var arrow = document.querySelector('.dropdown-arrow');

    if (options.style.display === 'block') {
        options.style.display = 'none';
        arrow.classList.remove('open');
    } else {
        options.style.display = 'block';
        arrow.classList.add('open');
    }
}


// Esconder a lista de opções se clicar fora da caixa de busca
document.addEventListener('click', function(event) {
    var isClickInside = document.querySelector('.search-container').contains(event.target);
    if (!isClickInside) {
        document.getElementById('options').style.display = 'none';
    }
});

// Função para selecionar uma opção
function selectOption(empresa) {
    document.getElementById('searchInput').value = empresa.nome;
    document.getElementById('options').style.display = 'none';
    document.getElementById('infoBox').style.display = 'block'; // Exibir informações
    showInfo(empresa);
    document.getElementById('infoBox').classList.add('selected'); // Adicionar classe 'selected'
    document.getElementById('infoBox').querySelector('p').style.display = 'none'; // Ocultar mensagem inicial
}

// Função para limpar a busca e os dados da empresa
function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('infoID').querySelector('span').textContent = '';
    document.getElementById('infoNome').querySelector('span').textContent = '';
    document.getElementById('infoContato').querySelector('span').textContent = '';
    document.getElementById('infoExpiracao').querySelector('span').textContent = '';
    document.getElementById('infoCNPJ').querySelector('span').textContent = '';
    
    var infoBox = document.getElementById('infoBox');
    if (!infoBox.classList.contains('selected')) { // Se nenhuma opção foi selecionada
        infoBox.querySelector('p').style.display = 'block'; // Exibir mensagem inicial
    }
}

// Função para exibir as informações da empresa selecionada
function showInfo(empresa) {
    if (empresa) {
        document.getElementById('infoID').querySelector('span').textContent = empresa.id;
        document.getElementById('infoNome').querySelector('span').textContent = empresa.nome;
        document.getElementById('infoContato').querySelector('span').textContent = empresa.contato;
        document.getElementById('infoExpiracao').querySelector('span').textContent = new Date(empresa.expiracao_contrato).toLocaleDateString('pt-BR');
        document.getElementById('infoCNPJ').querySelector('span').textContent = empresa.cnpj;
    }
}

// Função para limpar a busca e os dados da empresa
function clearSearch() {
    document.getElementById('searchInput').value = '';
    document.getElementById('infoID').querySelector('span').textContent = '';
    document.getElementById('infoNome').querySelector('span').textContent = '';
    document.getElementById('infoContato').querySelector('span').textContent = '';
    document.getElementById('infoExpiracao').querySelector('span').textContent = '';
    document.getElementById('infoCNPJ').querySelector('span').textContent = '';
    document.getElementById('infoBox').classList.remove('selected'); // Remover classe 'selected'
    document.getElementById('infoBox').querySelector('p').style.display = 'block'; // Exibir mensagem inicial
}



// Chamar a função fetchEmpresas quando a página carregar
document.addEventListener('DOMContentLoaded', fetchEmpresas);
