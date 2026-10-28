# Parkour entre prédios + 5º personagem

## O que o jogador verá
- Ao clicar "Explorar" a partir da 2ª missão (ex.: Recepção → Biblioteca), abre um percurso 3D de plataformas flutuantes.
- O estudante escolhido corre e pula até o anel dourado; ao chegar, entra no lugar e abre a pista + quiz.
- Controles: W/A/S/D e setas para mover; Espaço e W também pulam. Botões na tela para celular.
- Cair volta ao início; após 3 quedas aparece "Pular parkour".
- Cada percurso fica um pouco mais longo que o anterior.
- Novo personagem (imagem enviada) aparece no seletor, no mapa e no parkour, com fundo removido como os outros.

## Detalhes técnicos
- Recortar fundo branco de image-8.png, subir via lovable-assets como student-4.asset.json e adicionar "Explorador 05" em `characters` (src/lib/explorer.ts).
- ParkourRun: mapear W também para `jump` (além de forward), Espaço = jump; manter setas.
- ExplorerGame: `visit(id)` para id > 0 abre `<ParkourRun target={id}>`; `onComplete` define `destination` (animação de chegada existente → quiz). Primeira missão vai direto.
- Ajustar grade do seletor para 5 cartões (styles.css).
- Atualizar teste em explorer.test.ts (5 personagens) e verificar com Playwright.
