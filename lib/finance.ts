export const TAXA_NOTA_PADRAO = 0.06;

export const moeda = (valor: number) =>
  new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(Number.isFinite(valor) ? valor : 0);

export const calcularFinanceiro = (valorRecebido: number, taxaNota = TAXA_NOTA_PADRAO) => {
  const recebido = Number.isFinite(valorRecebido) ? valorRecebido : 0;
  const descontoNota = recebido * taxaNota;

  return {
    recebido,
    descontoNota,
    lucro: recebido - descontoNota,
  };
};

export const horasDoTurno = (tipo: string) => {
  if (tipo.includes("24")) return 24;
  if (tipo.includes("12")) return 12;
  return 0;
};

export const valorParaNumero = (valor: string) => {
  const normalizado = valor.trim().replace(/\./g, "").replace(",", ".");
  const numero = Number(normalizado);
  return Number.isFinite(numero) ? numero : 0;
};
