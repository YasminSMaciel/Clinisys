// Seleciona os principais elementos da página.
const sobreposicao = document.querySelector("#sobreposicao");
const formulario = document.querySelector("#formConvenio");
const lista = document.querySelector("#listaConvenios");
const quantidade = document.querySelector("#quantidade");
const mensagemVazia = document.querySelector("#mensagemVazia");
const campoBusca = document.querySelector("#campoBusca");
const tituloModal = document.querySelector("#tituloModal");
const convenioIdCampo = document.querySelector("#convenioId");

// Abre o formulário de cadastro (convênio novo).
function abrirFormulario() {
  formulario.reset();
  convenioIdCampo.value = "";
  tituloModal.textContent = "Novo Convênio";
  sobreposicao.classList.remove("oculto");
}

// Fecha o formulário de cadastro.
function fecharFormulario() {
  sobreposicao.classList.add("oculto");
}

document.querySelector("#abrirFormulario").addEventListener("click", abrirFormulario);
document.querySelector("#fecharFormulario").addEventListener("click", fecharFormulario);
document.querySelector("#cancelar").addEventListener("click", fecharFormulario);

// Preenche o formulário para edição de um convênio existente.
function abrirEdicao(convenio) {
  formulario.reset();
  convenioIdCampo.value = convenio.id;
  tituloModal.textContent = "Editar Convênio";

  document.querySelector("#nome").value = convenio.nome;
  document.querySelector("#registroAns").value = convenio.registroAns;
  document.querySelector("#telefone").value = convenio.telefone || "";
  document.querySelector("#email").value = convenio.email || "";
  document.querySelector("#situacao").value = convenio.situacao || "Ativo";

  sobreposicao.classList.remove("oculto");
}

// Executa o cadastro/edição quando o formulário for enviado.
formulario.addEventListener("submit", function (evento) {
  evento.preventDefault();

  const convenios = lerDados(CHAVE_CONVENIOS);
  const idEditado = convenioIdCampo.value ? Number(convenioIdCampo.value) : null;

  const dadosConvenio = {
    id: idEditado || proximoId(convenios),
    nome: document.querySelector("#nome").value.trim(),
    registroAns: document.querySelector("#registroAns").value.trim(),
    telefone: document.querySelector("#telefone").value,
    email: document.querySelector("#email").value,
    situacao: document.querySelector("#situacao").value,
  };

  const nomeRepetido = convenios.some(
    (c) => c.id !== idEditado && c.nome.toLowerCase() === dadosConvenio.nome.toLowerCase()
  );
  if (nomeRepetido) {
    alert("Já existe um convênio cadastrado com esse nome.");
    return;
  }

  if (idEditado) {
    const indice = convenios.findIndex((c) => c.id === idEditado);
    const nomeAnterior = convenios[indice].nome;
    convenios[indice] = dadosConvenio;

    // Se o nome mudou, atualiza também os pacientes desse convênio.
    if (nomeAnterior !== dadosConvenio.nome) {
      const pacientes = lerDados(CHAVE_PACIENTES).map((p) =>
        p.convenio === nomeAnterior ? { ...p, convenio: dadosConvenio.nome } : p
      );
      salvarDados(CHAVE_PACIENTES, pacientes);
    }
  } else {
    convenios.push(dadosConvenio);
  }

  salvarDados(CHAVE_CONVENIOS, convenios);
  fecharFormulario();
  renderizarLista();
});

// Remove um convênio, desde que nenhum paciente o utilize.
function excluirConvenio(convenio) {
  const totalPacientes = contarPacientes(convenio.nome);
  if (totalPacientes > 0) {
    alert(
      `Não é possível excluir: ${convenio.nome} possui ${totalPacientes} paciente(s). ` +
        "Altere o convênio desses pacientes ou marque o convênio como Inativo."
    );
    return;
  }

  if (!confirm("Deseja realmente excluir este convênio?")) return;

  const convenios = lerDados(CHAVE_CONVENIOS).filter((c) => c.id !== convenio.id);
  salvarDados(CHAVE_CONVENIOS, convenios);
  renderizarLista();
}

function contarPacientes(nomeConvenio) {
  return lerDados(CHAVE_PACIENTES).filter((p) => p.convenio === nomeConvenio).length;
}

// Desenha a tabela de convênios, aplicando o filtro de busca se houver.
function renderizarLista() {
  const termo = campoBusca.value.trim().toLowerCase();
  const convenios = lerDados(CHAVE_CONVENIOS)
    .filter(
      (c) =>
        (c.nome || "").toLowerCase().includes(termo) ||
        (c.registroAns || "").toLowerCase().includes(termo)
    )
    .sort((a, b) => a.nome.localeCompare(b.nome));

  lista.innerHTML = "";

  convenios.forEach((convenio) => {
    const selo = convenio.situacao === "Inativo" ? "selo-inativo" : "selo-ativo";

    const linha = document.createElement("tr");
    linha.innerHTML = `
      <td>${escaparHtml(convenio.nome)}</td>
      <td>${escaparHtml(convenio.registroAns)}</td>
      <td>${escaparHtml(convenio.telefone || "-")}</td>
      <td>${contarPacientes(convenio.nome)}</td>
      <td><span class="selo ${selo}">${escaparHtml(convenio.situacao || "Ativo")}</span></td>
      <td class="acoes">
        <button class="btn-linha" data-acao="editar" data-id="${convenio.id}">Editar</button>
        <button class="btn-linha perigo" data-acao="excluir" data-id="${convenio.id}">Excluir</button>
      </td>
    `;
    lista.appendChild(linha);
  });

  quantidade.textContent = convenios.length;
  mensagemVazia.classList.toggle("oculto", convenios.length > 0);
}

// Delegação de eventos para os botões Editar / Excluir de cada linha.
lista.addEventListener("click", function (evento) {
  const botao = evento.target.closest("button");
  if (!botao) return;

  const convenio = lerDados(CHAVE_CONVENIOS).find((c) => c.id === Number(botao.dataset.id));
  if (!convenio) return;

  if (botao.dataset.acao === "excluir") {
    excluirConvenio(convenio);
  } else if (botao.dataset.acao === "editar") {
    abrirEdicao(convenio);
  }
});

// Atualiza a lista conforme o usuário digita na busca.
campoBusca.addEventListener("input", renderizarLista);

// Liga os botões "Carregar exemplos" / "Limpar dados" do rodapé do menu.
ligarBotoesRodape(renderizarLista);

renderizarLista();
