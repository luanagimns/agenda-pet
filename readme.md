# Mundo Pet Agendamento

Aplicação web para gerenciamento de agendamentos de um pet shop. O projeto exibe os atendimentos organizados por período do dia e permite cadastrar ou remover agendamentos de forma simples.

## Demo

Acesse a versão online:

```text
https://luanagimns.github.io/agenda-pet/
```

Na demo do GitHub Pages, os agendamentos são salvos no navegador com `localStorage`. Ao rodar localmente, a aplicação usa a API Node.js com Express.

## Funcionalidades

- Listagem de agendamentos por data.
- Separação automática por períodos: manhã, tarde e noite.
- Cadastro de novo atendimento com tutor, pet, telefone, serviço, data e hora.
- Máscara de telefone no formulário.
- Remoção de agendamentos.
- Interface responsiva com modal de cadastro.

## Tecnologias

- HTML5
- CSS3
- JavaScript
- Node.js
- Express

## Como Rodar Localmente

Clone o repositório:

```bash
git clone https://github.com/luanagimns/agenda-pet.git
cd agenda-pet
```

Instale as dependências:

```bash
npm install
```

Inicie o servidor:

```bash
npm start
```

Acesse no navegador:

```text
http://localhost:3000
```

## Endpoints

| Método | Rota | Descrição |
| --- | --- | --- |
| GET | `/api/appointments` | Lista todos os agendamentos |
| GET | `/api/appointments?date=2024-01-10` | Lista agendamentos por data |
| POST | `/api/appointments` | Cria um novo agendamento |
| DELETE | `/api/appointments/:id` | Remove um agendamento |

## Estrutura

```text
agenda-pet/
+-- assets/
+-- index.html
+-- script.js
+-- server.js
+-- style.css
+-- package.json
+-- readme.md
```

## Observações

Os dados são mantidos em memória no servidor. Ao reiniciar a aplicação, os agendamentos criados durante a execução são perdidos.
