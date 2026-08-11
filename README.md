# PHD Escola Virtual

Plataforma educacional web em evolução, criada para apoiar a rotina de alunos e professores em um ambiente digital único.

## Sobre o projeto

O PHD Escola Virtual foi desenvolvido para centralizar atividades acadêmicas e tornar a experiência de estudo e acompanhamento mais organizada. O projeto possui uma interface web moderna e utiliza autenticação e banco de dados em nuvem.

## Funcionalidades

- autenticação de usuários;
- experiência separada para alunos e professores;
- lançamento e acompanhamento de atividades;
- acompanhamento do desempenho acadêmico;
- integração com Supabase;
- interface responsiva;
- deploy web com Vercel.

## Tecnologias

- React
- TypeScript
- Vite
- Supabase
- React Hook Form
- Zod
- Git e GitHub
- Vercel

## Supabase

A aplicação utiliza o cliente oficial `@supabase/supabase-js`, com persistência de sessão, renovação automática de token e leitura das credenciais por variáveis de ambiente.

Crie um arquivo `.env` local com as variáveis necessárias:

```env
VITE_SUPABASE_URL=sua_url
VITE_SUPABASE_PUBLISHABLE_KEY=sua_chave_publica
```

Nunca publique as credenciais reais no repositório.

## Como executar

```bash
cd app
npm install
npm run dev
```

## Deploy

Versão publicada: https://phdescolavitual.vercel.app/

## Objetivo técnico

Este projeto é utilizado como prática de desenvolvimento front-end, autenticação, formulários, validação, gerenciamento de estado e integração com banco de dados em nuvem.

## Autor

Marley Thales

GitHub: https://github.com/marleybob12
