import { createFileRoute, redirect } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/")({
  ssr: false,
  head: () => ({ meta: [
    { title: 'Missão J&F Explorer — Entrar na aventura' },
    { name: 'description', content: 'Entre na sua conta e continue sua aventura 3D pelo Instituto J&F.' },
    { property: 'og:title', content: 'Missão J&F Explorer — Entrar na aventura' },
    { property: 'og:description', content: 'Cinco missões, parkour 3D e medalhas no Instituto J&F.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
  ] }),
  beforeLoad: async () => {
    const { data } = await supabase.auth.getSession();
    throw redirect({ to: data.session ? "/play" : "/auth" });
  },
});
