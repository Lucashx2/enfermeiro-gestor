import { supabase } from "./supabase";
import { TAXA_NOTA_PADRAO } from "./finance";

export async function buscarTaxaNota() {
  const { data, error } = await supabase.from("configuracoes").select("percentual_nota").maybeSingle();
  if (error || !data) return TAXA_NOTA_PADRAO;
  return Number(data.percentual_nota) / 100;
}
