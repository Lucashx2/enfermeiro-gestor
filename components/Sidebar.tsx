"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { CalendarPlus, FileText, LayoutDashboard, LogOut, Settings, Users } from "lucide-react";
import { supabase } from "../lib/supabase";

const itens = [
  { href: "/admin", label: "Visão geral", icon: LayoutDashboard },
  { href: "/admin/turnos", label: "Registrar plantão", icon: CalendarPlus },
  { href: "/admin/profissionais", label: "Profissionais", icon: Users },
  { href: "/admin/configuracoes", label: "Configurações", icon: Settings },
  { href: "/admin/relatorios", label: "Relatórios", icon: FileText },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function sair() {
    await supabase.auth.signOut();
    router.replace("/");
  }

  return (
    <aside className="flex w-full shrink-0 flex-col bg-slate-950 px-4 py-5 text-white lg:fixed lg:inset-y-0 lg:left-0 lg:w-72">
      <div className="mb-7 flex items-center gap-3 px-3 lg:mb-10">
        <Image src="/icon.png" alt="Enfermeiro Gestor" width={48} height={48} className="h-12 w-12 rounded-xl object-cover" priority />
        <div><p className="font-bold leading-tight">Enfermeiro Gestor</p><p className="text-xs text-slate-400">Plantões · Finanças · Equipe</p></div>
      </div>
      <nav className="flex gap-2 overflow-x-auto lg:block lg:space-y-2">
        {itens.map(({ href, label, icon: Icon }) => {
          const ativo = href === "/admin" ? pathname === href : pathname.startsWith(href);
          return <Link key={href} href={href} className={`flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition ${ativo ? "bg-teal-600 text-white shadow-lg shadow-teal-950/30" : "text-slate-400 hover:bg-white/5 hover:text-white"}`}><Icon size={19} />{label}</Link>;
        })}
      </nav>
      <div className="mt-5 border-t border-white/10 pt-4 lg:mt-auto">
        <button onClick={sair} className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"><LogOut size={19} />Sair com segurança</button>
      </div>
    </aside>
  );
}
