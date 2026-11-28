# Relatório de execução

- **Cenário:** Tratar rover indisponível ou inexistente ao avançar para escolha de diárias
- **Status:** ✅ Passou
- **Data e hora de início:** 27/11/2026 21:43 (horário local, GMT-3)
- **Duração:** ~2 minutos

---

## Resultado observado

| Etapa | Validação | Esperado | Observado | Resultado |
|---|---|---|---|---|
| **Dado** | Rover Orion indisponível antes de iniciar as diárias | Orion marcado como indisponível no catálogo | Na tela `/rovers`, o card do rover **Orion** (RVR-005) exibe o badge **"Indisponível"** sem link de seleção — o estado já existia na aplicação | ✅ Atendido |
| **Quando** | Tentar prosseguir para escolha de diárias do Orion | Navegar para `/rovers/RVR-005` | Acesso direto a `http://localhost:3000/rovers/RVR-005` — a aplicação respondeu com a tela de rover indisponível | ✅ Atendido |
| **Então 1** | Informado de que o rover não está mais disponível | Mensagem/tela indicando indisponibilidade | Título da página: **"Orion indisponível"** (aba e heading `<h1>`) | ✅ Atendido |
| **Então 2** | Poder retornar ao catálogo da frota ou ao início | Links de navegação de saída presentes | Link **"Ver os rovers"** (`/rovers`) e link **"Voltar ao início"** (`/`) exibidos | ✅ Atendido |

---

## Rover inexistente (complemento do título — verificação extra)

O cenário menciona também o caso **"inexistente"**. Verificado acessando `/rovers/RVR-999` (código inválido):

- HTTP status: **404**
- Título da página: **"Rover não encontrado"**
- Links de retorno: **"Ver os rovers"** e **"Voltar ao início"** — mesma estrutura do caso indisponível

Ambas as variações (indisponível e inexistente) são tratadas pela aplicação com mensagem clara e opções de navegação.

---

## Falhas ou bloqueios

Nenhum.

---

## Evidências

- `output/tratar-rover-indisponivel-ou-inexistente/01-catalogo-orion-indisponivel.png` — catálogo com badge "Indisponível" no card do Orion
- `output/tratar-rover-indisponivel-ou-inexistente/02-orion-indisponivel-tela.png` — tela de rover indisponível ao acessar `/rovers/RVR-005`
- `output/tratar-rover-indisponivel-ou-inexistente/03-rover-inexistente-404.png` — tela de rover não encontrado (404) ao acessar `/rovers/RVR-999`

---

## Observações e limitações

- A pré-condição (Orion indisponível) foi encontrada como estado natural da aplicação, sem necessidade de manipulação de dados.
- O "Quando" foi interpretado como: navegar diretamente para a URL de diárias do rover indisponível, que é o caminho que um usuário tentaria ao tentar forçar o acesso após o rover ter ficado indisponível.
- O caso "inexistente" foi verificado como evidência extra não exigida pelo cenário, mas contemplada pelo seu título.

---

## Encerramento do navegador

- **Aba fechada:** sim
- **Fechamento confirmado:** sim — `browser_close` retornou `No open tabs. Navigate to a URL to create one.`
