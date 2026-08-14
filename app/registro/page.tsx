"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { Activity, ArrowLeft, CheckCircle2, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabase";

export default function Registro() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmacao, setConfirmacao] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/admin");
    });
  }, [router]);

  async function registrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro(""); setSucesso("");
    if (senha.length < 8) { setErro("Escolha uma senha com pelo menos 8 caracteres."); return; }
    if (senha !== confirmacao) { setErro("As senhas não são iguais."); return; }
    setCarregando(true);
    // Sem URL de redirecionamento dinâmica: o Supabase usa a Site URL definida
    // no painel, evitando bloqueio quando o app é aberto em outra porta local.
    const { data, error } = await supabase.auth.signUp({ email, password: senha });
    setCarregando(false);
    if (error) { setErro(mensagemDeRegistro(error.code, error.message)); return; }
    if (data.session) { router.replace("/admin"); return; }
    setSucesso("Conta criada. Confira seu e-mail para confirmar o acesso antes de entrar.");
  }

  return <main className="min-h-screen bg-[#f5f8f7] px-5 py-10 flex items-center justify-center"><section className="w-full max-w-[460px] rounded-[28px] border border-emerald-100 bg-white p-7 sm:p-10 shadow-[0_20px_60px_-28px_rgba(15,118,110,.35)]"><Link href="/" className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-teal-700"><ArrowLeft size={16} /> Voltar para entrar</Link><div className="mb-8"><div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-teal-700"><Activity className="text-white" size={28} /></div><p className="mb-2 text-sm font-semibold text-teal-700">PRIMEIRO ACESSO</p><h1 className="text-3xl font-bold tracking-tight text-slate-900">Crie sua conta</h1><p className="mt-2 text-sm leading-6 text-slate-500">Use um e-mail que só você controla. Seus dados de plantões ficarão protegidos nesta conta.</p></div><form onSubmit={registrar} className="space-y-5">{erro && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}{sucesso && <p role="status" className="flex gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700"><CheckCircle2 className="shrink-0" size={18} />{sucesso}</p>}<label className="block text-sm font-semibold text-slate-700">E-mail<input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required placeholder="voce@exemplo.com" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-50" /></label><Senha campo="Senha" valor={senha} alterar={setSenha} mostrar={mostrarSenha} alternar={() => setMostrarSenha((visivel) => !visivel)} placeholder="Mínimo de 8 caracteres" /><Senha campo="Confirmar senha" valor={confirmacao} alterar={setConfirmacao} mostrar={mostrarSenha} alternar={() => setMostrarSenha((visivel) => !visivel)} placeholder="Repita sua senha" /><button disabled={carregando || Boolean(sucesso)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 py-3.5 font-semibold text-white hover:bg-teal-800 disabled:opacity-60">{carregando && <Loader2 className="animate-spin" size={19} />}{carregando ? "Criando conta..." : "Criar conta"}</button></form><p className="mt-6 flex justify-center gap-2 text-xs text-slate-400"><LockKeyhole size={13} /> Senhas nunca ficam visíveis no sistema.</p></section></main>;
}

function Senha({ campo, valor, alterar, mostrar, alternar, placeholder }: { campo: string; valor: string; alterar: (valor: string) => void; mostrar: boolean; alternar: () => void; placeholder: string }) { return <label className="block text-sm font-semibold text-slate-700">{campo}<span className="relative mt-2 block"><input value={valor} onChange={(e) => alterar(e.target.value)} type={mostrar ? "text" : "password"} autoComplete="new-password" minLength={8} required placeholder={placeholder} className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-50" /><button type="button" onClick={alternar} aria-label={mostrar ? "Ocultar senhas" : "Mostrar senhas"} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 hover:text-teal-700">{mostrar ? <EyeOff size={19} /> : <Eye size={19} />}</button></span></label>; }

function mensagemDeRegistro(codigo: string | undefined, detalhe: string) {
  if (codigo === "email_exists" || detalhe.toLowerCase().includes("already registered")) return "Este e-mail já está cadastrado. Tente entrar ou recupere sua senha.";
  if (codigo === "signup_disabled" || detalhe.toLowerCase().includes("signups not allowed")) return "O cadastro está desativado no Supabase. Ative-o em Authentication > Providers > Email.";
  if (codigo === "email_provider_disabled") return "O login por e-mail está desativado no Supabase. Ative-o em Authentication > Providers > Email.";
  if (codigo === "weak_password") return "Escolha uma senha mais forte, com pelo menos 8 caracteres.";
  if (detalhe.toLowerCase().includes("rate limit")) return "Muitas tentativas recentes. Aguarde alguns minutos e tente novamente.";
  return "Não foi possível criar a conta agora. Verifique se o cadastro por e-mail está ativo no Supabase.";
}
