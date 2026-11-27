# Especificação Funcional por Exemplos — Rover Ride (Kiosk)

**Fontes:** [rover-ride-rfs.md](../rover-ride-rfs.md), `requirements.md` e `schemas.md`  
**Padrão:** Gherkin declarativo em Português do Brasil (`gherkin-qa-design`).

---

## Índice das funcionalidades

| Arquivo | Escopo | Regras cobertas |
|---|---|---|
| [catalogo.md](catalogo.md) | Listagem, ordenação, disponibilidade e seleção de rovers no catálogo | R1–R3 |
| [diarias.md](diarias.md) | Ficha técnica do rover, escolha de 1 a 3 diárias, alteração e indisponibilidade | R4, R5, R13 |
| [dados-e-confirmacao.md](dados-e-confirmacao.md) | Formulário do cliente, validações, concorrência, duplicidade, falhas e recomeço | R5–R11, R13, R18, R20 |
| [recibo.md](recibo.md) | Conteúdo do recibo, privacidade, conclusão imediata e retorno em 60 s | R5, R11, R12, R17 |
| [consulta.md](consulta.md) | Busca por código ou passaporte, regras de correspondência e efeitos do cancelamento | R11, R14–R16, R21 |
| [inatividade.md](inatividade.md) | Controle de ociosidade no início, aviso aos 75 s, retomada e descarte aos 90 s | R17, R19 |

> O arquivo consolidado original permanece em [rover-ride.md](../rover-ride.md).

---

## Resumo do domínio e atores

- **Objetivo de negócio:** Permitir que o cliente do Lunar Pass consulte a frota, reserve um rover disponível no totem da garagem (escolhendo o veículo, 1 a 3 diárias e informando seus dados para emissão de recibo com pagamento na retirada) e consulte uma reserva confirmada por passaporte ou código da reserva, sem login.
- **Ator principal:** **Cliente** (único ator de negócio; "Piloto" é apenas um termo temático da interface).
- **Atores/eventos externos:** **Outro cliente** (atendimento simultâneo/concorrente) e **processo externo de cancelamento** (altera o status da reserva para `cancelled`).

---

## Catálogo consolidado de regras

| # | Regra | Classe | Origem |
|---|---|---|---|
| R1 | Listagem sem categorias, ordenada por `daily_rate` crescente e desempate por `code` (`RVR-` + ≥ 3 dígitos) | Explícita | RFS 4–5; RF-04 a RF-07; `schemas.md` 5.1 |
| R2 | Informar quando não houver rovers cadastrados | Explícita | RF-09 |
| R3 | Um rover tem no máximo uma reserva confirmada por vez; reservado aparece como "Indisponível", sem preço e sem seleção | Explícita | RFS 5, 11; RF-08; `schemas.md` 5.3 |
| R4 | Ficha técnica na escolha de diárias (lugares, autonomia, cabine pressurizada/aberta, velocidade máxima, descrição opcional); rover indisponível/inexistente redireciona ao catálogo ou início | Explícita | RF-10, RF-15; `schemas.md` 3, 5.2 |
| R5 | Apenas 1, 2 ou 3 diárias (padrão inicial 1 diária); `total_amount = daily_rate × days_count` (2 casas decimais em USD) | Explícita | RFS 6; RF-11 a RF-13; `schemas.md` 5.2 |
| R6 | Nome, e-mail, passaporte e nascimento obrigatórios; erros preservam demais dados para correção | Explícita | RFS 7.1, 7.3; RF-17, RF-19 |
| R7 | Nome 3–120 chars; e-mail válido (armazenado em minúsculas); passaporte 5–30 chars em maiúsculas | Explícita | RFS 7.1; RF-18, 4.2; `schemas.md` 4, 5.2 |
| R8 | Nascimento (DD/MM/AAAA) válido e ≥ 18 anos completos na data da reserva ("O piloto precisa ter 18 anos ou mais.") | Explícita | RFS 7.1, 7.3; RF-20, 4.2 |
| R9 | Um passaporte tem no máximo uma reserva confirmada por vez ("Este passaporte já possui uma locação.") | Explícita | RFS 7.3, 11; RF-21, RF-23; `schemas.md` 5.3 |
| R10 | Disponibilidade validada no momento da confirmação (concorrência de rover/passaporte); impede confirmações duplicadas durante processamento | Explícita | RFS 11; RF-21 a RF-23, 4.1 |
| R11 | Reserva preserva `daily_rate` contratado, não expira, pagamento na retirada; recibo com código `LR-XXXXXX`, rover, diárias, total, nome ("Piloto") e passaporte — sem e-mail nem nascimento | Explícita | RFS 1, 8; RF-24 a RF-29, 4.1; `schemas.md` 5.1, 5.3 |
| R12 | Recibo exibido por 60 s (sem interrupção pela inatividade) ou encerrado manualmente | Explícita | RFS 8.2; RF-30, RF-31, RF-44 |
| R13 | Navegação reversa (voltar às etapas anteriores) e "Recomeçar" disponível fora do recibo | Explícita | RFS 2, 3; RF-14, RF-40 |
| R14 | Consulta exige termo preenchido; busca exata por passaporte ou código (ignora caixa/espaços nas pontas); código tem prioridade sobre passaporte | Explícita | RFS 9; RF-32 a RF-35, 4.2 |
| R15 | Consulta encontrada exibe recibo ("Sua reserva") com nova busca ou concluir; não encontrada (ou cancelada) exibe "Nenhuma reserva encontrada" | Explícita | RFS 9, 11; RF-35 a RF-38 |
| R16 | Reserva `cancelled` permanece no histórico, libera rover e passaporte e não aparece na consulta | Explícita | RFS 11, 12.3; 4.1; `schemas.md` 5.3 |
| R17 | Inatividade não se aplica ao início nem ao recibo; nas demais etapas, 75 s sem toque exibem "Ainda está aí?" (15 s) e 90 s descartam reserva não confirmada | Explícita | RFS 10; RF-41 a RF-44 |
| R18 | Falha de sistema explica o problema e oferece tentar novamente ou voltar ao início | Explícita | RF-45 |
| R19 | Confirmar continuidade no aviso de inatividade mantém etapa, dados e reinicia os 75 s | Derivável | RF-42, RFS 10 |
| R20 | Optar por recomeçar descarta reserva não confirmada e retorna ao início mantendo rover livre | Derivável | RF-40, RF-43, RFS 3 |
| R21 | Visualização da reserva consultada ("Sua reserva") aplica o mesmo retorno automático de 60 s do recibo | Derivável | RFS 9.2; RF-36, RF-44 |
| R22–R24 | Lacunas e contradições descritas abaixo | A investigar | RFS 5, 7, 15; RF-08, RF-19 |

---

## Lacunas, ambiguidades e perguntas para os Três Amigos

| # | Pergunta ou hipótese | Tipo | Por que importa | Relacionado | Quem decide |
|---|---|---|---|---|---|
| P1 | O que deve ser exibido quando todos os rovers cadastrados na frota estiverem reservados (diferente de 0 rovers cadastrados em RF-09)? | Dúvida | Evita beco sem saída sem orientação ao cliente quando toda a frota estiver locada | R22 | Produto |
| P2 | Quais são as mensagens exatas para: catálogo sem rovers (RF-09), rover indisponível/inexistente na etapa de diárias (RF-15), nome fora de 3–120 caracteres, e-mail inválido, passaporte fora de 5–30 caracteres, data inválida/futura e busca vazia (RF-33)? | Dúvida | Textos exatos só existem para campos vazios, menor de 18 anos, passaporte duplicado e busca sem resultado | R2, R4, R7, R14, R23 | Produto |
| P3 | Ao voltar de "Seus dados" para "Diárias" ou para o catálogo, os dados digitados e as diárias selecionadas são preservados ou apagados? E "Recomeçar" nos passos 1 a 3 e na busca leva ao Início ou ao início do fluxo atual, com ou sem confirmação? | Dúvida | Define o comportamento de navegação reversa e descarte voluntário | R13 | Produto |
| P4 | O campo Nome completo aceita apenas espaços em branco, números ou símbolos? Espaços nas pontas são removidos antes de validar 3–120 caracteres? | Dúvida | Define critérios de equivalência e sanitização do nome | R7, R23 | Produto e DEV |
| P5 | Na entrada de passaporte na reserva ("tratado em letras maiúsculas"), o totem converte minúsculas automaticamente ou rejeita com erro? Espaços nas pontas são removidos na reserva e na checagem de duplicidade? | Dúvida | Impacta validação positiva/negativa e prevenção de duplicidade | R7, R9, R23 | Produto e DEV |
| P6 | Qual é o comportamento para datas de nascimento inexistentes (ex.: 31/02/1990), futuras ou muito antigas (ano mínimo)? Qual fuso horário define a "data da reserva" no cálculo de 18 anos e na exibição do `created_at`? | Dúvida | Evita divergência na fronteira de idade e no horário do recibo | R8, R11, R23 | Produto e DEV |
| P7 | RF-19 indica múltiplos campos incorretos juntos; porém, se houver erro de formato/campo junto com regra de negócio (ex.: menor de 18 anos + passaporte já usado), exibe todos simultaneamente ou há prioridade? | Dúvida | Define a validação combinada na confirmação | R6–R9 | Produto e DEV |
| P8 | Na recusa por concorrência de rover na confirmação (RF-23 mantém os dados), qual é a mensagem exibida e o cliente permanece nos dados ou é direcionado ao catálogo mantendo os dados? | Dúvida | Define a recuperação do fluxo quando o rover é tomado por outro cliente | R10 | Produto |
| P9 | Ao acionar "Nova busca" na tela "Sua reserva", o identificador pesquisado anteriormente é limpo? | Dúvida | Define a ergonomia de repetição da consulta | R15 | Produto |
| P10 | Como e por quem ocorre o cancelamento de uma reserva (`cancelled`), já que não há fluxo de cancelamento no totem? | Dúvida | Sem saber a origem do cancelamento, a verificação E2E depende de ação externa/banco | R16 | Produto |
| P11 | O contador próprio de 60 segundos do recibo é fixo ou reinicia se houver toque na tela (sem ser concluir)? E a visualização de "Sua reserva" também ignora o aviso de inatividade de 75 s usando apenas os 60 s próprios? | Dúvida | Evita conflito entre os dois temporizadores na consulta | R12, R17, R21 | Produto e DEV |
| P12 | **Contradição:** nos cards do catálogo, os valores usam vírgula (`50,00` nas imagens do RFS) ou ponto (`USD 50.00` no texto do RFS, `requirements.md` e `schemas.md`)? | Contradição | Garante consistência visual e de formatação monetária | R24 | Produto |
| P13 | **Hipóteses a validar:** (1) Ao confirmar continuidade no aviso de inatividade, etapa e dados são preservados e o contador zera (R19)? (2) Recomeçar descarta a reserva sem ocupar o rover (R20)? (3) "Sua reserva" retorna ao início em 60 s como o recibo pós-reserva (R21)? | Hipótese | Sustentam cenários derivados presentes na especificação | R19, R20, R21 | Produto |
