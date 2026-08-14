import { redirect } from "next/navigation";

// A taxa fixa de 6% já é calculada automaticamente em cada plantão.
export default function AjustesAntigos() {
  redirect("/admin");
}
