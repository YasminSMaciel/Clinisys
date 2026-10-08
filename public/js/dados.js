// Funções e dados compartilhados entre as telas do sistema.

const CHAVE_PACIENTES = "clinisys_pacientes";
const CHAVE_CONSULTAS = "clinisys_consultas";
const CHAVE_MEDICOS = "clinisys_medicos";
const CHAVE_CONVENIOS = "clinisys_convenios";

const MEDICOS_EXEMPLO = [
  {
    id: 1, nome: "Dr(a). Ana Ferreira", crm: "CRM/PR 21345", especialidade: "Clínica Geral",
    telefone: "(45) 3222-1001", email: "ana.ferreira@clinisys.com", situacao: "Ativo",
  },
  {
    id: 2, nome: "Dr(a). Carlos Mendes", crm: "CRM/PR 18760", especialidade: "Cardiologia",
    telefone: "(45) 3222-1002", email: "carlos.mendes@clinisys.com", situacao: "Ativo",
  },
  {
    id: 3, nome: "Dr(a). Beatriz Rocha", crm: "CRM/PR 30912", especialidade: "Pediatria",
    telefone: "(45) 3222-1003", email: "beatriz.rocha@clinisys.com", situacao: "Ativo",
  },
  {
    id: 4, nome: "Dr(a). Paulo Nogueira", crm: "CRM/PR 14228", especialidade: "Ortopedia",
    telefone: "(45) 3222-1004", email: "paulo.nogueira@clinisys.com", situacao: "Ativo",
  },
];

const CONVENIOS_EXEMPLO = [
  {
    id: 1, nome: "Unimed", registroAns: "339679", telefone: "0800 642 2009",
    email: "atendimento@unimed.exemplo.com", situacao: "Ativo",
  },
  {
    id: 2, nome: "Bradesco Saúde", registroAns: "005711", telefone: "0800 701 2700",
    email: "atendimento@bradesco.exemplo.com", situacao: "Ativo",
  },
  {
    id: 3, nome: "Sulamérica", registroAns: "006246", telefone: "0800 970 0500",
    email: "atendimento@sulamerica.exemplo.com", situacao: "Ativo",
  },
  {
    id: 4, nome: "Amil", registroAns: "326305", telefone: "0800 021 2583",
    email: "atendimento@amil.exemplo.com", situacao: "Inativo",
  },
];

// Dados fictícios para simular o uso do sistema.
const PACIENTES_EXEMPLO = [
  {
    id: 1, tipo: "Convênio", nome: "João da Silva", nomeMae: "Maria da Silva",
    sexo: "Masculino", nascimento: "1990-04-12", cpf: "444.555.666-77",
    telefone: "(45) 98888-1111", convenio: "Unimed", email: "joao.silva@exemplo.com",
    logradouro: "Rua das Flores", numero: "120", complemento: "", bairro: "Centro", cidade: "Cascavel",
  },
  {
    id: 2, tipo: "Convênio", nome: "Roberto Alves", nomeMae: "Sandra Alves",
    sexo: "Masculino", nascimento: "1985-11-03", cpf: "666.777.888-99",
    telefone: "(45) 98888-3333", convenio: "Bradesco Saúde", email: "roberto.alves@exemplo.com",
    logradouro: "Av. Brasil", numero: "45", complemento: "Ap. 302", bairro: "Jardim América", cidade: "Cascavel",
  },
  {
    id: 3, tipo: "Particular", nome: "Fernanda Lima", nomeMae: "Lúcia Lima",
    sexo: "Feminino", nascimento: "1995-07-21", cpf: "555.666.777-88",
    telefone: "(45) 98888-2222", convenio: "", email: "fernanda.lima@exemplo.com",
    logradouro: "Rua Paraná", numero: "870", complemento: "", bairro: "Centro", cidade: "Cascavel",
  },
  {
    id: 4, tipo: "Convênio", nome: "Mariana Costa", nomeMae: "Helena Costa",
    sexo: "Feminino", nascimento: "1978-02-14", cpf: "111.222.333-44",
    telefone: "(45) 99911-4455", convenio: "Sulamérica", email: "mariana.costa@exemplo.com",
    logradouro: "Rua Souza Naves", numero: "1500", complemento: "Casa 2", bairro: "Country", cidade: "Cascavel",
  },
  {
    id: 5, tipo: "Particular", nome: "Pedro Henrique Souza", nomeMae: "Cláudia Souza",
    sexo: "Masculino", nascimento: "2001-09-30", cpf: "222.333.444-55",
    telefone: "(45) 99922-5566", convenio: "", email: "pedro.souza@exemplo.com",
    logradouro: "Rua Recife", numero: "312", complemento: "", bairro: "Cancelli", cidade: "Cascavel",
  },
  {
    id: 6, tipo: "Convênio", nome: "Ana Clara Martins", nomeMae: "Patrícia Martins",
    sexo: "Feminino", nascimento: "2015-05-08", cpf: "333.444.555-66",
    telefone: "(45) 99933-6677", convenio: "Unimed", email: "patricia.martins@exemplo.com",
    logradouro: "Av. Tancredo Neves", numero: "2200", complemento: "Bloco B", bairro: "Alto Alegre", cidade: "Cascavel",
  },
  {
    id: 7, tipo: "Convênio", nome: "Luiz Carlos Pereira", nomeMae: "Joana Pereira",
    sexo: "Masculino", nascimento: "1952-12-01", cpf: "777.888.999-00",
    telefone: "(45) 99944-7788", convenio: "Bradesco Saúde", email: "luiz.pereira@exemplo.com",
    logradouro: "Rua Pernambuco", numero: "98", complemento: "", bairro: "Neva", cidade: "Cascavel",
  },
  {
    id: 8, tipo: "Particular", nome: "Juliana Ribeiro", nomeMae: "Rosa Ribeiro",
    sexo: "Feminino", nascimento: "1988-08-17", cpf: "888.999.000-11",
    telefone: "(45) 99955-8899", convenio: "", email: "juliana.ribeiro@exemplo.com",
    logradouro: "Rua Rio de Janeiro", numero: "655", complemento: "Ap. 101", bairro: "Centro", cidade: "Toledo",
  },
];

// As datas das consultas são calculadas a partir de hoje (dias = 0 é hoje),
// assim a agenda de exemplo sempre parece atual na apresentação.
const CONSULTAS_MODELO = [
  { dias: -7, hora: "09:00", paciente: "Luiz Carlos Pereira", medico: "Dr(a). Paulo Nogueira", situacao: "Realizada" },
  { dias: -5, hora: "14:30", paciente: "Mariana Costa", medico: "Dr(a). Beatriz Rocha", situacao: "Realizada" },
  { dias: -3, hora: "10:00", paciente: "Pedro Henrique Souza", medico: "Dr(a). Carlos Mendes", situacao: "Cancelada" },
  { dias: -2, hora: "11:00", paciente: "Fernanda Lima", medico: "Dr(a). Ana Ferreira", situacao: "Realizada" },
  { dias: -1, hora: "16:00", paciente: "Ana Clara Martins", medico: "Dr(a). Beatriz Rocha", situacao: "Realizada" },
  { dias: 0, hora: "08:30", paciente: "João da Silva", medico: "Dr(a). Ana Ferreira", situacao: "Confirmada" },
  { dias: 0, hora: "10:30", paciente: "Juliana Ribeiro", medico: "Dr(a). Carlos Mendes", situacao: "Confirmada" },
  { dias: 0, hora: "15:00", paciente: "Roberto Alves", medico: "Dr(a). Paulo Nogueira", situacao: "Agendada" },
  { dias: 1, hora: "09:30", paciente: "Mariana Costa", medico: "Dr(a). Ana Ferreira", situacao: "Agendada" },
  { dias: 2, hora: "13:00", paciente: "Luiz Carlos Pereira", medico: "Dr(a). Carlos Mendes", situacao: "Confirmada" },
  { dias: 3, hora: "08:00", paciente: "Fernanda Lima", medico: "Dr(a). Beatriz Rocha", situacao: "Agendada" },
  { dias: 5, hora: "14:00", paciente: "Pedro Henrique Souza", medico: "Dr(a). Paulo Nogueira", situacao: "Agendada" },
  { dias: 7, hora: "10:00", paciente: "Ana Clara Martins", medico: "Dr(a). Beatriz Rocha", situacao: "Agendada" },
  { dias: 10, hora: "17:00", paciente: "João da Silva", medico: "Dr(a). Carlos Mendes", situacao: "Agendada" },
];

// Devolve a data de hoje + "dias" no formato AAAA-MM-DD.
function dataRelativa(dias) {
  const data = new Date();
  data.setDate(data.getDate() + dias);
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const dia = String(data.getDate()).padStart(2, "0");
  return `${data.getFullYear()}-${mes}-${dia}`;
}

function gerarConsultasExemplo() {
  return CONSULTAS_MODELO.map((c, i) => ({
    id: i + 1,
    data: dataRelativa(c.dias),
    hora: c.hora,
    paciente: c.paciente,
    medico: c.medico,
    situacao: c.situacao,
  }));
}

// Guarda os dados em memória caso o navegador bloqueie o localStorage
// (acontece em alguns navegadores ao abrir o arquivo direto do disco).
const memoria = {};

function lerTexto(chave) {
  try {
    return localStorage.getItem(chave);
  } catch (erro) {
    return chave in memoria ? memoria[chave] : null;
  }
}

function lerDados(chave) {
  try {
    const lista = JSON.parse(lerTexto(chave));
    return Array.isArray(lista) ? lista : [];
  } catch (erro) {
    return [];
  }
}

function salvarDados(chave, lista) {
  const texto = JSON.stringify(lista);
  memoria[chave] = texto;
  try {
    localStorage.setItem(chave, texto);
  } catch (erro) {
    // Sem localStorage: os dados ficam só em memória nesta página.
  }
}

// Dados de exemplo de cada cadastro do sistema.
function exemplosPorChave() {
  return {
    [CHAVE_MEDICOS]: MEDICOS_EXEMPLO,
    [CHAVE_CONVENIOS]: CONVENIOS_EXEMPLO,
    [CHAVE_PACIENTES]: PACIENTES_EXEMPLO,
    [CHAVE_CONSULTAS]: gerarConsultasExemplo(),
  };
}

function carregarExemplos() {
  const exemplos = exemplosPorChave();
  Object.keys(exemplos).forEach((chave) => salvarDados(chave, exemplos[chave]));
}

function limparTodosDados() {
  Object.keys(exemplosPorChave()).forEach((chave) => salvarDados(chave, []));
}

// Na primeira vez que o sistema é aberto, já carrega os dados fictícios
// (cada cadastro separadamente). Depois de "Limpar dados" as listas ficam
// vazias e não são recarregadas sozinhas.
(function iniciarDados() {
  const exemplos = exemplosPorChave();
  Object.keys(exemplos).forEach((chave) => {
    if (lerTexto(chave) === null) salvarDados(chave, exemplos[chave]);
  });
})();

// Adiciona uma opção ao <select> caso ela ainda não exista.
function garantirOpcao(select, valor) {
  if (!valor) return;
  const existe = Array.from(select.options).some((o) => o.value === valor);
  if (!existe) select.add(new Option(valor, valor));
}

// Monta as <option> de um <select> a partir de uma lista de nomes.
function opcoesHtml(nomes) {
  return nomes
    .map((nome) => `<option value="${escaparHtml(nome)}">${escaparHtml(nome)}</option>`)
    .join("");
}

function proximoId(lista) {
  return lista.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;
}

// Evita que textos digitados quebrem o HTML das tabelas.
function escaparHtml(texto) {
  return String(texto ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Deixa só os números de um texto (usado na busca por CPF/telefone).
function somenteNumeros(texto) {
  return String(texto ?? "").replace(/\D/g, "");
}

function formatarData(dataISO) {
  if (!dataISO) return "";
  const [ano, mes, dia] = dataISO.split("-");
  return `${dia}/${mes}/${ano}`;
}

// Liga os botões "Carregar exemplos" e "Limpar dados", presentes em todas as telas.
function ligarBotoesRodape(aoRecarregar) {
  const botaoCarregar = document.querySelector("#carregarExemplos");
  const botaoLimpar = document.querySelector("#limparDados");

  if (botaoCarregar) {
    botaoCarregar.addEventListener("click", function () {
      carregarExemplos();
      aoRecarregar();
    });
  }

  if (botaoLimpar) {
    botaoLimpar.addEventListener("click", function () {
      limparTodosDados();
      aoRecarregar();
    });
  }
}
