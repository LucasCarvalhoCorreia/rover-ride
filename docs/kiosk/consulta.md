# Funcionalidade: Consulta de Reserva

**Origem:** `rover-ride-rfs.md` (Seções 9, 11, 12.3), `requirements.md` (RF-32 a RF-38, 4.1, 4.2) e `schemas.md` (Seções 5.2, 5.3)

**Funcionalidade:** Consulta de Reserva  
**Como** cliente do Lunar Pass,  
**eu quero** localizar minha reserva confirmada pelo passaporte ou pelo código da reserva,  
**para que** eu possa conferir o recibo e apresentar o código na retirada do rover.

## Cenários

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

**Cenário:** Preservar o valor da diária contratada após alteração de preço no catálogo  
*Regra de origem: R11, R15*  
**Dado** que eu confirmei uma reserva do rover Orion por 2 diárias quando sua diária era USD 60.00  
**E** posteriormente o valor da diária do rover Orion no catálogo foi alterado para USD 75.00  
**Quando** eu consulto minha reserva confirmada  
**Então** o recibo exibido deve manter o valor unitário contratado de USD 60.00 e o total de USD 120.00

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

## Rastreabilidade

| Regra | Cenários |
|---|---|
| R11, R15 | Preservar o valor da diária contratada após alteração de preço no catálogo |
| R14 | Exigir preenchimento; Consultar por código ou passaporte; Busca parcial; Prioridade do código sobre passaporte |
| R15 | Consultar sem reserva confirmada; Ocultar reserva cancelada |
| R16 | Ocultar reserva cancelada; Liberar rover e passaporte após cancelamento |
| R21 | Retornar automaticamente ao início após 60 segundos na visualização da reserva consultada (hipótese) |
