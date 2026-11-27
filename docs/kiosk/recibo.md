# Funcionalidade: Recibo da Reserva

**Origem:** `rover-ride-rfs.md` (Seção 8), `requirements.md` (RF-24 a RF-31, RF-44, 4.1) e `schemas.md` (Seções 5.1, 5.3)

**Funcionalidade:** Recibo da Reserva  
**Como** cliente do Lunar Pass,  
**eu quero** visualizar o comprovante completo da minha reserva confirmada e encerrar o atendimento,  
**para que** eu tenha o código de confirmação para apresentar na retirada do rover.

## Cenários

**Esquema do Cenário:** Exibir recibo completo com totais conforme a quantidade de diárias  
*Regra de origem: R5, R11*  
**Dado** que o rover Orion está disponível com diária de USD 60.00  
**Quando** eu confirmo a reserva do rover Orion por \<diarias\> com dados válidos  
**Então** devo receber o recibo com a mensagem "Reserva confirmada!", data e hora, código da reserva, modelo e código do rover, \<diarias\>, diária de USD 60.00, total \<total\>, meu nome sob o rótulo "Piloto", meu passaporte, "Pagamento na retirada" e a orientação de apresentar o código na retirada

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

## Rastreabilidade

| Regra | Cenários |
|---|---|
| R5, R11 | Exibir recibo completo com totais conforme a quantidade de diárias; Omitir e-mail e data de nascimento no recibo |
| R12 | Concluir a visualização do recibo imediatamente; Retornar automaticamente ao início após 60 segundos |
| R17 | Retornar automaticamente ao início após 60 segundos no recibo sem aviso de inatividade |
