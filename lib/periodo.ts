export type FiltroRapido = "mes" | "semana" | "personalizado";

export function periodoInicial(tipo: FiltroRapido) {
  const hoje = new Date();
  if (tipo === "semana") {
    const dia = hoje.getDay() || 7;
    hoje.setDate(hoje.getDate() - dia + 1);
  } else if (tipo === "mes") hoje.setDate(1);
  return hoje.toISOString().slice(0, 10);
}

export const hojeISO = () => new Date().toISOString().slice(0, 10);
