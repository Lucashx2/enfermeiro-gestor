"use client";

import { FormEvent, useEffect, useState } from "react";
import { ArrowRight, Eye, EyeOff, Loader2, LockKeyhole } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [mostrarSenha, setMostrarSenha] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) router.replace("/admin");
    });
  }, [router]);

  async function entrar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErro("");
    setCarregando(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password: senha });
    setCarregando(false);

    if (error) {
      setErro("Não foi possível entrar. Confira seu e-mail e senha.");
      return;
    }
    router.replace("/admin");
  }

  return (
    <main className="min-h-screen bg-[#f5f8f7] px-5 flex items-center justify-center">
      <section className="w-full max-w-[440px] rounded-[28px] border border-emerald-100 bg-white p-7 sm:p-10 shadow-[0_20px_60px_-28px_rgba(15,118,110,.35)]">
        <div className="mb-9">
          <Image src="/icon.png" alt="Enfermeiro Gestor" width={72} height={72} className="mb-6 h-[72px] w-[72px] rounded-2xl object-cover shadow-lg shadow-teal-950/30" priority />
          <p className="mb-2 text-sm font-semibold text-teal-700">GESTÃO DE PLANTÕES</p>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Enfermeiro Gestor</h1>
          <p className="mt-2 text-sm leading-6 text-slate-500">Acesse para registrar os plantões e acompanhar seus valores.</p>
        </div>

        <form onSubmit={entrar} className="space-y-5">
          {erro && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{erro}</p>}
          <label className="block text-sm font-semibold text-slate-700">E-mail
            <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required placeholder="voce@exemplo.com" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-50" />
          </label>
          <label className="block text-sm font-semibold text-slate-700">Senha
            <span className="relative mt-2 block"><input value={senha} onChange={(e) => setSenha(e.target.value)} type={mostrarSenha ? "text" : "password"} autoComplete="current-password" required placeholder="Sua senha" className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 text-slate-900 outline-none transition focus:border-teal-600 focus:ring-4 focus:ring-teal-50" /><button type="button" onClick={() => setMostrarSenha((visivel) => !visivel)} aria-label={mostrarSenha ? "Ocultar senha" : "Mostrar senha"} className="absolute inset-y-0 right-0 flex w-12 items-center justify-center text-slate-400 hover:text-teal-700">{mostrarSenha ? <EyeOff size={19} /> : <Eye size={19} />}</button></span>
          </label>
          <button disabled={carregando} className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-700 py-3.5 font-semibold text-white transition hover:bg-teal-800 disabled:opacity-60">
            {carregando ? <Loader2 className="animate-spin" size={19} /> : <>Entrar <ArrowRight size={19} /></>}
          </button>
        </form>
        <p className="mt-5 text-center text-sm text-slate-500">Ainda não tem acesso? <Link href="/registro" className="font-semibold text-teal-700 hover:text-teal-800">Criar minha conta</Link></p>
        <p className="mt-6 flex items-center justify-center gap-2 text-xs text-slate-400"><LockKeyhole size={13} /> Acesso protegido e dados privados.</p>
      </section>
    </main>
  );
}
