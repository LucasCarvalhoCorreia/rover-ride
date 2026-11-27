# Output — Relatório e Evidências da Execução com IA (Etapa 2)

Esta pasta armazena os artefatos gerados durante a **Etapa 2** (execução exploratória e funcional assistida por IA via Playwright MCP, utilizando a skill `qa-test-executor`).

## Estrutura esperada

```text
output/
├── relatorio-execucao.md          # Consolidação dos resultados (Passou / Falhou / Bloqueado)
└── <slug-do-cenario>/             # Evidências PNG capturadas durante a execução do cenário
    ├── 01-estado-inicial.png
    └── 02-resultado-observado.png
```

## Convenções

- Registrar data/hora da execução, ambiente (`BASE_URL`), cenário executado e status (`Passou`, `Falhou` ou `Bloqueado`).
- Salvar capturas em PNG de todos os resultados relevantes, obrigatoriamente em casos de falha ou bloqueio.
- Não simular resultados nem editar manualmente capturas após a execução.
