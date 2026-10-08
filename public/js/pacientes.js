// Seleciona os principais elementos da página.
const sobreposicao = document.querySelector("#sobreposicao");
const formulario = document.querySelector("#formPaciente");
const lista = document.querySelector("#listaPacientes");
const quantidade = document.querySelector("#quantidade");
const mensagemVazia = document.querySelector("#mensagemVazia");
const campoBusca = document.querySelector("#campoBusca");
const tituloModal = document.querySelector("#tituloModal");
const pacienteIdCampo = document.querySelector("#pacienteId");

// Abre o formulário de cadastro (paciente novo).
function abrirFormulario() {
  formulario.reset();
  pacienteIdCampo.value = "";
  tituloModal.textContent = "Novo Paciente";
  sobreposicao.classList.remove("oculto");
}

// Fecha o formulário de cadastro.
function fecharFormulario() {
  sobreposicao.classList.add("oculto");
}

// Abre o formulário quando o botão for clicado.
document
  .querySelector("#abrirFormulario")
  .addEventListener("click", abrirFormulario);

// Fecha pelo botão X.
document
  .querySelector("#fecharFormulario")
  .addEventListener("click", fecharFormulario);

// Fecha pelo botão Cancelar.
document
  .querySelector("#cancelar")
  .addEventListener("click", fecharFormulario);

// Preenche o formulário para edição de um paciente existente.
function abrirEdicao(paciente) {
  formulario.reset();
  pacienteIdCampo.value = paciente.id;
  tituloModal.textContent = "Editar Paciente";

  document.querySelector("#tipo").value = paciente.tipo;
  document.querySelector("#nome").value = paciente.nome;
  document.querySelector("#nomeMae").value = paciente.nomeMae || "";
  document.querySelector("#sexo").value = paciente.sexo;
  document.querySelector("#nascimento").value = paciente.nascimento || "";
  document.querySelector("#cpf").value = paciente.cpf;
  document.querySelector("#telefone").value = paciente.telefone || "";
  document.querySelector("#convenio").value = paciente.convenio || "";
  document.querySelector("#email").value = paciente.email || "";
  document.querySelector("#logradouro").value = paciente.logradouro || "";
  document.querySelector("#numero").value = paciente.numero || "";
  document.querySelector("#complemento").value = paciente.complemento || "";
  document.querySelector("#bairro").value = paciente.bairro || "";
  document.querySelector("#cidade").value = paciente.cidade || "";

  sobreposicao.classList.remove("oculto");
}

// Executa o cadastro/edição quando o formulário for enviado.
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const pacientes = lerDados(CHAVE_PACIENTES);
  const idEditado = pacienteIdCampo.value ? Number(pacienteIdCampo.value) : null;

  const dadosPaciente = {
    id: idEditado || proximoId(pacientes),
    tipo: document.querySelector("#tipo").value,
    nome: document.querySelector("#nome").value,
    nomeMae: document.querySelector("#nomeMae").value,
    sexo: document.querySelector("#sexo").value,
    nascimento: document.querySelector("#nascimento").value,
    cpf: document.querySelector("#cpf").value,
    telefone: document.querySelector("#telefone").value,
    convenio: document.querySelector("#convenio").value,
    email: document.querySelector("#email").value,
    logradouro: document.querySelector("#logradouro").value,
    numero: document.querySelector("#numero").value,
    complemento: document.querySelector("#complemento").value,
    bairro: document.querySelector("#bairro").value,
    cidade: document.querySelector("#cidade").value,
  };

  if (idEditado) {
    const indice = pacientes.findIndex((p) => p.id === idEditado);
    const nomeAnterior = pacientes[indice].nome;
    pacientes[indice] = dadosPaciente;

    // Se o nome mudou, atualiza também as consultas desse paciente.
    if (nomeAnterior !== dadosPaciente.nome) {
      const consultas = lerDados(CHAVE_CONSULTAS).map((c) =>
        c.paciente === nomeAnterior ? { ...c, paciente: dadosPaciente.nome } : c
      );
      salvarDados(CHAVE_CONSULTAS, consultas);
    }
  } else {
    pacientes.push(dadosPaciente);
  }

  salvarDados(CHAVE_PACIENTES, pacientes);
  fecharFormulario();
  renderizarLista();
});

// Remove um paciente da lista, após confirmação.
function excluirPaciente(id) {
  if (!confirm("Deseja realmente excluir este paciente?")) return;

  const pacientes = lerDados(CHAVE_PACIENTES).filter((p) => p.id !== id);
  salvarDados(CHAVE_PACIENTES, pacientes);
  renderizarLista();
}

// Desenha a tabela de pacientes, aplicando o filtro de busca se houver.
function renderizarLista() {
  const termo = campoBusca.value.trim().toLowerCase();
  const termoNumeros = somenteNumeros(termo);
  const pacientes = lerDados(CHAVE_PACIENTES).filter(
    (p) =>
      (p.nome || "").toLowerCase().includes(termo) ||
      (p.cpf || "").toLowerCase().includes(termo) ||
      (termoNumeros !== "" &&
        (somenteNumeros(p.cpf).includes(termoNumeros) ||
          somenteNumeros(p.telefone).includes(termoNumeros)))
  );

  lista.innerHTML = "";

  pacientes.forEach((paciente) => {
    const selo =
      paciente.tipo === "Convênio" ? "selo-convenio" : "selo-particular";

    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${escaparHtml(paciente.nome)}</td>
      <td>${escaparHtml(paciente.cpf)}</td>
      <td><span class="selo ${selo}">${escaparHtml(paciente.tipo)}</span></td>
      <td>${escaparHtml(paciente.convenio || "-")}</td>
      <td>${escaparHtml(paciente.telefone || "-")}</td>
      <td class="acoes">
        <button class="btn-linha" data-acao="editar" data-id="${paciente.id}">Editar</button>
        <button class="btn-linha perigo" data-acao="excluir" data-id="${paciente.id}">Excluir</button>
      </td>
    `;
    lista.appendChild(linha);
  });

  quantidade.textContent = pacientes.length;
  mensagemVazia.classList.toggle("oculto", pacientes.length > 0);
}

// Delegação de eventos para os botões Editar / Excluir de cada linha.
lista.addEventListener("click", function (evento) {
  const botao = evento.target.closest("button");
  if (!botao) return;

  const id = Number(botao.dataset.id);
  const acao = botao.dataset.acao;

  if (acao === "excluir") {
    excluirPaciente(id);
  } else if (acao === "editar") {
    const paciente = lerDados(CHAVE_PACIENTES).find((p) => p.id === id);
    if (paciente) abrirEdicao(paciente);
  }
});

// Atualiza a lista conforme o usuário digita na busca.
campoBusca.addEventListener("input", renderizarLista);

// Liga os botões "Carregar exemplos" / "Limpar dados" do rodapé do menu.
ligarBotoesRodape(renderizarLista);

renderizarLista();
