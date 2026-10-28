import { useEffect, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";

export const Route = createFileRoute("/auth")({
  ssr: false,
  head: () => ({ meta: [
    { title: 'Entrar — Missão J&F Explorer' },
    { name: 'description', content: 'Crie sua conta ou entre para salvar seu progresso na Missão J&F Explorer.' },
    { property: 'og:title', content: 'Entrar — Missão J&F Explorer' },
    { property: 'og:description', content: 'Salve seu progresso, personagem e medalhas.' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary' },
  ] }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { if (data.session) navigate({ to: '/play' }); });
    const { data } = supabase.auth.onAuthStateChange((e, s) => { if (e === 'SIGNED_IN' && s) navigate({ to: '/play' }); });
    return () => data.subscription.unsubscribe();
  }, [navigate]);

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setMsg(null);
    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { emailRedirectTo: window.location.origin, data: { display_name: name || undefined } } });
      if (error) setMsg(error.message);
      else if (!data.session) setMsg('Conta criada! Confira seu e-mail para confirmar o cadastro.');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setMsg('E-mail ou senha incorretos.');
    }
    setBusy(false);
  }

  async function google() {
    const r = await lovable.auth.signInWithOAuth('google', { redirect_uri: window.location.origin });
    if (r.error) setMsg('Não foi possível entrar com o Google.');
  }

  return <div className="auth-page">
    <section className="auth-card">
      <span className="brand-mark">J&F<span>EX</span></span>
      <h1>Missão J&F <span>Explorer</span></h1>
      <p>{mode === 'login' ? 'Entre para continuar de onde parou.' : 'Crie sua conta e salve sua aventura.'}</p>
      <form onSubmit={submit}>
        {mode === 'signup' && <label>Nome<input value={name} onChange={e => setName(e.target.value)} placeholder="Como quer ser chamado" /></label>}
        <label>E-mail<input type="email" required value={email} onChange={e => setEmail(e.target.value)} /></label>
        <label>Senha<input type="password" required minLength={6} value={password} onChange={e => setPassword(e.target.value)} /></label>
        <Button type="submit" disabled={busy}>{mode === 'login' ? 'Entrar' : 'Criar conta'}</Button>
      </form>
      <Button variant="outline" onClick={google}>Continuar com Google</Button>
      {msg && <p className="auth-msg">{msg}</p>}
      <Button variant="ghost" onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setMsg(null); }}>
        {mode === 'login' ? 'Ainda não tem conta? Cadastre-se' : 'Já tem conta? Entrar'}
      </Button>
    </section>
  </div>;
}
