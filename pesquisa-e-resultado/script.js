
// Função para pesquisar empresas e recursos e exibir os resultados na mesma página
function pesquisarEResultados() {
    const input = document.getElementById('searchInput').value.toLowerCase();
    const empresasDiv = document.getElementById('empresas');
    const recursosDiv = document.getElementById('recursos');

    // Limpa as listas
    empresasDiv.innerHTML = '';
    recursosDiv.innerHTML = '';

    // Array para armazenar os IDs das empresas e recursos selecionados
    let empresasSelecionadasIds = [];
    let recursosSelecionadosIds = [];

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
            const checkboxes = document.querySelectorAll(`#${category} input[type="checkbox"]:checked`);
            if (checkboxes.length > 5) {
                openPopup('Você só pode selecionar até 5 opções.');
                checkbox.checked = false;
            }
            updateBlur(); // Atualiza o efeito de desfoque
            updateSelectedIds(); // Atualiza os IDs selecionados
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

    // Função para buscar e preencher as colunas de acordo com a pesquisa de empresas
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
            updateBlur(); // Atualiza o efeito de desfoque
        })
        .catch(error => {
            console.error('Erro ao buscar empresas:', error);
        });

    // Função para atualizar os arrays de IDs das empresas e recursos selecionados
    function updateSelectedIds() {
        empresasSelecionadasIds = [];
        recursosSelecionadosIds = [];
        
        const empresasSelecionadas = document.querySelectorAll('#empresas input[type="checkbox"]:checked');
        empresasSelecionadas.forEach(checkbox => {
            empresasSelecionadasIds.push(checkbox.value);
        });

        const recursosSelecionados = document.querySelectorAll('#recursos input[type="checkbox"]:checked');
        recursosSelecionados.forEach(checkbox => {
            recursosSelecionadosIds.push(checkbox.value);
        });
    }

    // Função para buscar e preencher as colunas de acordo com a pesquisa de recursos
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
            updateBlur(); // Atualiza o efeito de desfoque
        })
        .catch(error => {
            console.error('Erro ao buscar recursos:', error);
        });

    // Função para aplicar o efeito de desfoque nas tabelas não selecionadas
    function updateBlur() {
        const empresasDiv = document.getElementById('empresas');
        const recursosDiv = document.getElementById('recursos');
        const empresasCheckboxes = empresasDiv.querySelectorAll('input[type="checkbox"]');
        const recursosCheckboxes = recursosDiv.querySelectorAll('input[type="checkbox"]');
        
        const isEmpresaSelected = Array.from(empresasCheckboxes).some(checkbox => checkbox.checked);
        const isRecursoSelected = Array.from(recursosCheckboxes).some(checkbox => checkbox.checked);
        
        empresasDiv.classList.remove('blur');
        recursosDiv.classList.remove('blur');
        
        if (isEmpresaSelected && !isRecursoSelected) {
            recursosDiv.classList.add('blur');
        } else if (!isEmpresaSelected && isRecursoSelected) {
            empresasDiv.classList.add('blur');
        }
    }
}

// Função para voltar à tela de busca
function voltarParaBusca() {
    const container = document.querySelector('.container');
    const resultadosDiv = document.getElementById('resultados');

    // Oculta os resultados e exibe a página principal
    resultadosDiv.style.display = 'none';
    container.style.display = 'block';

    // Limpa a tabela de resultados
    const tabelaResultados = document.getElementById('tabelaResultados');
    tabelaResultados.innerHTML = '';
}

// Adiciona evento de pressionar Enter ao campo de pesquisa
const searchInput = document.getElementById('searchInput');
searchInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        pesquisarEResultados();
    }
});

// Chama a função de pesquisa ao carregar a página
document.addEventListener('DOMContentLoaded', function () {
    pesquisarEResultados();
});

// Função para abrir o popup com uma mensagem
function openPopup(message) {
    var popup = document.getElementById("popup");
    var popupContent = document.getElementById("popupContent");
    popupContent.textContent = message;
    popup.style.display = "block";
}
// Função para fechar o popup
function fecharPopup() {
    var popup = document.getElementById("popup");
    popup.style.display = "none";
}

// Fechar popup
const closeButton = document.querySelector('.close');
closeButton.addEventListener('click', function() {
    var popup = document.getElementById("popup");
    popup.style.display = "none";
});

// Adiciona evento de clique ao botão de resultados da busca
const resultsButton = document.getElementById('resultsButton');
resultsButton.addEventListener('click', function() {
    // Verifica se pelo menos uma opção foi selecionada
    const empresasSelecionadas = document.querySelectorAll('#empresas input[type="checkbox"]:checked');
    const recursosSelecionados = document.querySelectorAll('#recursos input[type="checkbox"]:checked');
    
    if (empresasSelecionadas.length === 0 && recursosSelecionados.length === 0) {
        openPopup('Selecione ao menos uma opção.');
        return; // Encerra a execução da função caso nenhuma opção seja selecionada
    }

    // Oculta os elementos da página
    const container = document.querySelector('.container');
    container.style.display = 'none';

    // Exibe a tabela de resultados
    const resultadosDiv = document.getElementById('resultados');
    resultadosDiv.style.display = 'block';

    // Preenche a tabela de resultados
    const tabelaResultados = document.getElementById('tabelaResultados');
    tabelaResultados.innerHTML = ''; // Limpa a tabela antes de preencher

    // Função para buscar recursos por empresa
    function buscarRecursosPorEmpresa(empresaId) {
        fetch(`http://localhost:3000/recursos-por-empresa?empresa=${empresaId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao buscar recursos por empresa.');
                }
                return response.json();
            })
            .then(recursos => {
                // Buscar o nome da empresa correspondente ao ID
                fetch(`http://localhost:3000/empresa-por-id?id=${empresaId}`)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Erro ao buscar nome da empresa.');
                        }
                        return response.json();
                    })
                    .then(empresa => {
                        // Para cada recurso, criar uma nova linha na tabela de resultados
                        recursos.forEach(recurso => {
                            const row = tabelaResultados.insertRow();
                            const empresaCell = row.insertCell();
                            const recursosCell = row.insertCell();

                            empresaCell.textContent = empresa.nome; // Substitui o ID pelo nome da empresa
                            recursosCell.textContent = recurso.nome;
                        });
                    })
                    .catch(error => {
                        console.error('Erro ao buscar nome da empresa:', error);
                    });
            })
            .catch(error => {
                console.error('Erro ao buscar recursos por empresa:', error);
            });
    }

    // Para cada empresa selecionada, buscar os recursos associados
    empresasSelecionadas.forEach(empresa => {
        buscarRecursosPorEmpresa(empresa.value);
    });
});

// Adiciona evento de clique ao botão "Voltar"
document.getElementById('backButton').addEventListener('click', voltarParaBusca);

// Função para verificar a permissão do usuário e ocultar o botão se não for um administrador
function verificarPermissaoEAtualizarBotao() {
    // Obter os parâmetros da URL
    const urlParams = new URLSearchParams(window.location.search);
    const permissao = urlParams.get('permissao');

    // Verificar se a permissão é "Não" ou se não há permissão definida
    if (permissao === 'Não' || !permissao) {
        // Se a permissão for "Não" ou se não houver permissão definida, ocultar o botão
        const botaoIncluirRemover = document.getElementById('includeRemoveButton');
        if (botaoIncluirRemover) {
            botaoIncluirRemover.style.display = 'none';
        }
    }
}

// Chamar a função ao carregar a página
verificarPermissaoEAtualizarBotao();



// Função para obter empresas do banco de dados e preencher a tabela de empresas
async function obterEmpresasDoBanco() {
    try {
        const response = await fetch('http://localhost:3000/empresas');
        if (!response.ok) {
            throw new Error('Erro ao obter empresas do banco de dados.');
        }
        const empresas = await response.json();
        const empresasTableBody = document.getElementById('empresasTableBody'); // ID correto
        empresasTableBody.innerHTML = ''; // Limpar conteúdo anterior
        empresas.forEach(empresa => {
            const row = document.createElement('tr'); // Criar uma linha de tabela
            row.innerHTML = `
                <td>${empresa.id}</td>
                <td>${empresa.nome}</td>
                <td><button class="excluir-empresa" data-empresa-id="${empresa.id}">Excluir</button></td>
            `;
            empresasTableBody.appendChild(row);
        });

        // Adicionar evento de clique aos botões de exclusão
        const botoesExcluirEmpresa = document.querySelectorAll('.excluir-empresa');
        botoesExcluirEmpresa.forEach(botao => {
            botao.addEventListener('click', async function() {
                const empresaId = this.dataset.empresaId;
                try {
                    const response = await fetch(`http://localhost:3000/recursos-por-empresa?empresa=${empresaId}`);
                    if (!response.ok) {
                        throw new Error('Erro ao obter recursos associados à empresa.');
                    }
                    const recursos = await response.json();
                    if (recursos && recursos.length > 0) {
                        Swal.fire({
                            icon: 'warning',
                            title: 'Existem recursos associados a esta empresa.',
                            text: 'Por favor, remova-os antes de excluir a empresa.'
                        });
                    } else {
                        await excluirEmpresa(empresaId);
                        exibirPopup('Empresa excluída com sucesso.');
                    }
                } catch (error) {
                    console.error(error);
                }
            });
        });
    } catch (error) {
        console.error(error);
    }
}


// Função para obter recursos do banco de dados e preencher a tabela de recursos
async function obterRecursosDoBanco() {
    try {
        const response = await fetch('http://localhost:3000/recursos');
        if (!response.ok) {
            throw new Error('Erro ao obter recursos do banco de dados.');
        }
        const recursos = await response.json();
        const recursosTableBody = document.getElementById('recursosTableBody'); // ID correto
        recursosTableBody.innerHTML = ''; // Limpar conteúdo anterior
        recursos.forEach(recurso => {
            const row = document.createElement('tr'); // Criar uma linha de tabela
            row.innerHTML = `
                <td>${recurso.id}</td>
                <td>${recurso.nome}</td>
                <td>${recurso.empresa_id}</td>
                <td><button class="excluir-recurso" data-recurso-id="${recurso.id}">Excluir</button></td>
            `;
            recursosTableBody.appendChild(row);
        });

        // Adicionar evento de clique aos botões de exclusão
        const botoesExcluirRecurso = document.querySelectorAll('.excluir-recurso');
        botoesExcluirRecurso.forEach(botao => {
            botao.addEventListener('click', async function() {
                const recursoId = this.dataset.recursoId;
                try {
                    await excluirRecurso(recursoId);
                    exibirPopup('Recurso excluído com sucesso.');
                } catch (error) {
                    console.error(error);
                }
            });
        });
    } catch (error) {
        console.error(error);
    }
}


// Função para exibir a janela de inclusão/remoção de empresas e recursos
function exibirIncluirRemoverJanela() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.style.display = 'block';
    } else {
        console.error('Elemento da janela de inclusão/remoção não encontrado.');
    }

    // Preencher a tabela de empresas
    obterEmpresasDoBanco();

    // Preencher a tabela de recursos
    obterRecursosDoBanco();
}

// Função para fechar a janela de inclusão/remoção de empresas e recursos
function fecharIncluirRemoverJanela() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.style.display = 'none';
    } else {
        console.error('Elemento da janela de inclusão/remoção não encontrado.');
    }
}



// Função para excluir uma empresa após a confirmação
async function confirmarExclusaoRecursos(empresaId) {
    try {
        // Consultar os recursos associados à empresa
        const response = await fetch(`http://localhost:3000/recursos-por-empresa?empresa=${empresaId}`);
        if (!response.ok) {
            throw new Error('Erro ao obter recursos associados à empresa.');
        }
        const recursos = await response.json();

        // Verificar se existem recursos associados
        if (recursos && recursos.length > 0) {
            // Se existirem recursos associados, exibir pop-up com SweetAlert2
            Swal.fire({
                icon: 'warning',
                title: 'Existem recursos associados a esta empresa.',
                text: 'Por favor, remova-os antes de excluir a empresa.'
            });
        } else {
            // Se não houver recursos associados, prosseguir com a exclusão da empresa
            await excluirEmpresa(empresaId);
        }
    } catch (error) {
        console.error(error);
    }
}

// Função para excluir uma empresa
async function excluirEmpresa(empresaId) {
    try {
        // Consultar os recursos associados à empresa
        const response = await fetch(`http://localhost:3000/recursos-por-empresa?empresa=${empresaId}`);
        if (!response.ok) {
            throw new Error('Erro ao verificar recursos associados à empresa.');
        }
        const recursos = await response.json();

        // Verificar se existem recursos associados
        if (recursos && recursos.length > 0) {
            // Se existirem recursos associados, exibir pop-up de confirmação de exclusão
            const confirmarExclusao = await confirmarExclusaoRecursos(empresaId);
            if (confirmarExclusao) {
                // Se o usuário confirmar a exclusão, prosseguir com a exclusão da empresa
                const deleteResponse = await fetch(`http://localhost:3000/empresas/${empresaId}`, {
                    method: 'DELETE'
                });
                if (!deleteResponse.ok) {
                    throw new Error('Erro ao excluir empresa.');
                }
                // Atualizar a lista de empresas após a exclusão
                obterEmpresasDoBanco();
                // Exibir pop-up de sucesso utilizando o Swal.fire
                Swal.fire({
                    icon: 'success',
                    title: 'Empresa excluída com sucesso!'
                });
            }
        } else {
            // Se não houver recursos associados, prosseguir com a exclusão da empresa
            const deleteResponse = await fetch(`http://localhost:3000/empresas/${empresaId}`, {
                method: 'DELETE'
            });
            if (!deleteResponse.ok) {
                throw new Error('Erro ao excluir empresa.');
            }
            // Atualizar a lista de empresas após a exclusão
            obterEmpresasDoBanco();
            // Exibir pop-up de sucesso utilizando o Swal.fire
            Swal.fire({
                icon: 'success',
                title: 'Empresa excluída com sucesso!'
            });
        }
    } catch (error) {
        console.error(error);
    }
}

// Função para excluir um recurso
async function excluirRecurso(recursoId) {
    try {
        const response = await fetch(`http://localhost:3000/recursos/${recursoId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('Erro ao excluir recurso.');
        }
        // Remover o recurso da tabela
        const recursoARemover = document.getElementById(`recurso-${recursoId}`);
        if (recursoARemover) {
            recursoARemover.remove();
        }
        // Exibir pop-up de confirmação
        Swal.fire({
            icon: 'success',
            title: 'Excluído com sucesso!',
            showConfirmButton: false,
            timer: 1500
        });
        // Atualizar a tabela de recursos após a exclusão bem-sucedida
        obterRecursosDoBanco();
    } catch (error) {
        console.error(error);
        // Exibir pop-up de erro
        Swal.fire({
            icon: 'error',
            title: 'Erro',
            text: 'Erro ao excluir o recurso. Por favor, tente novamente.'
        });
    }
}


// Adicionar um ouvinte de evento de clique aos botões "Excluir" das empresas
document.addEventListener('DOMContentLoaded', async () => {
    const empresas = await obterEmpresasDoBanco();
    const listaEmpresas = document.getElementById('empresas');
    empresas.forEach(empresa => {
        const itemLista = document.createElement('div');
        itemLista.textContent = empresa.nome;

        const botaoExcluir = document.createElement('button');
        botaoExcluir.textContent = 'Excluir';
        botaoExcluir.dataset.empresaId = empresa.id;
        botaoExcluir.addEventListener('click', () => {
            confirmarExclusaoRecursos(empresa.id);
        });

        itemLista.appendChild(botaoExcluir);
        listaEmpresas.appendChild(itemLista);
    });
});

// Função para lidar com o clique no botão "Incluir Empresa"
function handleIncluirEmpresaClick() {
    // Abre a janela modal de inclusão de empresa
    document.getElementById('incluirEmpresaPopup').style.display = 'block';
}

function handleConfirmarInclusaoEmpresaClick() {
    // Recupera os valores dos inputs
    const idInput = document.getElementById('novaEmpresaIdInput').value;
    const nomeInput = document.getElementById('novaEmpresaNomeInput').value;

    // Verifique se os campos obrigatórios estão preenchidos
    if (!idInput || !nomeInput) {
        console.error('ID e nome da empresa são obrigatórios.');
        return;
    }

    console.log('Dados da nova empresa:');
    console.log('ID:', idInput);
    console.log('Nome:', nomeInput);

    // Cria uma nova instância de XMLHttpRequest
    const xhr = new XMLHttpRequest();
    
    // Configura a função de callback para lidar com a resposta do servidor
    xhr.onload = function() {
        if (xhr.status === 200) {
            console.log('Empresa incluída com sucesso:', xhr.responseText);
            // Fecha a janela modal após a inclusão bem-sucedida
            fecharIncluirEmpresaPopup();
            // Atualiza as tabelas de empresas e recursos
            obterEmpresasDoBanco();
            obterRecursosDoBanco();
        } else {
            console.error('Erro ao incluir empresa:', xhr.status, xhr.statusText);
            // Exiba uma mensagem de erro ao usuário, se necessário
        }
    };
    
    // Configura o método e o endpoint para a requisição
    xhr.open('POST', 'http://localhost:3000/empresas', true);
    
    // Configura o cabeçalho para indicar que estamos enviando JSON
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    // Converte os dados da nova empresa em formato JSON e envia para o servidor
    xhr.send(JSON.stringify({ id: idInput, nome: nomeInput }));
}

// Adicionar ouvinte de evento de clique ao botão "Incluir Empresa"
document.getElementById('botaoIncluirEmpresa').addEventListener('click', handleIncluirEmpresaClick);

// Seleciona o botão de confirmação de inclusão de empresa
const confirmarInclusaoEmpresaButton = document.getElementById('confirmarInclusaoEmpresaButton');

// Adiciona um ouvinte de evento de clique ao botão de confirmação de inclusão de empresa
confirmarInclusaoEmpresaButton.addEventListener('click', handleConfirmarInclusaoEmpresaClick);

// Função para fechar o pop-up de inclusão de empresa
function fecharIncluirEmpresaPopup() {
    // Oculta o pop-up de inclusão de empresa
    document.getElementById('incluirEmpresaPopup').style.display = 'none';
}
