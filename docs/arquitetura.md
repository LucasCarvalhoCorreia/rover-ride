# Arquitetura da Suíte de Testes — Rover Ride

Este documento define a arquitetura técnica da suíte de testes automatizados E2E do **Rover Ride** (Etapa 3), utilizando **Playwright + TypeScript** em abordagem **caixa-preta** contra o totem (local ou publicado na Vercel) e manipulação direta de massa no **PostgreSQL (Supabase)**.

---

## 1. Estrutura de diretórios

```text
rover-ride/
├── .github/workflows/
│   └── tests.yml                  # Pipeline CI/CD (validate, check-env, regression)
├── docs/
│   ├── arquitetura.md             # Este documento (Etapa 3)
│   └── kiosk/                     # Especificação Gherkin por funcionalidade + lacunas (Etapa 1)
├── output/                        # Relatório e evidências PNG da execução com IA (Etapa 2)
├── playwright/
│   ├── e2e/                       # Arquivos *.spec.ts organizados por fluxo do Kiosk
│   └── support/
│       ├── index.ts               # Fixture { app } com composição via createApp(page)
│       ├── db.ts                  # Conexão e massa de teste (tabelas rovers e orders)
│       ├── helpers.ts             # Funções utilitárias (datas, passaporte, moeda)
│       ├── types.ts               # Contratos de domínio (Rover, Order, CustomerData)
│       └── pages/
│           ├── *.page.ts          # Page Objects (um por etapa/tela do Kiosk)
│           └── components/        # Componentes reutilizáveis (Header, InactivityModal, ReceiptTicket)
├── .env.example                   # Modelo das variáveis de ambiente (versionado)
├── playwright.config.ts           # Configuração central do Playwright
└── README.md                      # Guia de instalação e execução da suíte
```

---

## 2. Padrão de Page Objects (PCOM) e Fixture `{ app }`

A suíte adota o **Page Component Object Model (PCOM)**:

- **Uma classe por tela/etapa** em `playwright/support/pages/<tela>.page.ts` (ex.: `HomePage`, `CatalogPage`, `DaysPage`, `CustomerDataPage`, `ReceiptPage`, `LookupPage`).
- **Componentes compartilhados** em `playwright/support/pages/components/` (ex.: `Header`, `InactivityModal`, `ReceiptTicket`), sem sufixo `Page`.
- **Composição centralizada:** `playwright/support/index.ts` instancia todos os objetos em `createApp(page)` e exporta `test` e `expect` com a fixture `{ app }`.
- **Regra nos specs:** arquivos em `playwright/e2e/` importam apenas `{ test, expect } from '../support'` e **nunca** fazem `new ...Page(page)`.

### Convenções de escrita

- **Arquivos, classes e métodos em inglês** (`CatalogPage`, `selectRover`, `confirmReservation`).
- **Títulos de `test(...)` idênticos ao nome do cenário Gherkin** em `docs/kiosk/`.
- **Padrão AAA nos testes:** comentários `// Arrange`, `// Act`, `// Assert` separando preparação, ação e verificação.
- **Navegação relativa à `baseURL`:** usar apenas caminhos relativos (`/`), nunca URLs absolutas fixas.
- **Sem `waitForTimeout`:** sincronizar por asserções do Playwright (`toBeVisible`, `toHaveText`, `toHaveURL`).

---

## 3. Estratégia de Locators

Ordem obrigatória de prioridade para seleção de elementos:

1. `page.getByRole(...)` (botões, headings, links, alertas, textboxes)
2. `page.getByLabel(...)` (campos associados a rótulo)
3. `page.getByPlaceholder(...)` (campos com dica de preenchimento)
4. `page.getByTestId(...)` (quando não houver papel/rótulo semântico suficiente)

É proibido usar XPath, navegação relativa (`/..`) ou classes CSS acopladas a estilização.

---

## 4. Massa de dados e isolamento (`db.ts`)

O Rover Ride utiliza duas tabelas principais no Supabase (`schemas.md`):

- `rovers` (`id`, `code`, `model`, `seats`, `range_km`, `max_speed_kmh`, `pressurized`, `daily_rate`, `description`, `features`, `image_url`)
- `orders` (`id`, `reservation_code`, `rover_id`, `customer_name`, `customer_email`, `customer_passport`, `customer_birth_date`, `days_count`, `daily_rate`, `total_amount`, `status`, `created_at`)

### Regras de isolamento e segurança

- **Zero segredos no código:** `playwright/support/db.ts` lê `process.env.DATABASE_URL` e falha imediatamente se a variável não estiver definida.
- **Session pooler obrigatório:** no Supabase, utilizar a string do **Session pooler** (`*.pooler.supabase.com`), pois o GitHub Actions não possui conectividade IPv6 para conexão direta (`db.<ref>.supabase.co`).
- **Isolamento paralelo:** como `fullyParallel` é habilitado e há apenas 1 unidade de cada rover, testes que alteram disponibilidade de um rover específico devem isolar a massa ou usar chaves exclusivas (passaportes e códigos únicos gerados por cenário) e limpar o estado no `Arrange` antes da execução.
- **Preparação determinística:** cancelamentos (`status = 'cancelled'`), criação prévia de reservas para concorrência/consulta e ajuste temporário de catálogo são feitos no `Arrange` via `db.ts`.

---

## 5. Ambiente, relatórios e evidências

- **Variáveis de ambiente:** `.env` local (ignorado pelo Git) é carregado automaticamente no `playwright.config.ts` via `process.loadEnvFile()` (Node >= 20.12) quando o arquivo existir; no CI, as variáveis vêm de *Settings → Secrets and variables → Actions*.
- **Evidências de falha:** `trace: 'retain-on-failure'`, `screenshot: 'only-on-failure'` e `video: 'off'`.
- **Relatórios:** `list` no terminal, HTML em `reports/html` (`open: 'never'`), JUnit em `reports/junit.xml` e suporte a `@estruyf/github-actions-reporter` no resumo dos jobs do GitHub Actions.

---

## 6. Pipeline de Testes Contínuos (`.github/workflows/tests.yml`)

| Job | Gatilho | Responsabilidade |
|---|---|---|
| `validate` | `push` e `pull_request` (`main`, `master`) | Instala dependências e executa `npx playwright test --list` para validar imports e sintaxe sem navegador ou segredos reais |
| `check-env` | `schedule` (07:00 BRT / `0 10 * * *` UTC) e `workflow_dispatch` | Valida existência de `BASE_URL` e `DATABASE_URL`, bloqueia conexão direta do Supabase e verifica se o sandbox responde |
| `regression` | Após `check-env` | Executa toda a suíte contra `BASE_URL` e publica `reports/html`, `reports/junit.xml` e `test-results` com `if: always()` |
