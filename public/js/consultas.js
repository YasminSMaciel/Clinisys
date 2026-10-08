// Seleção dos elementos da página.
const campoBusca = document.querySelector("#campoBusca");
const tabelaConsultas = document.querySelector("#tabelaConsultas");
const quantidadeConsultas = document.querySelector("#quantidadeConsultas");
const mensagemVaziaConsultas = document.querySelector("#mensagemVaziaConsultas");
const avisoSemPaciente = document.querySelector("#avisoSemPaciente");

const botaoNovaConsulta = document.querySelector("#novaConsulta");
const fundoModal = document.querySelector("#fundoModal");
const formulario = document.querySelector("#formConsulta");
const tituloModal = document.querySelector("#tituloModal");
const indiceConsultaCampo = document.querySelector("#indiceConsulta");

const campoPaciente = document.querySelector("#paciente");
const campoMedico = document.querySelector("#medico");
const campoData = document.querySelector("#dataConsulta");
const campoHora = document.querySelector("#horaConsulta");
const campoSituacao = document.querySelector("#situacao");

// Preenche o <select> de médicos com a lista de exemplo.
function preencherMedicos() {
  campoMedico.innerHTML = MEDICOS_EXEMPLO.map(
    (nome) => `<option value="${escaparHtml(nome)}">${escaparHtml(nome)}</option>`
  ).join("");
}

// Preenche o <select> de pacientes com quem já está cadastrado.
function preencherPacientes() {
  const pacientes = lerDados(CHAVE_PACIENTES);
  campoPaciente.innerHTML = pacientes
    .map((p) => `<option value="${escaparHtml(p.nome)}">${escaparHtml(p.nome)}</option>`)
    .join("");

  const semPaciente = pacientes.length === 0;
  avisoSemPaciente.classList.toggle("oculto", !semPaciente);
  botaoNovaConsulta.disabled = semPaciente;
}

// Abre o formulário para uma nova consulta.
function abrirFormulario() {
  preencherPacientes();
  if (campoPaciente.options.length === 0) return;

  formulario.reset();
  indiceConsultaCampo.value = "";
  tituloModal.textContent = "Nova Consulta";
  fundoModal.classList.remove("oculto");
}

// Fecha o formulário de consulta.
function fecharFormulario() {
  fundoModal.classList.add("oculto");
}

botaoNovaConsulta.addEventListener("click", abrirFormulario);
document.querySelector("#fecharModal").addEventListener("click", fecharFormulario);
document.querySelector("#cancelarConsulta").addEventListener("click", fecharFormulario);

// Adiciona uma opção ao <select> caso ela ainda não exista.
function garantirOpcao(select, valor) {
  if (!valor) return;
  const existe = Array.from(select.options).some((o) => o.value === valor);
  if (!existe) select.add(new Option(valor, valor));
}

// Preenche o formulário para edição de uma consulta existente.
function abrirEdicao(consulta) {
  preencherPacientes();
  formulario.reset();
  indiceConsultaCampo.value = consulta.id;
  tituloModal.textContent = "Editar Consulta";

  // Mantém o paciente/médico da consulta mesmo que não esteja mais na lista.
  garantirOpcao(campoPaciente, consulta.paciente);
  garantirOpcao(campoMedico, consulta.medico);

  campoPaciente.value = consulta.paciente;
  campoMedico.value = consulta.medico;
  campoData.value = consulta.data;
  campoHora.value = consulta.hora;
  campoSituacao.value = consulta.situacao;

  fundoModal.classList.remove("oculto");
}

// Executa o cadastro/edição quando o formulário for enviado.
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const consultas = lerDados(CHAVE_CONSULTAS);
  const idEditado = indiceConsultaCampo.value ? Number(indiceConsultaCampo.value) : null;

  const dadosConsulta = {
    id: idEditado || proximoId(consultas),
    paciente: campoPaciente.value,
    medico: campoMedico.value,
    data: campoData.value,
    hora: campoHora.value,
    situacao: campoSituacao.value,
  };

  if (idEditado) {
    const indice = consultas.findIndex((c) => c.id === idEditado);
    consultas[indice] = dadosConsulta;
  } else {
    consultas.push(dadosConsulta);
  }

  salvarDados(CHAVE_CONSULTAS, consultas);
  fecharFormulario();
  renderizarLista();
});

// Remove uma consulta, após confirmação.
function excluirConsulta(id) {
  if (!confirm("Deseja realmente excluir esta consulta?")) return;

  const consultas = lerDados(CHAVE_CONSULTAS).filter((c) => c.id !== id);
  salvarDados(CHAVE_CONSULTAS, consultas);
  renderizarLista();
}

// Devolve a classe CSS do selo de acordo com a situação.
function classeSituacao(situacao) {
  const mapa = {
    Agendada: "selo-agendada",
    Confirmada: "selo-confirmada",
    Realizada: "selo-realizada",
    Cancelada: "selo-cancelada",
  };
  return mapa[situacao] || "selo-agendada";
}

// Desenha a tabela de consultas, ordenada por data/hora, aplicando a busca.
function renderizarLista() {
  const termo = campoBusca.value.trim().toLowerCase();

  const consultas = lerDados(CHAVE_CONSULTAS)
    .filter(
      (c) =>
        (c.paciente || "").toLowerCase().includes(termo) ||
        (c.medico || "").toLowerCase().includes(termo) ||
        (c.situacao || "").toLowerCase().includes(termo) ||
        formatarData(c.data).includes(termo)
    )
    .sort((a, b) => (a.data + a.hora).localeCompare(b.data + b.hora));

  tabelaConsultas.innerHTML = "";

  consultas.forEach((consulta) => {
    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${formatarData(consulta.data)} ${escaparHtml(consulta.hora)}</td>
      <td>${escaparHtml(consulta.paciente)}</td>
      <td>${escaparHtml(consulta.medico)}</td>
      <td><span class="selo ${classeSituacao(consulta.situacao)}">${escaparHtml(consulta.situacao)}</span></td>
      <td class="acoes">
        <button class="btn-linha" data-acao="editar" data-id="${consulta.id}">Editar</button>
        <button class="btn-linha perigo" data-acao="excluir" data-id="${consulta.id}">Excluir</button>
      </td>
    `;
    tabelaConsultas.appendChild(linha);
  });

  quantidadeConsultas.textContent = consultas.length;
  mensagemVaziaConsultas.classList.toggle("oculto", consultas.length > 0);
}

// Delegação de eventos para os botões Editar / Excluir de cada linha.
tabelaConsultas.addEventListener("click", function (evento) {
  const botao = evento.target.closest("button");
  if (!botao) return;

  const id = Number(botao.dataset.id);
  const acao = botao.dataset.acao;

  if (acao === "excluir") {
    excluirConsulta(id);
  } else if (acao === "editar") {
    const consulta = lerDados(CHAVE_CONSULTAS).find((c) => c.id === id);
    if (consulta) abrirEdicao(consulta);
  }
});

campoBusca.addEventListener("input", renderizarLista);

// Liga os botões "Carregar exemplos" / "Limpar dados" do rodapé do menu.
ligarBotoesRodape(function () {
  preencherPacientes();
  renderizarLista();
});

preencherMedicos();
preencherPacientes();
renderizarLista();
