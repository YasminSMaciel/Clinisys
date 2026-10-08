// Funções e dados compartilhados entre as telas do sistema.

const CHAVE_PACIENTES = "clinisys_pacientes";
const CHAVE_CONSULTAS = "clinisys_consultas";

const MEDICOS_EXEMPLO = ["Dr(a). Ana Ferreira", "Dr(a). Carlos Mendes"];

const PACIENTES_EXEMPLO = [
  {
    id: 1,
    tipo: "Convênio",
    nome: "João da Silva",
    nomeMae: "Maria da Silva",
    sexo: "Masculino",
    nascimento: "1990-04-12",
    cpf: "444.555.666-77",
    telefone: "(45) 98888-1111",
    convenio: "Unimed",
    email: "joao.silva@exemplo.com",
    logradouro: "Rua das Flores",
    numero: "120",
    complemento: "",
    bairro: "Centro",
    cidade: "Cascavel",
  },
  {
    id: 2,
    tipo: "Convênio",
    nome: "Roberto Alves",
    nomeMae: "Sandra Alves",
    sexo: "Masculino",
    nascimento: "1985-11-03",
    cpf: "666.777.888-99",
    telefone: "(45) 98888-3333",
    convenio: "Bradesco Saúde",
    email: "roberto.alves@exemplo.com",
    logradouro: "Av. Brasil",
    numero: "45",
    complemento: "Ap. 302",
    bairro: "Jardim América",
    cidade: "Cascavel",
  },
];

const CONSULTAS_EXEMPLO = [
  {
    id: 1,
    data: "2026-09-01",
    hora: "09:00",
    paciente: "João da Silva",
    medico: "Dr(a). Ana Ferreira",
    situacao: "Confirmada",
  },
  {
    id: 2,
    data: "2026-09-01",
    hora: "10:30",
    paciente: "Fernanda Lima",
    medico: "Dr(a). Carlos Mendes",
    situacao: "Agendada",
  },
  {
    id: 3,
    data: "2026-09-03",
    hora: "14:00",
    paciente: "João da Silva",
    medico: "Dr(a). Carlos Mendes",
    situacao: "Agendada",
  },
  {
    id: 4,
    data: "2026-08-29",
    hora: "11:00",
    paciente: "Fernanda Lima",
    medico: "Dr(a). Ana Ferreira",
    situacao: "Realizada",
  },
];

function lerDados(chave) {
  const bruto = localStorage.getItem(chave);
  return bruto ? JSON.parse(bruto) : [];
}

function salvarDados(chave, lista) {
  localStorage.setItem(chave, JSON.stringify(lista));
}

function proximoId(lista) {
  return lista.reduce((maior, item) => Math.max(maior, item.id), 0) + 1;
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
      salvarDados(CHAVE_PACIENTES, PACIENTES_EXEMPLO);
      salvarDados(CHAVE_CONSULTAS, CONSULTAS_EXEMPLO);
      aoRecarregar();
    });
  }

  if (botaoLimpar) {
    botaoLimpar.addEventListener("click", function () {
      salvarDados(CHAVE_PACIENTES, []);
      salvarDados(CHAVE_CONSULTAS, []);
      aoRecarregar();
    });
  }
}
