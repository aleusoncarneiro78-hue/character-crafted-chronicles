import { createFileRoute } from "@tanstack/react-router";
import { ExplorerGame } from '@/components/ExplorerGame';
export const Route = createFileRoute("/_authenticated/play")({
  ssr: false,
  head: () => ({ meta: [
    { title: 'Missão J&F Explorer — Sua aventura no Instituto' },
    { name: 'description', content: 'Explore cinco ambientes do Instituto J&F em uma aventura 3D, encontre pistas e conquiste sua medalha.' },
    { property: 'og:title', content: 'Missão J&F Explorer — Sua aventura no Instituto' },
    { property: 'og:description', content: 'Um mapa perdido, cinco missões e um novo começo. Descubra o Instituto J&F.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  component: ExplorerGame,
});
