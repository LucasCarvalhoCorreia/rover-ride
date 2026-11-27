# Funcionalidade: Dados do Cliente e Confirmação

**Origem:** `rover-ride-rfs.md` (Seções 3, 7, 11), `requirements.md` (RF-16 a RF-24, RF-40, RF-45, 4.1, 4.2) e `schemas.md` (Seções 4, 5)

**Funcionalidade:** Dados do Cliente e Confirmação  
**Como** cliente do Lunar Pass,  
**eu quero** informar meus dados válidos e confirmar a locação do rover escolhido,  
**para que** minha reserva seja registrada com pagamento na retirada.

## Fluxo principal e navegação

**Esquema do Cenário:** Confirmar reserva com diferentes quantidades de diárias  
*Regra de origem: R5, R11*  
**Dado** que o rover Orion está disponível com diária de USD 60.00  
**E** eu tenho dados válidos de cliente maior de 18 anos sem reserva confirmada  
**Quando** eu escolho o rover Orion por \<diarias\>  
**E** confirmo a reserva com meus dados  
**Então** minha reserva deve ser confirmada com pagamento na retirada  
**E** o rover Orion deve passar a constar como indisponível no catálogo

**Exemplos:**

| diarias |
|---|
| 1 diária |
| 2 diárias |
| 3 diárias |

**Cenário:** Recomeçar a reserva antes de confirmá-la  
*Regra de origem: R13, R20*  
*Hipótese a validar: recomeçar antes da confirmação descarta os dados em preenchimento e mantém o rover disponível*  
**Dado** que eu iniciei uma reserva para o rover Orion e ainda não a confirmei  
**Quando** eu opto por recomeçar o atendimento  
**Então** a reserva em andamento deve ser descartada  
**E** eu devo retornar ao início do totem  
**E** o rover Orion deve continuar disponível no catálogo

## Validação dos dados do cliente

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

## Concorrência, duplicidade e falhas

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

## Rastreabilidade

| Regra | Cenários |
|---|---|
| R5, R11 | Confirmar reserva com diferentes quantidades de diárias |
| R6 | Recusar confirmação quando faltam dados obrigatórios |
| R7 | Aceitar/Recusar nomes completos nos limites; Recusar e-mail em formato inválido; Aceitar/Recusar passaportes nos limites |
| R8 | Aceitar cliente com exatamente 18 anos completos; Recusar cliente menor de 18 anos |
| R9 | Recusar reserva para passaporte que já possui locação confirmada; Concorrência de passaporte |
| R10 | Concorrência de rover; Concorrência de passaporte; Impedir reservas duplicadas durante o processamento |
| R13, R20 | Recomeçar a reserva antes de confirmá-la (hipótese) |
| R18 | Tratar falha de sistema durante a confirmação da reserva |
| R23 | Pendente (ver [README.md](README.md): P2–P8) |
