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
                return false; // Abortar a operação para evitar que mais opções sejam selecionadas
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
            createCheckbox(recursosDiv, recurso, 'recursos');
        });
    }
    updateBlur();
})
.catch(error => {
    console.error('Erro ao buscar recursos:', error);
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
    Swal.fire({
        title: 'Erro!',
        text: message,
        icon: 'error', // Ícone de sucesso
        confirmButtonText: 'OK'
    });
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
resultsButton.addEventListener('click', async function() {
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
            })
        }
    // Para cada empresa selecionada, buscar os recursos associados
    empresasSelecionadas.forEach(empresa => {
        buscarRecursosPorEmpresa(empresa.value);
    })
// Função para buscar empresas por recurso
async function buscarEmpresasPorRecurso(recursoId) {
    try {
        const empresasResponse = await fetch(`http://localhost:3000/empresas-por-recurso?recurso=${recursoId}`);
        if (!empresasResponse.ok) {
            throw new Error('Erro ao buscar empresas por recurso.');
        }
        const empresas = await empresasResponse.json();
        console.log('Empresas encontradas:', empresas);

        empresas.forEach(empresa => {
            const row = tabelaResultados.insertRow();
            const empresaCell = row.insertCell();
            const recursoCell = row.insertCell();

            recursoCell.textContent = empresa.nome_recurso;
            empresaCell.textContent = empresa.nome_empresa;
        });
    } catch (error) {
        console.error('Erro ao buscar empresas por recurso:', error);
    }
}

// Função para criar a planilha Excel com os dados da tabela HTML
function createExcelSheet() {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Resultados');

    // Adiciona o cabeçalho à primeira linha da planilha
    const headerRow = worksheet.addRow(['EMPRESAS', 'RECURSOS']);
    headerRow.font = { bold: true }; // Aplica negrito ao cabeçalho

    // Preenche a tabela Excel com os dados da tabela HTML
    const tableRows = tabelaResultados.querySelectorAll('tr');
    tableRows.forEach(row => {
        const rowData = [];
        row.querySelectorAll('td').forEach(cell => {
            rowData.push(cell.textContent);
        });
        worksheet.addRow(rowData);
    });

    return workbook;
}

// Função para obter a data e hora formatadas no formato "DATA_Hora:Min:Seg"
function getFormattedDateTime() {
    const now = new Date();
    const formattedDate = `${now.getFullYear()}-${(now.getMonth() + 1).toString().padStart(2, '0')}-${now.getDate().toString().padStart(2, '0')}`;
    const formattedTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    return `${formattedDate}_${formattedTime}`;
}

// Adiciona evento de clique ao botão de download
const downloadButton = document.getElementById('downloadButton');
downloadButton.addEventListener('click', function() {
    // Cria a planilha Excel
    const workbook = createExcelSheet();

    // Salva o arquivo .xlsx com a data e hora no nome
    workbook.xlsx.writeBuffer().then(buffer => {
        const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const dateTime = getFormattedDateTime();
        saveAs(blob, `Resultados_${dateTime}.xlsx`);
    });
});

// Limpa a tabela antes de preencher
tabelaResultados.innerHTML = '';

// Para cada recurso selecionado, buscar as empresas associadas
for (const recurso of recursosSelecionados) {
    console.log('Buscando empresas para o recurso com ID:', recurso.value);
    await buscarEmpresasPorRecurso(recurso.value);
}
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

// Função para verificar a permissão do usuário e ocultar o botão se não for um administrador
function verificarPermissaoEAtualizarBotao() {
    const urlParams = new URLSearchParams(window.location.search);
    const permissao = urlParams.get('permissao');

    if (permissao === 'Não' || !permissao) {
        const botaoIncluirRemover = document.getElementById('incluirRemoverButton');
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
        const empresasTableBody = document.getElementById('empresasTableBody');
        empresasTableBody.innerHTML = '';
        empresas.forEach(empresa => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${empresa.id}</td>
                <td>${empresa.nome}</td>
                <td><button class="excluir-empresa" data-empresa-id="${empresa.id}">Excluir</button></td>
            `;
            empresasTableBody.appendChild(row);
        });
        adicionarEventoExcluirEmpresa();
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
        const recursosTableBody = document.getElementById('recursosTableBody');
        recursosTableBody.innerHTML = '';
        recursos.forEach(recurso => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${recurso.id}</td>
                <td>${recurso.nome}</td>
                <td>${recurso.empresa_id}</td>
                <td><button class="excluir-recurso" data-recurso-id="${recurso.id}">Excluir</button></td>
            `;
            recursosTableBody.appendChild(row);
        });
        adicionarEventoExcluirRecurso();
    } catch (error) {
        console.error(error);
    }
}

// Função para adicionar evento de clique aos botões de exclusão de empresa
function adicionarEventoExcluirEmpresa() {
    const botoesExcluirEmpresa = document.querySelectorAll('.excluir-empresa');
    botoesExcluirEmpresa.forEach(botao => {
        botao.addEventListener('click', async function() {
            const empresaId = this.dataset.empresaId;
            try {
                const recursos = await obterRecursosDaEmpresa(empresaId);
                if (recursos && recursos.length > 0) {
                    exibirAlertaRecursosAssociados();
                } else {
                    await excluirEmpresa(empresaId);
                    exibirPopup('Empresa excluída com sucesso.');
                }
            } catch (error) {
                console.error(error);
            }
        });
    });
}

// Função para adicionar evento de clique aos botões de exclusão de recurso
function adicionarEventoExcluirRecurso() {
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
}

// Função para exibir a janela de inclusão/remoção de empresas e recursos
function exibirIncluirRemoverJanela() {
    const overlay = document.getElementById('overlay');
    if (overlay) {
        overlay.style.display = 'block';
    } else {
        console.error('Elemento da janela de inclusão/remoção não encontrado.');
    }
    obterEmpresasDoBanco();
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

// Função para lidar com o clique no botão "Incluir/Remover Empresas ou Recursos"
function handleIncluirRemoverClick() {
    exibirIncluirRemoverJanela();
}

// Adicionar ouvinte de evento de clique ao botão "Incluir/Remover Empresas ou Recursos"
const incluirRemoverButton = document.getElementById('incluirRemoverButton');
incluirRemoverButton.addEventListener('click', handleIncluirRemoverClick);

// Função para exibir o pop-up de alerta quando há recursos associados a uma empresa
function exibirAlertaRecursosAssociados() {
    Swal.fire({
        icon: 'warning',
        title: 'Existem recursos associados a esta empresa.',
        text: 'Por favor, remova-os antes de excluir a empresa.'
    });
}

// Função para exibir um pop-up com uma mensagem
function exibirPopup(mensagem) {
    Swal.fire({
        icon: 'success',
        title: mensagem
    });
}

// Função para obter recursos associados a uma empresa
async function obterRecursosDaEmpresa(empresaId) {
    const response = await fetch(`http://localhost:3000/recursos-por-empresa?empresa=${empresaId}`);
    if (!response.ok) {
        throw new Error('Erro ao obter recursos associados à empresa.');
    }
    return response.json();
}

// Função para excluir uma empresa
async function excluirEmpresa(empresaId) {
    const deleteResponse = await fetch(`http://localhost:3000/empresas/${empresaId}`, {
        method: 'DELETE'
    });
    if (!deleteResponse.ok) {
        throw new Error('Erro ao excluir empresa.');
    }
    obterEmpresasDoBanco();
}

// Função para excluir um recurso
async function excluirRecurso(recursoId) {
    const deleteResponse = await fetch(`http://localhost:3000/recursos/${recursoId}`, {
        method: 'DELETE'
    });
    if (!deleteResponse.ok) {
        throw new Error('Erro ao excluir recurso.');
    }
    obterRecursosDoBanco();
}

function incluirEmpresaRecurso() {
    // Evita o comportamento padrão do formulário
    if (event) {
        event.preventDefault();
    }

    // Função para exibir mensagens usando SweetAlert2
    function exibirMensagem(titulo, mensagem, tipo) {
        Swal.fire({
            title: titulo,
            text: mensagem,
            icon: tipo,
            confirmButtonText: 'OK'
        });
    }

    // Obtém os valores dos campos do formulário e armazena em variáveis
    const novaEmpresaId = document.getElementById('novaEmpresaIdInput').value;
    const novaEmpresaNome = document.getElementById('novaEmpresaNomeInput').value;
    const novoRecursoId = document.getElementById('novoRecursoIdInput').value;
    const novoRecursoNome = document.getElementById('novoRecursoNomeInput').value;
    const novoRecursoEmpresaId = document.getElementById('novoRecursoEmpresaIdInput').value;

    // Verifica se os campos de empresa estão preenchidos
    if (novaEmpresaId && novaEmpresaNome) {
        // Verifica se todos os campos estão preenchidos
        if (!novaEmpresaId || !novaEmpresaNome || !novoRecursoId || !novoRecursoNome || !novoRecursoEmpresaId) {
            exibirMensagem('Erro', 'Por favor, preencha todos os campos.', 'error');
            return;
        }
    }

    // Consulta ao servidor para obter todas as empresas
    fetch(`http://localhost:3000/empresas`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Erro ao obter empresas.');
            }
            return response.json();
        })
        .then(empresas => {
            // Verifica se já existe uma empresa com o mesmo ID
            const empresaExistente = empresas.find(empresa => empresa.id === novaEmpresaId);
            if (!empresaExistente) {
                // Se não houver empresa com o mesmo ID, envia a solicitação para incluir a empresa
                return fetch('http://localhost:3000/incluir-empresa', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ id: novaEmpresaId, nome: novaEmpresaNome })
                });
            } else {
                // Se já existir empresa com o mesmo ID, não inclui a empresa
                return Promise.resolve(); // Resolva imediatamente a promessa
            }
        })
        .then(response => {
            // Se a inclusão da empresa ocorrer com sucesso ou se a empresa já existir, inclui o recurso associado
            return fetch('http://localhost:3000/incluir-recurso', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id: novoRecursoId, nome: novoRecursoNome, empresa_id: novoRecursoEmpresaId })
            });
        })
        .then(response => {
            console.log('Resposta do servidor ao incluir recurso:', response);
            // Verifica o status da resposta para o recurso
            if (response.ok) {
                // Se a resposta estiver OK, exibe uma mensagem de sucesso
                exibirMensagem('Sucesso', 'Dados incluídos com sucesso!', 'success');
                // Limpa os campos do formulário
                document.getElementById('novaEmpresaIdInput').value = '';
                document.getElementById('novaEmpresaNomeInput').value = '';
                document.getElementById('novoRecursoIdInput').value = '';
                document.getElementById('novoRecursoNomeInput').value = '';
                document.getElementById('novoRecursoEmpresaIdInput').value = '';
                obterEmpresasDoBanco();
                obterRecursosDoBanco();
            } else {
                // Se a resposta indicar um erro, exibe uma mensagem de erro
                throw new Error('Por favor, verifique se esse recurso já existe ou se os campos foram preenchidos corretamente.');
            }
        })
        .catch(error => {
            // Se ocorrer um erro durante a solicitação, exibe uma mensagem de erro
            console.error(error); // Exemplo de como lidar com o erro
            exibirMensagem('Erro', error.message, 'error');
        });
}

// Chamar a função para obter empresas ao carregar a página
obterEmpresasDoBanco();