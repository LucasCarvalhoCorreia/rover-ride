# Relatório de execução

- **Cenário:** Exibir recibo completo com totais conforme a quantidade de diárias
- **Exemplo (linha):** Linha 1 — `diarias = 1 diária` / `total = USD 60.00`
- **Status:** ✅ Passou
- **Data e hora de início:** 27/11/2026 21:38 (horário local, GMT-3)
- **Duração:** ~2 minutos

---

## Resultado observado

| Etapa | Validação | Esperado | Observado | Resultado |
|---|---|---|---|---|
| **Dado** | Rover Orion disponível com diária de USD 60.00 | Orion listado como disponível, com diária USD 60.00 | Na tela `/rovers`, rover **Orion** (4 lugares · 180 km de autonomia) listado com link ativo e valor **USD 60.00 por diária** | ✅ Atendido |
| **Quando** | Confirmar reserva do Orion por 1 diária com dados válidos | Fluxo de 4 etapas concluído com sucesso | Selecionado **Orion** → opção **1 diária (USD 60.00)** pré-selecionada → dados preenchidos (Ana Souza / ana.souza@example.com / BR1234567 / 14/03/1990) → botão **Confirmar reserva** clicado → página avançou para "Reserva confirmada" | ✅ Atendido |
| **Então** | Mensagem "Reserva confirmada!" | Exibir título "Reserva confirmada!" | Heading `Reserva confirmada!` exibido no topo da página | ✅ Atendido |
| **Então** | Data e hora | Data e hora da reserva exibidas | `Data` → **28/11/2026 00:39** | ✅ Atendido |
| **Então** | Código da reserva | Código único gerado exibido | `CÓDIGO DA RESERVA` → **LR-MVPMEZ** | ✅ Atendido |
| **Então** | Modelo do rover | Modelo "Orion" exibido | `Rover` → **Orion** | ✅ Atendido |
| **Então** | Código do rover | Código do rover exibido | `Código` → **RVR-005** | ✅ Atendido |
| **Então** | Quantidade de diárias e valor unitário | "1 diária" e "USD 60.00" por diária | `1 diária × USD 60.00` → **USD 60.00** | ✅ Atendido |
| **Então** | Total USD 60.00 | TOTAL = USD 60.00 | `TOTAL` → **USD 60.00** | ✅ Atendido |
| **Então** | Nome sob rótulo "Piloto" | Rótulo "Piloto" com o nome do passageiro | `Piloto` → **Ana Souza** | ✅ Atendido |
| **Então** | Passaporte | Passaporte do piloto exibido | `Passaporte` → **BR1234567** | ✅ Atendido |
| **Então** | "Pagamento na retirada" | Texto "Pagamento na retirada" exibido | **Pagamento na retirada** | ✅ Atendido |
| **Então** | Orientação de apresentar o código na retirada | Instrução de apresentação do código | **Apresente este código na retirada.** | ✅ Atendido |

---

## Falhas ou bloqueios

Nenhum.

---

## Evidências

- `output/exibir-recibo-completo-com-totais-conforme-a-quantidade-de-diarias/linha-1-01-home.png`
- `output/exibir-recibo-completo-com-totais-conforme-a-quantidade-de-diarias/linha-1-02-frota-orion-disponivel.png`
- `output/exibir-recibo-completo-com-totais-conforme-a-quantidade-de-diarias/linha-1-03-selecao-1-diaria.png`
- `output/exibir-recibo-completo-com-totais-conforme-a-quantidade-de-diarias/linha-1-04-formulario-preenchido.png`
- `output/exibir-recibo-completo-com-totais-conforme-a-quantidade-de-diarias/linha-1-05-recibo-final.png`

---

## Observações e limitações

- Dados utilizados no formulário (não fornecidos pelo cenário; usados valores válidos genéricos): Nome `Ana Souza`, E-mail `ana.souza@example.com`, Passaporte `BR1234567`, Data de nascimento `14/03/1990`.
- A opção "1 diária" já estava pré-selecionada ao entrar na tela de diárias — não foi necessária ação adicional para selecioná-la.
- O e-mail e a data de nascimento **não aparecem no recibo** (confirmado pelo snapshot — apenas Nome, Passaporte são exibidos), o que é consistente com o cenário "Omitir e-mail e data de nascimento no recibo" (R11), mas não é objeto de validação desta linha.

---

## Encerramento do navegador

- **Aba fechada:** sim
- **Fechamento confirmado:** sim — `browser_close` retornou `No open tabs. Navigate to a URL to create one.`
