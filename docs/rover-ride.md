# Especificação por Exemplos: Rover Ride

**Origem:** [rover-ride-rfs.md](file:///c:/Metodo-ADT/rover-ride-tests/docs/rover-ride-rfs.md), `requirements.md` e `schemas.md`  
**Padrão:** Gherkin declarativo em Português do Brasil, focado em regras de negócio e colaboração entre Produto, DEV e QA.

---

## 1. Análise dos artefatos

### Resumo

- **Objetivo de negócio:** Permitir que o cliente do Lunar Pass consulte a frota, reserve um rover disponível no totem da garagem (escolhendo o veículo, 1 a 3 diárias e informando seus dados para emissão de recibo com pagamento na retirada) e consulte uma reserva confirmada por passaporte ou código da reserva, sem necessidade de login.
- **Atores e perfis:**
  - **Cliente:** único ator de negócio, que interage com o totem para reservar um rover e consultar reservas confirmadas. ("Piloto" é apenas um termo temático da interface no recibo e nas mensagens.)
  - **Outro cliente (atendimento simultâneo):** pode concluir uma reserva em outro atendimento concorrente.
  - **Processo externo de cancelamento (não especificado no totem):** altera a situação de uma reserva confirmada para cancelada.
- **Artefatos analisados:** Especificação Funcional (`docs/rover-ride-rfs.md`), Requisitos Funcionais (`requirements.md`) e Modelo de Dados (`schemas.md`).

### Regras identificadas

| # | Regra ou informação | Classe | Origem | Observação |
|---|---|---|---|---|
| R1 | Todos os rovers cadastrados são listados sem categorias, em ordem crescente de valor da diária (`daily_rate`) e, em caso de empate, pelo código do rover (`code`); rovers disponíveis exibem a diária e podem ser selecionados | Explícita | RFS 4–5; RF-04 a RF-07 | Padrão do código: `RVR-` + ao menos 3 dígitos (`schemas.md` 5.1) |
| R2 | Quando não houver rovers cadastrados no sistema, o catálogo informa a ausência de veículos | Explícita | RF-09 | Mensagem exata não definida |
| R3 | Cada rover tem no máximo uma reserva confirmada por vez ("Um rover, uma reserva"); quando reservado, permanece no catálogo como "Indisponível", sem preço e sem seleção | Explícita | RFS 5, 11; RF-08; `schemas.md` 5.3 | |
| R4 | Ao selecionar um rover, são exibidos foto, modelo, descrição (opcional, até 500 caracteres) e ficha técnica (lugares, autonomia, tipo de cabine — pressurizada ou aberta — e velocidade máxima); se o rover não existir ou não estiver mais disponível nesse momento, o sistema informa e oferece retorno ao catálogo ou ao início | Explícita | RF-10, RF-15; `schemas.md` 3, 5.2 | |
| R5 | A reserva aceita apenas 1, 2 ou 3 diárias (iniciando com 1 diária quando nenhuma opção válida tiver sido definida); `total_amount = daily_rate × days_count` arredondado a duas casas decimais em USD | Explícita | RFS 6; RF-11 a RF-13; `schemas.md` 5.2 | |
| R6 | Todos os dados do cliente (nome completo, e-mail, passaporte e data de nascimento) são obrigatórios; se houver campos incorretos ou ausentes, os erros são indicados mantendo os demais dados para correção | Explícita | RFS 7.1, 7.3; RF-17, RF-19 | Mensagens exatas definidas apenas para campos vazios |
| R7 | O nome completo exige de 3 a 120 caracteres; o e-mail exige formato válido (armazenado em minúsculas); o passaporte exige de 5 a 30 caracteres em maiúsculas (armazenado em maiúsculas) | Explícita | RFS 7.1; RF-18, 4.2; `schemas.md` 4, 5.2 | Mensagens de erro específicas e comportamento de minúsculas na entrada não definidos |
| R8 | A data de nascimento (DD/MM/AAAA) deve ser válida e indicar 18 anos completos ou mais na data da reserva; se menor, a confirmação é recusada com aviso de idade mínima e os dados permanecem para correção | Explícita | RFS 7.1, 7.3; RF-18, RF-20, 4.2 | Mensagem definida: "O piloto precisa ter 18 anos ou mais." |
| R9 | Cada passaporte tem no máximo uma reserva confirmada por vez ("Um passaporte, uma reserva"); nova tentativa com passaporte já utilizado é recusada com mensagem explicativa e dados preservados | Explícita | RFS 7.3, 11; RF-21, RF-23; `schemas.md` 5.3 | Mensagem definida: "Este passaporte já possui uma locação." |
| R10 | Vale o momento da confirmação: se o rover for reservado ou o passaporte for usado enquanto o cliente preenchia os dados, a confirmação é recusada com explicação e dados preservados; confirmações duplicadas enquanto uma solicitação está em processamento também são impedidas | Explícita | RFS 11; RF-21 a RF-23, 4.1 | Mensagem para rover indisponível na confirmação não definida |
| R11 | A reserva confirmada registra a diária contratada no momento da reserva (preservada mesmo se o preço do rover mudar depois), não possui data de retirada/devolução nem expiração automática, tem pagamento apenas na retirada e gera recibo com data/hora, código (`LR-` + 6 alfanuméricos maiúsculos), modelo e código do rover, diárias, diária unitária, total, "Pagamento na retirada", nome (sob rótulo "Piloto") e passaporte — sem exibir e-mail nem data de nascimento | Explícita | RFS 1, 8; RF-24 a RF-29, 4.1; `schemas.md` 5.1, 5.3 | |
| R12 | O recibo permanece exibido por 60 segundos antes de voltar automaticamente ao início (sem sofrer interrupção pela contagem de inatividade); o cliente pode concluir imediatamente | Explícita | RFS 8.2; RF-30, RF-31, RF-44 | |
| R13 | Até a confirmação, o cliente pode voltar às etapas anteriores ou usar a opção "Recomeçar" (disponível na navegação, exceto no recibo) | Explícita | RFS 2, 3; RF-14, RF-40 | Preservação de dados ao voltar entre etapas não especificada |
| R14 | A consulta exige o preenchimento do termo de busca e localiza apenas reservas confirmadas com correspondência exata pelo passaporte completo ou código da reserva completo, ignorando maiúsculas/minúsculas e espaços nas pontas; se o termo coincidir com ambos, o código da reserva tem prioridade | Explícita | RFS 9; RF-32 a RF-35, 4.2 | |
| R15 | Quando encontra reserva confirmada, a consulta exibe o mesmo conteúdo do recibo (título "Sua reserva"), com opções de nova busca ou concluir; quando não encontra (inexistente ou cancelada), exibe "Nenhuma reserva encontrada" | Explícita | RFS 9, 11; RF-35 a RF-38 | |
| R16 | Uma reserva cancelada (`cancelled`) permanece no histórico, libera o rover e o passaporte para novas reservas e não aparece mais na consulta do cliente | Explícita | RFS 11, 12.3; 4.1; `schemas.md` 5.3 | Fluxo/ator de cancelamento ausente no totem |
| R17 | A contagem de inatividade não se aplica à tela inicial (nem ao recibo, que tem 60 s próprios); nas demais etapas, 75 s sem interação exibem "Ainda está aí?" com contagem de 15 s para continuar ou recomeçar; aos 90 s sem resposta, retorna ao início descartando a reserva não confirmada | Explícita | RFS 10; RF-41 a RF-44 | |
| R18 | Em caso de erro de sistema que impeça a continuidade, o totem explica o problema e oferece opções para tentar novamente ou voltar ao início | Explícita | RF-45 | |
| R19 | Ao confirmar que deseja continuar durante o aviso de inatividade, o cliente permanece na etapa atual com os dados preservados e a contagem de inatividade reiniciada | Derivável | RF-42, RFS 10 | Justificativa: a opção de retomar o atendimento existe em oposição ao descarte após 15 s |
| R20 | Ao optar por recomeçar durante a reserva, a reserva não confirmada é descartada e o cliente volta ao início sem indisponibilizar o rover | Derivável | RF-40, RF-43, RFS 3 | Justificativa: recomeçar equivale a encerrar voluntariamente a reserva ainda não confirmada |
| R21 | Na visualização da reserva consultada ("Sua reserva"), aplicam-se os mesmos 60 segundos de retorno automático ao início do recibo pós-reserva | Derivável | RFS 9.2; RF-36, RF-44 | Justificativa: RF-36 adota o mesmo componente de recibo e RFS 9.2 mostra "Voltando ao início em N s" |
| R22 | Comportamento quando todos os rovers cadastrados estão indisponíveis | A investigar | RFS 5; RF-08 | RF-09 cobre 0 rovers cadastrados, mas não há regra para todos ocupados |
| R23 | Mensagens de erro exatas e regras de borda para nome, e-mail, passaporte (conversão automática vs erro para minúsculas), data inexistente/futura e concorrência na confirmação | A investigar | RFS 7.1, 7.3; RF-19, RF-23 | |
| R24 | Contradição no formato monetário nos cards do catálogo (vírgula na imagem vs ponto e USD no texto) | A investigar | RFS 15; `schemas.md` 3, 4; 4.1 | |

### Ambiguidades, lacunas e contradições

- **Fluxo de cancelamento ausente:** R16 descreve os efeitos do status `cancelled`, mas nenhum dos três documentos define quem executa o cancelamento ou em qual interface ele ocorre.
- **Formato de valores monetários (contradição):** as capturas de tela em `rover-ride-rfs.md` mostram vírgula (`50,00`), enquanto `rover-ride-rfs.md` (texto), `requirements.md` e `schemas.md` usam `USD` com ponto e duas casas decimais (`USD 50.00`).
- **Mensagens de validação e impedimento incompletas:** não há texto exato definido para nome fora de 3–120 caracteres, e-mail inválido, passaporte fora de 5–30 caracteres, data inválida/futura, catálogo sem rovers (RF-09), rover indisponível ao abrir diárias (RF-15) e rover reservado concorrentemente na confirmação (RF-23).
- **Normalização de passaporte na reserva:** `requirements.md` (4.2) diz "tratado em letras maiúsculas" e `schemas.md` diz "armazenado em maiúsculas", mas não está explícito se o cliente que digita minúsculas tem o texto convertido automaticamente ou recebe erro de validação, nem se espaços nas pontas são removidos na reserva.
- **Preservação de estado na navegação:** RF-14 permite voltar ao catálogo e RFS 3 permite voltar às etapas anteriores, mas não define se os dados do formulário e a quantidade de diárias selecionada são preservados ao voltar.
- **Catálogo com todos os rovers ocupados:** RF-09 define aviso para 0 rovers cadastrados, mas quando todos os cadastrados estão "Indisponível" (RF-08), não está definido se há uma mensagem informativa adicional.
- **Reinício dos 60 s no recibo e na consulta:** RF-44 define que o recibo usa contagem própria de 60 s, mas não diz se toques na tela do recibo (sem ser concluir) reiniciam os 60 s, nem confirma se "Sua reserva" segue exatamente os mesmos 60 s sem o aviso de 75 s.

---

## 2. Mapa de variantes e técnicas aplicadas

| # | Variante (o que muda o comportamento) | Eixo | Regra de origem | Técnica | Decisão |
|---|---|---|---|---|---|
| V1 | Ordenação da frota por diária crescente e desempate por código do rover | Dados / Ordem | R1 | Fluxo principal / Ordenação | Cenário |
| V2 | Catálogo sem nenhum rover cadastrado | Estado inicial | R2 | Zero, um, muitos | Cenário (sem fixar mensagem: P2) |
| V3 | Todos os rovers cadastrados indisponíveis simultaneamente | Estado inicial | R22 | | Investigar (P1) |
| V4 | Tentativa de selecionar rover já reservado (indisponível no catálogo) | Estado inicial | R3 | Transição de estados (proibida) | Cenário |
| V5 | Rover escolhido deixa de estar disponível (ou não existe) ao avançar para escolha de diárias | Concorrência / Estado | R4 | Fluxo de exceção | Cenário |
| V6 | Exibição da ficha técnica (incluindo cabine pressurizada vs aberta) e seleção inicial de 1 diária | Dados | R4, R5 | Classes de equivalência | 2 Cenários distintos |
| V7 | Reserva completa com 1, 2 ou 3 diárias, conferindo cálculo e conteúdo do recibo (incluindo omissão de e-mail e nascimento) | Dados e valores | R5, R11 | Classes de equivalência + Valores-limite | Esquema (1, 2, 3 diárias) + Cenário de privacidade |
| V8 | Escolha de outro rover disponível sem empate de preço | Dados | R1, R5 | Classes de equivalência | Descartada: equivalente à classe válida de V7 |
| V9 | Voltar para alterar quantidade de diárias antes de confirmar | Ordem e repetição | R13, R5 | Fluxo alternativo | Cenário (preservação de formulário em P3) |
| V10 | Recomeçar a reserva antes da confirmação | Desfazer | R13, R20 | Transição de estados | Cenário (com hipótese) |
| V11 | Confirmação com dados obrigatórios ausentes | Dados | R6 | Classes de equivalência | Cenário |
| V12 | Nome completo nos limites válidos (3 e 120 caracteres) e fora dos limites (2 e 121 caracteres) | Dados | R7, R23 | Valores-limite | 2 Esquemas (válidos e inválidos sem fixar mensagem: P2) |
| V13 | Nome completo apenas com espaços ou caracteres especiais | Dados | R23 | | Investigar (P4) |
| V14 | E-mail em formato inválido | Dados | R7, R23 | Classes de equivalência | Cenário (sem fixar mensagem: P2) |
| V15 | Passaporte nos limites válidos (5 e 30 caracteres) e fora dos limites (4 e 31 caracteres) | Dados | R7, R23 | Valores-limite | 2 Esquemas (válidos e inválidos sem fixar mensagem: P2) |
| V16 | Passaporte digitado em minúsculas na reserva | Dados | R23 | | Investigar (P5) |
| V17 | Piloto com exatamente 18 anos completos vs 17 anos e 364 dias na data da reserva | Tempo / Dados | R8 | Valores-limite (inclusivo) | 2 Cenários distintos |
| V18 | Data de nascimento inexistente, futura ou muito antiga | Dados | R8, R23 | | Investigar (P2, P6) |
| V19 | Passaporte já vinculado a uma reserva confirmada | Histórico | R9 | Transição de estados (proibida) | Cenário |
| V20 | Múltiplos erros simultâneos na confirmação (validação de campo + regra de negócio) | Combinação | R6–R9 | Tabela de decisão | Investigar (P7) |
| V21 | Concorrência na confirmação: rover reservado por outro cliente OU passaporte usado por outro cliente | Concorrência | R10, R9 | Fluxo de exceção | 2 Cenários distintos |
| V22 | Duplo acionamento da confirmação durante o processamento da reserva | Ordem e repetição | R10 | Repetição / Idempotência | Cenário |
| V23 | Falha de sistema durante o atendimento | Falhas e exceções | R18 | Fluxo de exceção | Cenário |
| V24 | Preservação da diária contratada no recibo/consulta após reajuste do preço do rover | Antes e depois / Tempo | R11 | Antes e depois | Cenário |
| V25 | Concluir recibo manualmente vs aguardar 60 s automáticos (sem aviso de inatividade) | Tempo | R12, R17 | Fluxo alternativo + Tempo | 2 Cenários distintos |
| V26 | Consulta com termo vazio (impedida antes da busca) | Dados | R14 | Zero, um, muitos | Cenário |
| V27 | Consulta válida por código ou passaporte (exato, maiúsculas/minúsculas, espaços nas pontas) | Dados | R14, R15 | Tabela de decisão / Classes | Esquema |
| V28 | Consulta com termo parcial (não deve encontrar) | Dados | R14 | Classes de equivalência | Cenário |
| V29 | Consulta com termo coincidente com código de reserva e passaporte de reservas diferentes (prioriza código) | Combinação / Ambiguidade | R14 | Tabela de decisão | Cenário |
| V30 | Consulta sem reserva correspondente (inexistente ou cancelada) e liberação após cancelamento | Estado / Desfazer | R15, R16 | Transição de estados | 3 Cenários distintos |
| V31 | Inatividade: sem expiração na tela inicial; aviso aos 75 s; retomada ao continuar; descarte aos 90 s | Tempo | R17, R19 | Transição de estados | 4 Cenários distintos |
| V32 | Retorno automático de 60 s na consulta ("Sua reserva") | Tempo | R21 | Fluxo alternativo | Cenário (com hipótese) |

### Técnicas aplicadas

- **Classes de equivalência e Valores-limite:** aplicadas às diárias (1, 2, 3), ao tamanho de nome (2, 3, 120, 121), ao tamanho de passaporte (4, 5, 30, 31), ao formato de e-mail, à maioridade (exatamente 18 anos vs 17 anos e 364 dias) e à consulta (vazio, parcial, exato com variações de caixa/espaços, inexistente). V8 foi descartada por equivalência a V7.
- **Transição de estados:** aplicada ao ciclo de vida do rover (`Disponível` ↔ `Indisponível`), do passaporte (`Livre` ↔ `Com reserva confirmada`), da reserva (`confirmed` → `cancelled`) e da sessão de inatividade (`Tela inicial sem expiração`, `Em uso` → `Aviso 75 s` → `Descarte 90 s` ou `Retorno ao uso`).
- **Fluxos alternativos, exceções e heurísticas ("Antes e depois", "Repetição", "Zero, um, muitos"):** aplicados a catálogo vazio (zero rovers), indisponibilidade entre etapas, falha de sistema, idempotência no processamento da confirmação, reajuste de preço após reserva e navegação reversa.
- **Tabela de decisão:** aplicada às combinações da consulta (tipo de chave × normalização × prioridade código sobre passaporte) e avaliada para múltiplos erros simultâneos na confirmação (P7).

---

## 3. Especificação em Gherkin declarativo

**Funcionalidade:** Reserva e Consulta de Rovers no Totem  
**Como** cliente do Lunar Pass,  
**eu quero** consultar a frota, reservar um rover disponível e consultar minha reserva confirmada no totem da garagem,  
**para que** eu possa alugar um rover com pagamento na retirada sem precisar de login.

### Catálogo da frota e seleção do rover

**Cenário:** Ordenar a frota por valor crescente da diária e código em caso de empate  
*Regra de origem: R1*  
**Dado** que existem os rovers "Tycho XR" (RVR-001, USD 50.00), "Vega S" (RVR-002, USD 52.00) e "Nova X" (RVR-011, USD 52.00) cadastrados  
**Quando** eu acesso o catálogo da frota  
**Então** os rovers devem ser listados na ordem "Tycho XR", "Vega S" e "Nova X"

**Cenário:** Informar quando não há rovers cadastrados na frota  
*Regra de origem: R2*  
**Dado** que não existe nenhum rover cadastrado no sistema  
**Quando** eu acesso o catálogo da frota  
**Então** eu devo ser informado de que não há rovers cadastrados disponíveis para exibição

**Cenário:** Impedir a escolha de um rover já reservado  
*Regra de origem: R3*  
**Dado** que o rover Orion já possui uma reserva confirmada  
**Quando** eu acesso o catálogo da frota  
**Então** o rover Orion deve permanecer visível identificado como "Indisponível" e sem valor de diária  
**E** não deve ser possível selecioná-lo para uma nova reserva

**Cenário:** Tratar rover indisponível ou inexistente ao avançar para escolha de diárias  
*Regra de origem: R4*  
**Dado** que o rover Orion deixou de estar disponível antes de eu iniciar a definição das diárias  
**Quando** eu tento prosseguir para a escolha das diárias do rover Orion  
**Então** eu devo ser informado de que o rover não está mais disponível  
**E** devo poder retornar ao catálogo da frota ou ao início do atendimento

### Diárias, ficha técnica e fluxo principal de reserva

**Esquema do Cenário:** Apresentar ficha técnica completa do rover escolhido na etapa de diárias  
*Regra de origem: R4*  
**Dado** que o rover \<modelo\> está disponível com cabine \<cabine\>, \<lugares\> lugares, autonomia de \<autonomia\> e velocidade máxima de \<velocidade\>  
**Quando** eu seleciono o rover \<modelo\> para alugar  
**Então** devo visualizar sua descrição (quando existir) e sua ficha técnica com \<lugares\> lugares, autonomia de \<autonomia\>, cabine \<cabine\> e velocidade máxima de \<velocidade\>

**Exemplos:**

| modelo | cabine | lugares | autonomia | velocidade |
|---|---|---|---|---|
| Orion | Pressurizada | 4 | 180 km | 25 km/h |
| Tycho XR | Aberta | 1 | 70 km | 20 km/h |

**Cenário:** Iniciar a escolha das diárias com 1 diária selecionada por padrão  
*Regra de origem: R5*  
**Dado** que o rover Orion está disponível com diária de USD 60.00  
**Quando** eu seleciono o rover Orion para alugar  
**Então** a reserva deve iniciar com 1 diária selecionada  
**E** o valor total exibido deve ser USD 60.00

**Esquema do Cenário:** Confirmar reserva com diferentes quantidades de diárias  
*Regra de origem: R5, R11*  
**Dado** que o rover Orion está disponível com diária de USD 60.00  
**E** eu tenho dados válidos de cliente maior de 18 anos sem reserva confirmada  
**Quando** eu escolho o rover Orion por \<diarias\>  
**E** confirmo a reserva com meus dados  
**Então** minha reserva deve ser confirmada com pagamento na retirada  
**E** eu devo receber o recibo com a mensagem "Reserva confirmada!", data e hora, código da reserva, modelo e código do rover, \<diarias\>, diária de USD 60.00, total \<total\>, meu nome sob o rótulo "Piloto", meu passaporte e a orientação de apresentar o código na retirada  
**E** o rover Orion deve passar a constar como indisponível no catálogo

**Exemplos:**

| diarias | total |
|---|---|
| 1 diária | USD 60.00 |
| 2 diárias | USD 120.00 |
| 3 diárias | USD 180.00 |

**Cenário:** Omitir e-mail e data de nascimento no recibo da reserva  
*Regra de origem: R11*  
**Dado** que confirmei uma reserva com nome "Ana Souza", passaporte "BR1234567", e-mail "ana.souza@example.com" e nascimento "14/03/1990"  
**Quando** eu visualizo o recibo da reserva confirmada  
**Então** o recibo deve exibir "Ana Souza" e "BR1234567"  
**E** não deve exibir o e-mail nem a data de nascimento

### Navegação durante a reserva

**Cenário:** Alterar a quantidade de diárias antes de confirmar a reserva  
*Regra de origem: R13, R5*  
**Dado** que eu escolhi o rover Orion e avancei para informar meus dados com 1 diária  
**Quando** eu retorno à etapa de diárias e altero a escolha para 3 diárias  
**Então** o valor total da minha reserva deve ser atualizado para USD 180.00

**Cenário:** Recomeçar a reserva antes de confirmá-la  
*Regra de origem: R13, R20*  
*Hipótese a validar: recomeçar antes da confirmação descarta os dados em preenchimento e mantém o rover disponível*  
**Dado** que eu iniciei uma reserva para o rover Orion e ainda não a confirmei  
**Quando** eu opto por recomeçar o atendimento  
**Então** a reserva em andamento deve ser descartada  
**E** eu devo retornar ao início do totem  
**E** o rover Orion deve continuar disponível no catálogo

### Validação dos dados do cliente

**Contexto:**  
**Dado** que o rover Tycho XR está disponível  
**E** eu iniciei uma reserva para esse rover com 1 diária

**Cenário:** Recusar confirmação quando faltam dados obrigatórios  
*Regra de origem: R6*  
**Quando** eu tento confirmar a reserva informando apenas meu nome completo, sem informar e-mail, passaporte e data de nascimento  
**Então** a reserva não deve ser confirmada  
**E** eu devo ser informado da obrigatoriedade de informar o e-mail, o passaporte e a data de nascimento  
**E** o nome completo que eu já havia informado deve ser mantido para correção

**Esquema do Cenário:** Aceitar nomes completos nos limites de tamanho permitidos  
*Regra de origem: R7, R11*  
**Quando** eu confirmo a reserva informando um nome completo com \<tamanho\> e demais dados válidos  
**Então** minha reserva deve ser confirmada com sucesso

**Exemplos:**

| tamanho |
|---|
| 3 caracteres |
| 120 caracteres |

**Esquema do Cenário:** Recusar nomes completos fora dos limites de tamanho permitidos  
*Regra de origem: R7, R23*  
**Quando** eu tento confirmar a reserva informando um nome completo com \<tamanho\> e demais dados válidos  
**Então** a reserva não deve ser confirmada  
**E** eu devo ser informado de que o nome completo está fora do tamanho permitido  
**E** os demais dados preenchidos devem ser mantidos para correção

**Exemplos:**

| tamanho |
|---|
| 2 caracteres |
| 121 caracteres |

**Cenário:** Recusar confirmação com e-mail em formato inválido  
*Regra de origem: R7, R23*  
**Quando** eu tento confirmar a reserva informando um e-mail em formato inválido e demais dados válidos  
**Então** a reserva não deve ser confirmada  
**E** eu devo ser informado de que o e-mail é inválido  
**E** os demais dados preenchidos devem ser mantidos para correção

**Esquema do Cenário:** Aceitar passaportes nos limites de tamanho permitidos  
*Regra de origem: R7, R11*  
**Quando** eu confirmo a reserva informando um passaporte em maiúsculas com \<tamanho\> e demais dados válidos  
**Então** minha reserva deve ser confirmada com sucesso

**Exemplos:**

| tamanho |
|---|
| 5 caracteres |
| 30 caracteres |

**Esquema do Cenário:** Recusar passaportes fora dos limites de tamanho permitidos  
*Regra de origem: R7, R23*  
**Quando** eu tento confirmar a reserva informando um passaporte em maiúsculas com \<tamanho\> e demais dados válidos  
**Então** a reserva não deve ser confirmada  
**E** eu devo ser informado de que o passaporte está fora do tamanho permitido  
**E** os demais dados preenchidos devem ser mantidos para correção

**Exemplos:**

| tamanho |
|---|
| 4 caracteres |
| 31 caracteres |

**Cenário:** Aceitar cliente com exatamente 18 anos completos na data da reserva  
*Regra de origem: R8, R11*  
**Quando** eu confirmo a reserva informando uma data de nascimento em que completo exatamente 18 anos na data atual e demais dados válidos  
**Então** minha reserva deve ser confirmada com sucesso

**Cenário:** Recusar cliente menor de 18 anos na data da reserva  
*Regra de origem: R8*  
**Quando** eu tento confirmar a reserva informando uma data de nascimento em que completarei 18 anos apenas no dia seguinte à data atual e demais dados válidos  
**Então** a reserva não deve ser confirmada  
**E** eu devo ser informado de que "O piloto precisa ter 18 anos ou mais."  
**E** os demais dados preenchidos devem ser mantidos para correção

**Cenário:** Recusar reserva para passaporte que já possui locação confirmada  
*Regra de origem: R9*  
**Dado** que já existe uma reserva confirmada para o passaporte "BR1234567"  
**Quando** eu tento confirmar uma nova reserva para o rover Tycho XR utilizando o passaporte "BR1234567" e demais dados válidos  
**Então** a reserva não deve ser confirmada  
**E** eu devo ser informado de que "Este passaporte já possui uma locação."  
**E** os dados preenchidos devem ser mantidos para correção  
**E** o rover Tycho XR deve continuar disponível

### Concorrência, duplicidade e falhas na confirmação

**Cenário:** Recusar confirmação quando outro cliente reserva o mesmo rover antes da minha confirmação  
*Regra de origem: R10*  
**Dado** que eu iniciei a reserva do rover Orion e estou preenchendo meus dados  
**E** outro cliente confirmou a reserva do rover Orion antes de eu concluir  
**Quando** eu tento confirmar minha reserva com dados válidos  
**Então** minha reserva deve ser recusada com uma mensagem explicando que o rover não está mais disponível  
**E** meus dados preenchidos devem ser mantidos

**Cenário:** Recusar confirmação quando outro cliente utiliza o mesmo passaporte antes da minha confirmação  
*Regra de origem: R10, R9*  
**Dado** que eu iniciei a reserva do rover Tycho XR com o passaporte "BR1234567" e ainda não confirmei  
**E** outro cliente confirmou a reserva do rover Orion utilizando o passaporte "BR1234567"  
**Quando** eu tento confirmar minha reserva para o rover Tycho XR com o passaporte "BR1234567"  
**Então** minha reserva deve ser recusada com a informação de que "Este passaporte já possui uma locação."  
**E** meus dados preenchidos devem ser mantidos  
**E** o rover Tycho XR deve continuar disponível

**Cenário:** Impedir reservas duplicadas durante o processamento da confirmação  
*Regra de origem: R10*  
**Dado** que o rover Orion está disponível e eu preenchi dados válidos para a reserva  
**Quando** eu aciono a confirmação da reserva repetidas vezes enquanto a primeira solicitação ainda está em processamento  
**Então** apenas uma reserva deve ser confirmada para o rover Orion e para o meu passaporte

**Cenário:** Tratar falha de sistema durante a confirmação da reserva  
*Regra de origem: R18*  
**Dado** que o serviço de registro de reservas está indisponível  
**Quando** eu tento confirmar minha reserva com dados válidos  
**Então** eu devo ser informado do problema que impediu a continuidade  
**E** devo poder tentar novamente ou voltar ao início do atendimento

### Pós-confirmação, histórico de preço e tempo do recibo

**Cenário:** Concluir a visualização do recibo imediatamente  
*Regra de origem: R12*  
**Dado** que eu acabei de confirmar uma reserva e estou visualizando o recibo  
**Quando** eu concluo a visualização do recibo  
**Então** eu devo retornar imediatamente ao início do totem

**Cenário:** Retornar automaticamente ao início após 60 segundos no recibo sem aviso de inatividade  
*Regra de origem: R12, R17*  
**Dado** que eu acabei de confirmar uma reserva e estou visualizando o recibo  
**Quando** se passam 60 segundos sem que eu conclua manualmente  
**Então** o aviso de inatividade não deve ser exibido durante essa espera  
**E** o totem deve retornar automaticamente ao início ao completar os 60 segundos

**Cenário:** Preservar o valor da diária contratada após alteração de preço no catálogo  
*Regra de origem: R11, R15*  
**Dado** que eu confirmei uma reserva do rover Orion por 2 diárias quando sua diária era USD 60.00  
**E** posteriormente o valor da diária do rover Orion no catálogo foi alterado para USD 75.00  
**Quando** eu consulto minha reserva confirmada  
**Então** o recibo exibido deve manter o valor unitário contratado de USD 60.00 e o total de USD 120.00

### Consulta e efeitos do cancelamento

**Cenário:** Exigir o preenchimento do identificador antes de realizar a consulta  
*Regra de origem: R14*  
**Dado** que estou iniciando uma consulta de reserva  
**Quando** eu tento consultar sem informar passaporte nem código da reserva  
**Então** a consulta não deve ser realizada  
**E** eu devo ser orientado a preencher um identificador para buscar

**Esquema do Cenário:** Consultar reserva confirmada por código ou passaporte com correspondência exata  
*Regra de origem: R14, R15*  
**Dado** que existe uma reserva confirmada para o cliente "Ana Souza" com passaporte "BR1234567" e código "LR-5DX44R"  
**Quando** eu consulto a reserva informando \<identificador\>  
**Então** eu devo visualizar o recibo completo dessa reserva sob o título "Sua reserva"  
**E** sem exibir e-mail nem data de nascimento

**Exemplos:**

| identificador |
|---|
| "LR-5DX44R" |
| "lr-5dx44r" |
| "  LR-5DX44R  " |
| "BR1234567" |
| "br1234567" |
| "  br1234567  " |

**Cenário:** Não localizar reserva quando o identificador informado é parcial  
*Regra de origem: R14, R15*  
**Dado** que existe uma reserva confirmada com código "LR-5DX44R" e passaporte "BR1234567"  
**Quando** eu consulto a reserva informando apenas "5DX44R"  
**Então** nenhuma reserva deve ser exibida  
**E** eu devo ser informado de que "Nenhuma reserva encontrada"

**Cenário:** Priorizar o código da reserva quando o termo consultado coincide com um código e um passaporte  
*Regra de origem: R14, R15*  
**Dado** que existe uma reserva confirmada para "Ana Souza" com código "LR-ABC123" e passaporte "BR1111111"  
**E** existe outra reserva confirmada para "Bruno Lima" com código "LR-XYZ999" e passaporte "LR-ABC123"  
**Quando** eu consulto a reserva informando "LR-ABC123"  
**Então** eu devo visualizar a reserva de código "LR-ABC123" pertencente a "Ana Souza"

**Cenário:** Consultar código ou passaporte sem reserva confirmada  
*Regra de origem: R15*  
**Dado** que não existe reserva confirmada para o código "LR-000000"  
**Quando** eu consulto a reserva informando "LR-000000"  
**Então** nenhuma reserva deve ser exibida  
**E** eu devo ser informado de que "Nenhuma reserva encontrada"

**Cenário:** Retornar automaticamente ao início após 60 segundos na visualização da reserva consultada  
*Regra de origem: R21*  
*Hipótese a validar: a visualização da reserva encontrada na consulta segue o mesmo retorno automático em 60 segundos do recibo pós-reserva*  
**Dado** que eu consultei uma reserva confirmada e estou visualizando seus detalhes  
**Quando** se passam 60 segundos sem que eu conclua ou inicie uma nova busca  
**Então** o totem deve retornar automaticamente ao início

**Cenário:** Ocultar reserva cancelada na consulta  
*Regra de origem: R15, R16*  
**Dado** que a reserva de código "LR-5DX44R" do passaporte "BR1234567" para o rover Orion foi cancelada externamente  
**Quando** eu consulto a reserva informando "LR-5DX44R"  
**Então** eu devo ser informado de que "Nenhuma reserva encontrada"

**Cenário:** Liberar rover e passaporte após o cancelamento de uma reserva  
*Regra de origem: R16, R11*  
**Dado** que a reserva do passaporte "BR1234567" para o rover Orion foi cancelada externamente  
**Quando** eu realizo uma nova reserva para o rover Orion utilizando o passaporte "BR1234567" e dados válidos  
**Então** a nova reserva deve ser confirmada com sucesso

### Controle de inatividade

**Cenário:** Manter o início do totem disponível sem expiração por inatividade  
*Regra de origem: R17*  
**Dado** que estou no início do totem  
**Quando** se passam 90 segundos sem nenhuma interação minha  
**Então** nenhum aviso de inatividade deve ser exibido  
**E** eu devo permanecer no início do totem

**Cenário:** Exibir aviso de inatividade após 75 segundos sem interação durante a jornada  
*Regra de origem: R17*  
**Dado** que eu iniciei uma reserva fora do início do totem e estou na etapa de informar meus dados  
**Quando** se passam 75 segundos sem nenhuma interação minha com o totem  
**Então** devo ser questionado com o aviso "Ainda está aí?" e contagem regressiva de 15 segundos para continuar ou recomeçar

**Cenário:** Retomar a reserva ao confirmar continuidade durante o aviso de inatividade  
*Regra de origem: R17, R19*  
*Hipótese a validar: ao confirmar que deseja continuar no aviso de inatividade, os dados e a etapa atual são preservados e a contagem de 75 segundos reinicia*  
**Dado** que o aviso de inatividade foi exibido aos 75 segundos enquanto eu preenchia meus dados  
**Quando** eu confirmo que desejo continuar antes de completar 90 segundos  
**Então** o aviso deve encerrar  
**E** eu devo permanecer na etapa de dados com as informações já preenchidas preservadas

**Cenário:** Descartar reserva não confirmada após 90 segundos de inatividade  
*Regra de origem: R17*  
**Dado** que eu iniciei uma reserva para o rover Orion e o aviso de inatividade foi exibido aos 75 segundos  
**Quando** se completam 90 segundos totais sem interação minha  
**Então** a reserva não confirmada deve ser descartada  
**E** eu devo retornar ao início do totem  
**E** o rover Orion deve permanecer disponível no catálogo

---

### Rastreabilidade

| Regra | Cenários |
|---|---|
| R1 | Ordenar a frota por valor crescente da diária e código em caso de empate; Iniciar a escolha das diárias com 1 diária selecionada por padrão |
| R2 | Informar quando não há rovers cadastrados na frota |
| R3 | Impedir a escolha de um rover já reservado |
| R4 | Tratar rover indisponível ou inexistente ao avançar para escolha de diárias; Apresentar ficha técnica completa do rover escolhido na etapa de diárias |
| R5 | Iniciar a escolha das diárias com 1 diária selecionada por padrão; Confirmar reserva com diferentes quantidades de diárias; Alterar a quantidade de diárias antes de confirmar a reserva |
| R6 | Recusar confirmação quando faltam dados obrigatórios |
| R7 | Aceitar/Recusar nomes completos nos limites; Recusar e-mail em formato inválido; Aceitar/Recusar passaportes nos limites |
| R8 | Aceitar cliente com exatamente 18 anos completos; Recusar cliente menor de 18 anos |
| R9 | Recusar reserva para passaporte que já possui locação confirmada; Recusar confirmação quando outro cliente utiliza o mesmo passaporte |
| R10 | Recusar confirmação quando outro cliente reserva o mesmo rover; Recusar confirmação quando outro cliente utiliza o mesmo passaporte; Impedir reservas duplicadas durante o processamento da confirmação |
| R11 | Confirmar reserva com diferentes quantidades de diárias; Omitir e-mail e data de nascimento no recibo da reserva; Preservar o valor da diária contratada após alteração de preço no catálogo |
| R12 | Concluir a visualização do recibo imediatamente; Retornar automaticamente ao início após 60 segundos no recibo sem aviso de inatividade |
| R13 | Alterar a quantidade de diárias antes de confirmar a reserva; Recomeçar a reserva antes de confirmá-la |
| R14 | Exigir o preenchimento do identificador antes de realizar a consulta; Consultar reserva confirmada por código ou passaporte com correspondência exata; Não localizar reserva quando o identificador informado é parcial; Priorizar o código da reserva quando o termo consultado coincide com um código e um passaporte |
| R15 | Consultar código ou passaporte sem reserva confirmada; Ocultar reserva cancelada na consulta; Preservar o valor da diária contratada após alteração de preço no catálogo |
| R16 | Ocultar reserva cancelada na consulta; Liberar rover e passaporte após o cancelamento de uma reserva |
| R17 | Manter o início do totem disponível sem expiração por inatividade; Exibir aviso de inatividade após 75 segundos sem interação; Retomar a reserva ao confirmar continuidade; Descartar reserva não confirmada após 90 segundos de inatividade; Retornar automaticamente ao início após 60 segundos no recibo sem aviso de inatividade |
| R18 | Tratar falha de sistema durante a confirmação da reserva |
| R19 | Retomar a reserva ao confirmar continuidade durante o aviso de inatividade (hipótese) |
| R20 | Recomeçar a reserva antes de confirmá-la (hipótese) |
| R21 | Retornar automaticamente ao início após 60 segundos na visualização da reserva consultada (hipótese) |
| R22–R24 | Pendentes (ver Perguntas para os Três Amigos: P1, P2, P4, P5, P6, P12) |

---

## 4. Perguntas para os Três Amigos

| # | Pergunta ou hipótese | Tipo | Por que importa | Relacionado | Quem decide |
|---|---|---|---|---|---|
| P1 | O que deve ser exibido quando todos os rovers cadastrados na frota estiverem reservados (diferente de 0 rovers cadastrados em RF-09)? | Dúvida | Evita beco sem saída sem orientação ao cliente no totem quando toda a frota estiver locada | R22, V3 | Produto |
| P2 | Quais são as mensagens exatas para: catálogo sem rovers (RF-09), rover indisponível/inexistente na etapa de diárias (RF-15), nome fora de 3–120 caracteres, e-mail inválido, passaporte fora de 5–30 caracteres, data inválida/futura e busca vazia (RF-33)? | Dúvida | Os documentos definem o comportamento e textos apenas para campos vazios, menor de 18 anos, passaporte duplicado e busca sem resultado | R2, R4, R7, R14, R23 | Produto |
| P3 | Ao voltar de "Seus dados" para "Diárias" ou para o catálogo, os dados digitados no formulário e as diárias selecionadas são preservados ou apagados? E o botão "Recomeçar" nos passos 1 a 3 e na busca leva ao Início ou ao início do fluxo atual, com ou sem confirmação? | Dúvida | Define o comportamento de navegação reversa e descarte voluntário | R13, V9, V10 | Produto |
| P4 | O campo Nome completo aceita apenas espaços em branco, números ou símbolos? Espaços nas pontas são removidos antes de validar o mínimo de 3 caracteres e o máximo de 120? | Dúvida | Define critérios de equivalência e sanitização do nome | R7, R23, V13 | Produto e DEV |
| P5 | Na entrada de passaporte na reserva ("tratado em letras maiúsculas"), o totem converte minúsculas automaticamente ou rejeita com erro? Espaços nas pontas também são removidos na reserva e na checagem de duplicidade (como ocorre na consulta)? | Dúvida | Impacta validação positiva/negativa e prevenção de duplicidade | R7, R9, R23, V16 | Produto e DEV |
| P6 | Qual é o comportamento para datas de nascimento inexistentes (ex.: 31/02/1990), futuras ou muito antigas (ano mínimo)? Qual fuso horário define a "data da reserva" no cálculo de 18 anos e na exibição do `created_at` no recibo? | Dúvida | Evita divergência na fronteira de idade e no horário do recibo | R8, R11, R23, V18 | Produto e DEV |
| P7 | RF-19 indica múltiplos campos incorretos juntos; porém, se houver erro de formato/campo junto com regra de negócio (ex.: menor de 18 anos + passaporte já usado), exibe todos simultaneamente ou há prioridade? | Dúvida | Define o comportamento da validação combinada na confirmação | R6–R9, V20 | Produto e DEV |
| P8 | Na recusa por concorrência de rover na confirmação (RF-23 mantém os dados), qual é a mensagem exibida e o cliente permanece na etapa de dados ou é direcionado para escolher outro rover mantendo os dados? | Dúvida | Define a recuperação do fluxo quando o rover é tomado por outro cliente | R10, V21 | Produto |
| P9 | Ao acionar "Nova busca" na tela "Sua reserva", o identificador pesquisado anteriormente é limpo? | Dúvida | Define a ergonomia de repetição da consulta | R15 | Produto |
| P10 | Como e por quem ocorre o cancelamento de uma reserva (`cancelled`), já que não há fluxo de cancelamento no totem? | Dúvida | Sem saber a origem do cancelamento, a verificação ponta a ponta depende de ação externa/administrativa | R16 | Produto |
| P11 | O contador próprio de 60 segundos do recibo é fixo ou reinicia se houver toque na tela (sem ser concluir)? E a visualização da reserva consultada ("Sua reserva") também ignora o aviso de inatividade de 75 s usando apenas os 60 s próprios? | Dúvida | Evita conflito entre os dois temporizadores na consulta | R12, R17, R21 | Produto e DEV |
| P12 | **Contradição:** nos cards do catálogo, os valores usam vírgula (`50,00` nas imagens do RFS) ou ponto (`USD 50.00` no texto do RFS, `requirements.md` e `schemas.md`)? | Contradição | Garante consistência visual e de formatação monetária | R24 | Produto |
| P13 | **Hipóteses a validar:** (1) Ao confirmar que deseja continuar no aviso de inatividade, o cliente permanece na etapa atual com dados preservados e contador zerado (R19)? (2) Recomeçar antes de confirmar descarta a reserva sem ocupar o rover (R20)? (3) A visualização de "Sua reserva" retorna automaticamente ao início em 60 s como o recibo pós-reserva (R21)? | Hipótese | Sustentam cenários derivados presentes na especificação | R19, R20, R21 | Produto |
