"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

export default function Modal({ aberto, titulo, descricao, fechar, children }: { aberto: boolean; titulo: string; descricao?: string; fechar: () => void; children: ReactNode }) {
  useEffect(() => {
    if (!aberto) return;
    const tecla = (event: KeyboardEvent) => { if (event.key === "Escape") fechar(); };
    window.addEventListener("keydown", tecla);
    return () => window.removeEventListener("keydown", tecla);
  }, [aberto, fechar]);
  if (!aberto) return null;
  return <div role="dialog" aria-modal="true" aria-labelledby="modal-titulo" className="fixed inset-0 z-50 flex items-end justify-center bg-slate-950/45 p-0 sm:items-center sm:p-5" onMouseDown={fechar}><section className="max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-t-3xl bg-white p-6 shadow-2xl sm:rounded-3xl sm:p-8" onMouseDown={(event) => event.stopPropagation()}><div className="mb-6 flex items-start justify-between gap-4"><div><h2 id="modal-titulo" className="text-xl font-bold text-slate-900">{titulo}</h2>{descricao && <p className="mt-1 text-sm leading-6 text-slate-500">{descricao}</p>}</div><button onClick={fechar} aria-label="Fechar" className="rounded-xl p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button></div>{children}</section></div>;
}
