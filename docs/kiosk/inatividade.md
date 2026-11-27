# Funcionalidade: Controle de Inatividade

**Origem:** `rover-ride-rfs.md` (Seção 10) e `requirements.md` (RF-41 a RF-44)

**Funcionalidade:** Controle de Inatividade  
**Como** responsável pela operação do totem Rover Ride,  
**eu quero** que atendimentos abandonados sejam encerrados automaticamente após um período de ociosidade,  
**para que** dados não confirmados sejam descartados e o totem fique disponível para o próximo cliente.

## Cenários

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

## Rastreabilidade

| Regra | Cenários |
|---|---|
| R17 | Manter o início disponível; Exibir aviso após 75 s; Retomar ao continuar; Descartar reserva após 90 s |
| R19 | Retomar a reserva ao confirmar continuidade durante o aviso de inatividade (hipótese) |
