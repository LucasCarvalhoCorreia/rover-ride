# Rover Ride — Suíte de Testes E2E

Suíte de testes automatizados para o totem de autoatendimento **Rover Ride**, construída com **Playwright + TypeScript** em modelo de caixa-preta.

---

## Estrutura do projeto

```text
rover-ride/
├── .github/workflows/     # tests.yml (CI/CD no GitHub Actions)
├── docs/
│   ├── arquitetura.md     # Etapa 3: arquitetura técnica da suíte
│   └── kiosk/             # Etapa 1: especificações Gherkin por funcionalidade + README com lacunas
├── output/                # Etapa 2: relatório e evidências da execução com IA (Playwright MCP)
├── playwright/
│   ├── e2e/               # Specs E2E (*.spec.ts)
│   └── support/           # Page Objects (PCOM), fixture { app }, db.ts, helpers e types
├── .env.example           # Modelo de variáveis de ambiente
├── playwright.config.ts   # Configuração do Playwright
└── README.md              # Este guia
```

---

## Pré-requisitos

- **Node.js** `>= 20.12` (necessário para `process.loadEnvFile()`; CI usa Node 24)
- **Yarn** (v1)
- Aplicação **Rover Ride** em execução local (`http://localhost:3000`) ou publicada na Vercel

---

## Instalação

1. Instale as dependências do projeto:

```bash
yarn install
```

2. Instale o navegador Chromium do Playwright:

```bash
npx playwright install chromium
```

---

## Configuração de ambiente

1. Crie o arquivo `.env` na raiz a partir do modelo:

```bash
cp .env.example .env
```

2. Preencha os valores no `.env` (este arquivo é ignorado pelo Git):

- `BASE_URL`: URL da aplicação alvo (ex.: `http://localhost:3000` ou `https://<seu-projeto>.vercel.app`)
- `DATABASE_URL`: string de conexão do **Session pooler** do Supabase (*Connect → Session pooler*)

> **Atenção:** no GitHub Actions, utilize sempre a string do **Session pooler** (IPv4) em `DATABASE_URL`, pois os runners não possuem suporte a IPv6 para a conexão direta (`db.<ref>.supabase.co`).

---

## Como rodar a suíte

Listar os testes configurados sem abrir navegador:

```bash
yarn test:list
```

Executar toda a suíte em modo headless:

```bash
yarn test
```

Executar um arquivo específico:

```bash
npx playwright test playwright/e2e/home.spec.ts
```

Abrir a interface interativa do Playwright:

```bash
yarn test:ui
```

Abrir o relatório HTML após a execução:

```bash
yarn report
```

---

## Integração contínua (GitHub Actions)

O workflow [.github/workflows/tests.yml](.github/workflows/tests.yml) executa:

- `validate`: em `push` e `pull_request` (`main` / `master`), validando dependências e imports com `npx playwright test --list`.
- `check-env` + `regression`: diariamente às 07:00 BRT (`0 10 * * *` UTC) ou manualmente via **Run workflow**, publicando relatório HTML, JUnit e evidências em `test-results/`.

Em **Settings → Secrets and variables → Actions** no GitHub, cadastre:

- **Variable:** `BASE_URL`
- **Secret:** `DATABASE_URL`
