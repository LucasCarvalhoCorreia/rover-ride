# Funcionalidade: Escolha das Diárias

**Origem:** `rover-ride-rfs.md` (Seções 3 e 6), `requirements.md` (RF-10 a RF-15) e `schemas.md` (Seções 3, 5.2)

**Funcionalidade:** Escolha das Diárias  
**Como** cliente do Lunar Pass,  
**eu quero** conferir a ficha técnica do rover selecionado e escolher entre 1, 2 ou 3 diárias,  
**para que** eu saiba o valor total da locação antes de informar meus dados.

## Cenários

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

**Cenário:** Alterar a quantidade de diárias antes de confirmar a reserva  
*Regra de origem: R13, R5*  
**Dado** que eu escolhi o rover Orion e avancei para informar meus dados com 1 diária  
**Quando** eu retorno à etapa de diárias e altero a escolha para 3 diárias  
**Então** o valor total da minha reserva deve ser atualizado para USD 180.00

**Cenário:** Tratar rover indisponível ou inexistente ao avançar para escolha de diárias  
*Regra de origem: R4*  
**Dado** que o rover Orion deixou de estar disponível antes de eu iniciar a definição das diárias  
**Quando** eu tento prosseguir para a escolha das diárias do rover Orion  
**Então** eu devo ser informado de que o rover não está mais disponível  
**E** devo poder retornar ao catálogo da frota ou ao início do atendimento

## Rastreabilidade

| Regra | Cenários |
|---|---|
| R4 | Apresentar ficha técnica completa do rover escolhido; Tratar rover indisponível ou inexistente |
| R5 | Iniciar com 1 diária selecionada por padrão; Alterar a quantidade de diárias |
| R13 | Alterar a quantidade de diárias antes de confirmar a reserva |
