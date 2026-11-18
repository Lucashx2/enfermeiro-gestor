"use client";
/* eslint-disable react-hooks/set-state-in-effect */

import { FormEvent, useEffect, useMemo, useState } from "react";
import { CalendarDays, Pencil, Plus, Trash2 } from "lucide-react";
import Modal from "../../../components/Modal";
import { supabase } from "../../../lib/supabase";
import { moeda, valorParaNumero } from "../../../lib/finance";
import { hojeISO, periodoInicial } from "../../../lib/periodo";

type Prof = { id: string; nome: string; categoria: string };
type Regra = { percentual_nota: number | string; valor_samu_tecnico: number | string; repasse_tecnico_diurno: number | string; repasse_tecnico_noturno: number | string };
type Turno = { id: string; profissional_id: string; data_plantao: string; periodo: string; unidade: string | null; status: string; valor_bruto: number | string; profissionais: { nome: string; categoria: string } | null };
type Formulario = { profissional_id: string; data_plantao: string; periodo: string; unidade: string; status: string; valor: string; observacoes: string };

const regraPadrao: Regra = { percentual_nota: 6, valor_samu_tecnico: 420, repasse_tecnico_diurno: 300, repasse_tecnico_noturno: 350 };
const formularioVazio = (): Formulario => ({ profissional_id: "", data_plantao: hojeISO(), periodo: "Diurno", unidade: "SAMU", status: "previsto", valor: "", observacoes: "" });

export default function Turnos() {
  const [profs, setProfs] = useState<Prof[]>([]);
  const [regra, setRegra] = useState<Regra>(regraPadrao);
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [form, setForm] = useState<Formulario>(formularioVazio());
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [modal, setModal] = useState(false);
  const [erro, setErro] = useState("");
  const [filtro, setFiltro] = useState("mes");
  const [inicio, setInicio] = useState(periodoInicial("mes"));
  const [fim, setFim] = useState(hojeISO());
  const [status, setStatus] = useState("Todos");

  async function carregar() {
    const [p, r, t] = await Promise.all([
      supabase.from("profissionais").select("id,nome,categoria").order("nome"),
      supabase.from("regras_repasses").select("percentual_nota,valor_samu_tecnico,repasse_tecnico_diurno,repasse_tecnico_noturno").maybeSingle(),
      supabase.from("turnos").select("id,profissional_id,data_plantao,periodo,unidade,status,valor_bruto,profissionais(nome,categoria)").order("data_plantao", { ascending: false }),
    ]);
    if (p.data) setProfs(p.data as Prof[]);
    if (r.data) setRegra(r.data);
    if (t.data) setTurnos(t.data as unknown as Turno[]);
  }

  useEffect(() => { void carregar(); }, []);

  function calcular(recebido: number, categoria: string | undefined, periodo: string) {
    const tecnico = categoria === "Técnico de enfermagem";
    const valorCalculado = tecnico ? Number(regra.valor_samu_tecnico) : recebido;
    const nota = valorCalculado * Number(regra.percentual_nota) / 100;
    const repasse = tecnico ? (periodo === "Noturno" ? Number(regra.repasse_tecnico_noturno) : Number(regra.repasse_tecnico_diurno)) : recebido - nota;
    return { recebido: valorCalculado, nota, repasse, lucro: valorCalculado - nota - repasse };
  }

  const prof = profs.find(p => p.id === form.profissional_id);
  const tecnico = prof?.categoria === "Técnico de enfermagem";
  const recebido = tecnico ? Number(regra.valor_samu_tecnico) : valorParaNumero(form.valor);
  const resumo = calcular(recebido, prof?.categoria, form.periodo);

  function selecionar(id: string) {
    const selecionado = profs.find(p => p.id === id);
    setForm({ ...form, profissional_id: id, valor: selecionado?.categoria === "Técnico de enfermagem" ? String(regra.valor_samu_tecnico) : "" });
  }

  function mudarFiltro(valor: string) {
    setFiltro(valor);
    const hoje = hojeISO();
    if (valor === "hoje") { setInicio(hoje); setFim(hoje); }
    else if (valor === "semana") { setInicio(periodoInicial("semana")); setFim(hoje); }
    else if (valor === "mes") { setInicio(periodoInicial("mes")); setFim(hoje); }
  }

  function abrirNovo() { setErro(""); setEditandoId(null); setForm(formularioVazio()); setModal(true); }

  function abrirEdicao(turno: Turno) {
    setErro("");
    setEditandoId(turno.id);
    setForm({ profissional_id: turno.profissional_id, data_plantao: turno.data_plantao, periodo: turno.periodo, unidade: turno.unidade ?? "SAMU", status: turno.status, valor: String(turno.valor_bruto), observacoes: "" });
    setModal(true);
  }

  async function salvar(evento: FormEvent) {
    evento.preventDefault();
    if (!form.profissional_id) { setErro("Selecione o profissional."); return; }
    setErro("");
    const dados = { profissional_id: form.profissional_id, data_plantao: form.data_plantao, tipo: "Plantão SAMU", periodo: form.periodo, unidade: form.unidade || "SAMU", status: form.status, valor_bruto: recebido };
    const resultado = editandoId ? await supabase.from("turnos").update(dados).eq("id", editandoId) : await supabase.from("turnos").insert({ ...dados, observacoes: form.observacoes || null });
    if (resultado.error) {
      setErro(resultado.error.code === "23505" ? "Já existe plantão ativo para esta pessoa, data e período." : `Não foi possível ${editandoId ? "atualizar" : "salvar"} o plantão.`);
      return;
    }
    setModal(false); setEditandoId(null); setForm(formularioVazio()); await carregar();
  }

  async function excluir(turno: Turno) {
    const nome = turno.profissionais?.nome ?? "este profissional";
    if (!window.confirm(`Excluir o plantão de ${nome} em ${turno.data_plantao.split("-").reverse().join("/")}?`)) return;
    const { error } = await supabase.from("turnos").delete().eq("id", turno.id);
    if (error) { window.alert("Não foi possível excluir o plantão."); return; }
    await carregar();
  }

  const lista = useMemo(() => turnos.filter(t => t.data_plantao >= inicio && t.data_plantao <= fim && (status === "Todos" || t.status === status)), [turnos, inicio, fim, status]);

  return <>
    <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-semibold text-teal-700">PLANTÕES</p><h1 className="mt-1 text-3xl font-bold">Registro e conferência</h1><p className="mt-2 text-slate-500">Técnicos seguem a regra do SAMU; enfermeiros recebem o plantão menos a nota.</p></div><button onClick={abrirNovo} className="rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white"><Plus className="mr-2 inline" size={18}/>Registrar plantão</button></header>
    <section className="overflow-hidden rounded-2xl border bg-white"><div className="border-b p-5"><div className="flex items-center gap-2"><CalendarDays className="text-teal-700"/><b>Espelho de lançamentos</b></div><div className="mt-4 grid gap-3 md:grid-cols-2"><S l="Período" v={filtro} c={mudarFiltro}><option value="hoje">Hoje</option><option value="semana">Esta semana</option><option value="mes">Este mês</option><option value="personalizado">Escolher datas</option></S><S l="Status" v={status} c={setStatus}><option>Todos</option><option value="previsto">Previstos</option><option value="realizado">Realizados</option><option value="pago">Pagos</option><option value="cancelado">Cancelados</option></S></div>{filtro === "personalizado" && <div className="mt-3 grid grid-cols-2 gap-3"><I l="De" type="date" v={inicio} c={setInicio}/><I l="Até" type="date" v={fim} c={setFim}/></div>}</div>
      <div className="overflow-x-auto"><table className="w-full min-w-[1120px] text-left text-sm"><thead className="bg-slate-50 text-xs uppercase text-slate-500"><tr><th className="p-4">Data</th><th>Profissional</th><th>Recebido do SAMU</th><th>Nota ({regra.percentual_nota}%)</th><th>Total a pagar</th><th>Meu lucro</th><th>Status</th><th className="pr-4 text-right">Ações</th></tr></thead><tbody className="divide-y">{lista.map(t => { const financeiro = calcular(Number(t.valor_bruto), t.profissionais?.categoria, t.periodo); return <tr key={t.id}><td className="p-4">{t.data_plantao.split("-").reverse().join("/")}<small className="block text-slate-500">{t.periodo} · {t.unidade ?? "SAMU"}</small></td><td className="font-semibold">{t.profissionais?.nome}<small className="block font-normal text-slate-500">{t.profissionais?.categoria}</small></td><td>{moeda(financeiro.recebido)}</td><td className="text-amber-700">{moeda(financeiro.nota)}</td><td className="font-bold text-teal-700">{moeda(financeiro.repasse)}</td><td className="font-bold text-emerald-700">{moeda(financeiro.lucro)}</td><td className="capitalize">{t.status}</td><td className="pr-4"><div className="flex justify-end gap-2"><button onClick={() => abrirEdicao(t)} aria-label="Editar plantão" title="Editar" className="rounded-lg p-2 text-teal-700 hover:bg-teal-50"><Pencil size={17}/></button><button onClick={() => void excluir(t)} aria-label="Excluir plantão" title="Excluir" className="rounded-lg p-2 text-red-600 hover:bg-red-50"><Trash2 size={17}/></button></div></td></tr>})}{!lista.length && <tr><td colSpan={8} className="p-10 text-center text-slate-500">Nenhum plantão no período selecionado.</td></tr>}</tbody></table></div>
    </section>
    <Modal aberto={modal} fechar={() => setModal(false)} titulo={editandoId ? "Editar plantão" : "Registrar plantão"} descricao="O resumo mostra exatamente o que será repassado e o que sobra.">{erro && <p className="mb-3 rounded-xl bg-red-50 p-3 text-sm text-red-700">{erro}</p>}<form onSubmit={salvar} className="space-y-4"><S l="Profissional" v={form.profissional_id} c={selecionar}><option value="">Selecione</option>{profs.map(p => <option key={p.id} value={p.id}>{p.nome} · {p.categoria}</option>)}</S><div className="grid grid-cols-2 gap-3"><I l="Data" type="date" v={form.data_plantao} c={x => setForm({ ...form, data_plantao: x })}/><S l="Período" v={form.periodo} c={x => setForm({ ...form, periodo: x })}><option>Diurno</option><option>Noturno</option></S></div><I l="Hospital / unidade" v={form.unidade} c={x => setForm({ ...form, unidade: x })}/><S l="Status" v={form.status} c={x => setForm({ ...form, status: x })}><option value="previsto">Previsto</option><option value="realizado">Realizado</option><option value="pago">Pago</option><option value="cancelado">Cancelado</option></S>{!tecnico && <I l="Valor recebido do plantão" v={form.valor} c={x => setForm({ ...form, valor: x })}/>}<div className="rounded-xl bg-teal-50 p-4 text-sm"><div className="flex justify-between"><span>Recebido do SAMU</span><b>{moeda(resumo.recebido)}</b></div><div className="mt-2 flex justify-between"><span>Nota</span><b className="text-amber-700">{moeda(resumo.nota)}</b></div><div className="mt-2 flex justify-between"><span>Total a pagar</span><b className="text-teal-700">{moeda(resumo.repasse)}</b></div><div className="mt-2 flex justify-between"><span>Meu lucro</span><b className="text-emerald-700">{moeda(resumo.lucro)}</b></div></div><button className="w-full rounded-xl bg-teal-700 py-3 font-semibold text-white">{editandoId ? "Salvar alterações" : "Salvar plantão"}</button></form></Modal>
  </>;
}

function I({ l, type = "text", v, c }: { l: string; type?: string; v: string; c: (x: string) => void }) { return <label className="block text-sm font-semibold">{l}<input required type={type} value={v} onChange={e => c(e.target.value)} className="mt-1 w-full rounded-xl border p-3"/></label>; }
function S({ l, v, c, children }: { l: string; v: string; c: (x: string) => void; children: React.ReactNode }) { return <label className="block text-sm font-semibold">{l}<select value={v} onChange={e => c(e.target.value)} className="mt-1 w-full rounded-xl border bg-white p-3">{children}</select></label>; }
