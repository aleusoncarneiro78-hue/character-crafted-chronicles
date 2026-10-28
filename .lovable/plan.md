# Parkour entre prédios, 5º personagem e contas de aluno

## O que o jogador verá
- Ao clicar "Explorar" a partir da 2ª missão (ex.: Recepção → Biblioteca), abre um percurso 3D de plataformas flutuantes.
- O estudante escolhido corre e pula até o anel dourado; ao chegar, entra no lugar e abre a pista + quiz.
- Controles: W/A/S/D e setas para mover; Espaço e W também pulam. Botões na tela para celular.
- Cair volta ao início; após 3 quedas aparece "Pular parkour".
- Cada percurso fica um pouco mais longo que o anterior.
- Novo personagem (imagem enviada) aparece no seletor, no mapa e no parkour, com fundo removido como os outros.
- Página de entrada com cadastro e login (e-mail e senha, ou conta Google). O jogo só abre para alunos conectados.
- Para cada aluno ficam salvos: nome de exibição, personagem escolhido, áreas concluídas, pontos e medalhas obtidas. Ao voltar, ele continua de onde parou.
- Botão "Sair" no topo, mostrando o nome do aluno.

## Detalhes técnicos
- Recortar fundo branco de image-8.png, subir via lovable-assets como student-4.asset.json e adicionar "Explorador 05" em `characters` (src/lib/explorer.ts).
- ParkourRun: W mapeado para `forward` e `jump`; Espaço = jump; setas mantidas.
- ExplorerGame: `visit(id)` para id > 0 abre `<ParkourRun target={id}>`; `onComplete` define `destination` (animação de chegada existente leva ao quiz). Primeira missão vai direto.
- Ativar Lovable Cloud; habilitar e-mail/senha e Google.
- Tabela `profiles` (id → auth.users, display_name, character, completed int[], score, medals text[], updated_at) com GRANTs, RLS só do próprio usuário e trigger que cria o perfil no cadastro.
- Rota pública `/auth` (cadastro/login); jogo movido para `_authenticated` com ssr:false; `/` redireciona conforme sessão.
- Carregar o perfil ao abrir o jogo e salvar após cada missão concluída, troca de personagem e medalha final.
- Ajustar seletor para 5 cartões; atualizar teste (5 personagens) e verificar com Playwright conectado.
