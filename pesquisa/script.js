// Função para pesquisar empresas e recursos
function pesquisar() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const empresasDiv = document.getElementById('empresas');
    const recursosDiv = document.getElementById('recursos');

    // Limpa as listas
    empresasDiv.innerHTML = '';
    recursosDiv.innerHTML = '';

    // Função para criar checkbox e adicionar ao div especificado
    function createCheckbox(container, item, category) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.id = `${category}-${item.id}`; // Define um id único para o checkbox
        checkbox.name = item.nome;
        checkbox.value = item.id;
        const label = document.createElement('label');
        label.textContent = item.nome;
        label.setAttribute('for', checkbox.id); // Associa o label ao checkbox
        const br = document.createElement('br');
        const separator = document.createElement('hr'); // Adiciona o separador

        checkbox.addEventListener('click', function () {
            if (checkbox.checked) {
                // Desmarca os checkboxes da outra categoria
                const otherCategory = category === 'empresas' ? 'recursos' : 'empresas';
                const otherCheckboxes = document.querySelectorAll(`#${otherCategory} input[type="checkbox"]`);
                otherCheckboxes.forEach(cb => {
                    cb.checked = false;
                    cb.disabled = true;
                });
            } else {
                // Habilita os checkboxes da outra categoria
                const otherCategory = category === 'empresas' ? 'recursos' : 'empresas';
                const otherCheckboxes = document.querySelectorAll(`#${otherCategory} input[type="checkbox"]`);
                otherCheckboxes.forEach(cb => {
                    cb.disabled = false;
                });
            }
        });

        container.appendChild(checkbox);
        container.appendChild(label);
        container.appendChild(br);
        container.appendChild(separator); // Adiciona o separador entre os checkboxes
    }

    // Função para filtrar os dados com base no texto de pesquisa
    function filtrarDados(data) {
        return data.filter(item => item.nome.toLowerCase().includes(input));
    }

    // Buscar e preencher as colunas de acordo com a pesquisa
    fetch('http://localhost:3000/empresas')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar empresas');
            }
            return response.json();
        })
        .then(data => {
            console.log('Empresas encontradas:', data);
            const empresasFiltradas = filtrarDados(data);
            if (empresasFiltradas.length === 0) {
                empresasDiv.textContent = 'Nenhuma empresa encontrada!';
            } else {
                empresasFiltradas.forEach(empresa => {
                    createCheckbox(empresasDiv, empresa, 'empresas'); // Passa a categoria 'empresas' como parâmetro
                });
            }
        })
        .catch(error => {
            console.error('Erro ao buscar empresas:', error);
        });

    fetch('http://localhost:3000/recursos')
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao buscar recursos');
            }
            return response.json();
        })
        .then(data => {
            console.log('Recursos encontrados:', data);
            const recursosFiltrados = filtrarDados(data);
            if (recursosFiltrados.length === 0) {
                recursosDiv.textContent = 'Nenhum recurso encontrado!';
            } else {
                recursosFiltrados.forEach(recurso => {
                    createCheckbox(recursosDiv, recurso, 'recursos'); // Passa a categoria 'recursos' como parâmetro
                });
            }
        })
        .catch(error => {
            console.error('Erro ao buscar recursos:', error);
        });
}

// Adiciona evento de clique ao botão de redirecionamento
const redirectButton = document.getElementById('redirectButton');
redirectButton.addEventListener('click', function () {
    const empresasSelecionadas = document.querySelectorAll('#empresas input[type="checkbox"]:checked');
    const recursosSelecionados = document.querySelectorAll('#recursos input[type="checkbox"]:checked');
    if (empresasSelecionadas.length !== 1 || recursosSelecionados.length !== 0) {
        alert('Selecione uma empresa para buscar e redirecionar para a tela de resultados.');
        return;
    }
    window.location.href = '../resultado/resultado.html'; // Redireciona para a tela de resultados
});

// Adiciona evento de pressionar Enter ao campo de pesquisa
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        pesquisar();
    }
});

// Chama a função de pesquisa ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    pesquisar();
});
