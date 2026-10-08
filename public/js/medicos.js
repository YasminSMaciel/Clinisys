// Seleciona os principais elementos da página.
const sobreposicao = document.querySelector("#sobreposicao");
const formulario = document.querySelector("#formMedico");
const lista = document.querySelector("#listaMedicos");
const quantidade = document.querySelector("#quantidade");
const mensagemVazia = document.querySelector("#mensagemVazia");
const campoBusca = document.querySelector("#campoBusca");
const tituloModal = document.querySelector("#tituloModal");
const medicoIdCampo = document.querySelector("#medicoId");
const campoEspecialidade = document.querySelector("#especialidade");

// Abre o formulário de cadastro (médico novo).
function abrirFormulario() {
  formulario.reset();
  medicoIdCampo.value = "";
  tituloModal.textContent = "Novo Médico";
  sobreposicao.classList.remove("oculto");
}

// Fecha o formulário de cadastro.
function fecharFormulario() {
  sobreposicao.classList.add("oculto");
}

document.querySelector("#abrirFormulario").addEventListener("click", abrirFormulario);
document.querySelector("#fecharFormulario").addEventListener("click", fecharFormulario);
document.querySelector("#cancelar").addEventListener("click", fecharFormulario);

// Preenche o formulário para edição de um médico existente.
function abrirEdicao(medico) {
  formulario.reset();
  medicoIdCampo.value = medico.id;
  tituloModal.textContent = "Editar Médico";

  garantirOpcao(campoEspecialidade, medico.especialidade);

  document.querySelector("#nome").value = medico.nome;
  document.querySelector("#crm").value = medico.crm;
  campoEspecialidade.value = medico.especialidade;
  document.querySelector("#telefone").value = medico.telefone || "";
  document.querySelector("#email").value = medico.email || "";
  document.querySelector("#situacao").value = medico.situacao || "Ativo";

  sobreposicao.classList.remove("oculto");
}

// Executa o cadastro/edição quando o formulário for enviado.
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const medicos = lerDados(CHAVE_MEDICOS);
  const idEditado = medicoIdCampo.value ? Number(medicoIdCampo.value) : null;

  const dadosMedico = {
    id: idEditado || proximoId(medicos),
    nome: document.querySelector("#nome").value.trim(),
    crm: document.querySelector("#crm").value.trim(),
    especialidade: campoEspecialidade.value,
    telefone: document.querySelector("#telefone").value,
    email: document.querySelector("#email").value,
    situacao: document.querySelector("#situacao").value,
  };

  const nomeRepetido = medicos.some(
    (m) => m.id !== idEditado && m.nome.toLowerCase() === dadosMedico.nome.toLowerCase()
  );
  if (nomeRepetido) {
    alert("Já existe um médico cadastrado com esse nome.");
    return;
  }

  if (idEditado) {
    const indice = medicos.findIndex((m) => m.id === idEditado);
    const nomeAnterior = medicos[indice].nome;
    medicos[indice] = dadosMedico;

    // Se o nome mudou, atualiza também as consultas desse médico.
    if (nomeAnterior !== dadosMedico.nome) {
      const consultas = lerDados(CHAVE_CONSULTAS).map((c) =>
        c.medico === nomeAnterior ? { ...c, medico: dadosMedico.nome } : c
      );
      salvarDados(CHAVE_CONSULTAS, consultas);
    }
  } else {
    medicos.push(dadosMedico);
  }

  salvarDados(CHAVE_MEDICOS, medicos);
  fecharFormulario();
  renderizarLista();
});

// Remove um médico, desde que ele não tenha consultas cadastradas.
function excluirMedico(medico) {
  const totalConsultas = contarConsultas(medico.nome);
  if (totalConsultas > 0) {
    alert(
      `Não é possível excluir: ${medico.nome} possui ${totalConsultas} consulta(s). ` +
        "Exclua as consultas ou marque o médico como Inativo."
    );
    return;
  }

  if (!confirm("Deseja realmente excluir este médico?")) return;

  const medicos = lerDados(CHAVE_MEDICOS).filter((m) => m.id !== medico.id);
  salvarDados(CHAVE_MEDICOS, medicos);
  renderizarLista();
}

function contarConsultas(nomeMedico) {
  return lerDados(CHAVE_CONSULTAS).filter((c) => c.medico === nomeMedico).length;
}

// Desenha a tabela de médicos, aplicando o filtro de busca se houver.
function renderizarLista() {
  const termo = campoBusca.value.trim().toLowerCase();
  const medicos = lerDados(CHAVE_MEDICOS)
    .filter(
      (m) =>
        (m.nome || "").toLowerCase().includes(termo) ||
        (m.crm || "").toLowerCase().includes(termo) ||
        (m.especialidade || "").toLowerCase().includes(termo)
    )
    .sort((a, b) => a.nome.localeCompare(b.nome));

  lista.innerHTML = "";

  medicos.forEach((medico) => {
    const selo = medico.situacao === "Inativo" ? "selo-inativo" : "selo-ativo";

    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${escaparHtml(medico.nome)}</td>
      <td>${escaparHtml(medico.crm)}</td>
      <td>${escaparHtml(medico.especialidade)}</td>
      <td>${escaparHtml(medico.telefone || "-")}</td>
      <td>${contarConsultas(medico.nome)}</td>
      <td><span class="selo ${selo}">${escaparHtml(medico.situacao || "Ativo")}</span></td>
      <td class="acoes">
        <button class="btn-linha" data-acao="editar" data-id="${medico.id}">Editar</button>
        <button class="btn-linha perigo" data-acao="excluir" data-id="${medico.id}">Excluir</button>
      </td>
    `;
    lista.appendChild(linha);
  });

  quantidade.textContent = medicos.length;
  mensagemVazia.classList.toggle("oculto", medicos.length > 0);
}

// Delegação de eventos para os botões Editar / Excluir de cada linha.
lista.addEventListener("click", function (evento) {
  const botao = evento.target.closest("button");
  if (!botao) return;

  const medico = lerDados(CHAVE_MEDICOS).find((m) => m.id === Number(botao.dataset.id));
  if (!medico) return;

  if (botao.dataset.acao === "excluir") {
    excluirMedico(medico);
  } else if (botao.dataset.acao === "editar") {
    abrirEdicao(medico);
  }
});

// Atualiza a lista conforme o usuário digita na busca.
campoBusca.addEventListener("input", renderizarLista);

// Liga os botões "Carregar exemplos" / "Limpar dados" do rodapé do menu.
ligarBotoesRodape(renderizarLista);

renderizarLista();
