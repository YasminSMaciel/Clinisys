# ClíniSys

Sistema web de gestão de clínica (cadastro de pacientes, médicos, convênios e consultas).

## Estrutura

```
clinisys/
├── index.html              # Painel inicial
├── views/
│   ├── pacientes.html      # Cadastro + consulta de pacientes (era 2 telas separadas)
│   ├── medicos.html        # Cadastro de médicos
│   ├── convenios.html      # Cadastro de convênios
│   └── consultas.html      # Gerenciamento de consultas
├── public/
│   ├── css/
│   │   └── style.css       # Estilo único, compartilhado por todas as telas
│   └── js/
│       ├── dados.js        # Dados de exemplo e funções de armazenamento (localStorage)
│       ├── pacientes.js    # Lógica da tela de pacientes
│       ├── medicos.js      # Lógica da tela de médicos
│       ├── convenios.js    # Lógica da tela de convênios
│       └── consultas.js    # Lógica da tela de consultas
├── package.json
└── README.md
```

## O que mudou em relação à versão anterior

As três pastas de projeto separadas (`Clinisys_Cadastro_Paciente`,
`Clinisys_Consulta_Pacientes`, `Clinisys_Gerenciamento_Consultas`), cada
uma com seu próprio `index.html`/`style.css`/`script.js`, foram unificadas
em um único projeto:

- As telas de **cadastro** e **consulta** de pacientes viraram uma só
  página (`views/pacientes.html`) — a mesma tabela agora abre o modal
  tanto para "Novo Paciente" quanto para "Editar".
- O CSS repetido nas três telas virou um único `public/css/style.css`
  com variáveis de cor compartilhadas.
- Os dados agora ficam salvos no `localStorage` do navegador (antes eram
  apenas exemplos fixos no JavaScript), então os pacientes cadastrados
  aparecem automaticamente no formulário de consultas.

## Como rodar

Por ser um site estático (sem back-end), basta abrir `index.html` no
navegador. Se preferir servir por um endereço local:

```bash
npm start
```

(usa `npx serve` — não é necessário instalar nada previamente)
