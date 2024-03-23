document.addEventListener("DOMContentLoaded", function() {
  const empresas = [
    "New Model",
    "Orbytal",
    "TechVanguard",
    "InnovaTech",
    "FuturoTech",
    "Visionary Solutions",
    "NexGen",
    "Prime Innovations",
    "Skyline Technologies",
    "Quantum Systems"
  ];

  const recursos = [
    "Buscar por QR Code",
    "Buscar por Imagem",
    "Multi Idiomas",
    "Integração com Redes Sociais",
    "Reconhecimento Facial",
    "Realidade Aumentada",
    "Analytics Avançado",
    "Assistente Virtual",
    "Segurança Biométrica",
    "Geolocalização"
  ];

  const selectEmpresa = document.getElementById("empresa");
  empresas.forEach(empresa => {
    const option = document.createElement("option");
    option.value = empresa;
    option.textContent = empresa;
    selectEmpresa.appendChild(option);
  });

  const selectRecurso = document.getElementById("recurso");

  selectEmpresa.addEventListener("change", function() {
    const selectedEmpresa = selectEmpresa.value;
    const recursosEmpresa = recursosPorEmpresa[selectedEmpresa] || [];

    // Limpar a lista de recursos antes de preencher novamente
    selectRecurso.innerHTML = "";

    // Adicionar uma opção para selecionar todos os recursos
    const optionTodos = document.createElement("option");
    optionTodos.value = "Todos";
    optionTodos.textContent = "Exibir todos os recursos";
    selectRecurso.appendChild(optionTodos);

    recursos.forEach(recurso => {
      if (recursosEmpresa.includes(recurso) || selectedEmpresa === "Todas") {
        const option = document.createElement("option");
        option.value = recurso;
        option.textContent = recurso;
        selectRecurso.appendChild(option);
      }
    });
  });

  const btnBuscar = document.getElementById("buscar-recurso");
  btnBuscar.addEventListener("click", function() {
    const selectedEmpresa = selectEmpresa.value;
    const selectedRecurso = selectRecurso.value;

    const corpoTabela = document.getElementById("corpo-tabela");
    corpoTabela.innerHTML = "";

    let resultadosEncontrados = false;

    empresas.forEach(empresa => {
      if (selectedEmpresa === "Todas" || selectedEmpresa === empresa) {
        const recursosEmpresa = recursosPorEmpresa[empresa] || [];
        recursosEmpresa.forEach(recurso => {
          if (selectedRecurso === "Todos" || selectedRecurso === recurso) {
            const tr = document.createElement("tr");
            const tdEmpresa = document.createElement("td");
            const tdRecurso = document.createElement("td");
            tdEmpresa.textContent = empresa;
            tdRecurso.textContent = recurso;
            tr.appendChild(tdEmpresa);
            tr.appendChild(tdRecurso);
            corpoTabela.appendChild(tr);
            resultadosEncontrados = true;
          }
        });
      }
    });

    if (!resultadosEncontrados) {
      const tr = document.createElement("tr");
      const tdMensagem = document.createElement("td");
      tdMensagem.setAttribute("colspan", "2");
      tdMensagem.textContent = "Nenhum resultado encontrado para os critérios selecionados.";
      tr.appendChild(tdMensagem);
      corpoTabela.appendChild(tr);
    }
  });

  const recursosPorEmpresa = {
    "New Model": ["Buscar por QR Code", "Multi Idiomas", "Assistente Virtual"],
    "Orbytal": ["Reconhecimento Facial", "Geolocalização"],
    "TechVanguard": ["Analytics Avançado", "Integração com Redes Sociais"],
    "InnovaTech": ["Buscar por Imagem", "Realidade Aumentada"],
    "FuturoTech": ["Segurança Biométrica"],
    "Visionary Solutions": ["Buscar por QR Code", "Assistente Virtual"],
    "NexGen": ["Integração com Redes Sociais", "Reconhecimento Facial", "Analytics Avançado"],
    "Prime Innovations": ["Realidade Aumentada", "Geolocalização"],
    "Skyline Technologies": ["Multi Idiomas", "Segurança Biométrica"],
    "Quantum Systems": [] // Quantum Systems não possui recursos associados
  };

  // Simular a seleção inicial da primeira empresa ao carregar a página
  selectEmpresa.dispatchEvent(new Event('change'));

  // Botão para baixar o arquivo Excel
  const btnBaixarArquivo = document.getElementById("baixar-arquivo");
  btnBaixarArquivo.addEventListener("click", function() {
    const tabela = document.getElementById("tabela-resultado");
    const nomeArquivo = `Lista de Recursos-${getDataHora()}.xlsx`; // Nome do arquivo com data e hora
    const workbook = XLSX.utils.table_to_book(tabela, {sheet: "Recursos"}); // Criar workbook a partir da tabela
    XLSX.writeFile(workbook, nomeArquivo); // Baixar o arquivo
  });

  // Função para obter a data e hora no formato Ano-Mês-Dia-Hora-Minuto
  function getDataHora() {
    const data = new Date();
    const ano = data.getFullYear();
    const mes = (data.getMonth() + 1).toString().padStart(2, "0");
    const dia = data.getDate().toString().padStart(2, "0");
    const hora = data.getHours().toString().padStart(2, "0");
    const minuto = data.getMinutes().toString().padStart(2, "0");
    return `${ano}-${mes}-${dia}-${hora}-${minuto}`;
  }
});
