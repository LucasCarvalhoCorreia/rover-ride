# Funcionalidade: Catálogo da Frota

**Origem:** `rover-ride-rfs.md` (Seções 4 e 5), `requirements.md` (RF-04 a RF-09) e `schemas.md` (Seções 3, 5.1, 5.3)

**Funcionalidade:** Catálogo da Frota  
**Como** cliente do Lunar Pass,  
**eu quero** visualizar todos os rovers cadastrados em ordem de preço e disponibilidade,  
**para que** eu possa escolher um rover disponível para alugar.

## Cenários

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

## Rastreabilidade

| Regra | Cenários |
|---|---|
| R1 | Ordenar a frota por valor crescente da diária e código em caso de empate |
| R2 | Informar quando não há rovers cadastrados na frota |
| R3 | Impedir a escolha de um rover já reservado |
| R22, R24 | Pendentes (ver [README.md](README.md): P1, P2, P12) |
