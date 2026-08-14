"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import Sidebar from "../../components/Sidebar";
import { supabase } from "../../lib/supabase";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [autorizado, setAutorizado] = useState(false);

  useEffect(() => {
    let ativo = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!ativo) return;
      if (!data.session) router.replace("/");
      else setAutorizado(true);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) router.replace("/");
    });
    return () => { ativo = false; listener.subscription.unsubscribe(); };
  }, [router]);

  if (!autorizado) return <div className="flex min-h-screen items-center justify-center bg-[#f5f8f7]"><Loader2 className="animate-spin text-teal-700" /></div>;
  return <div className="min-h-screen bg-[#f5f8f7] lg:pl-72"><Sidebar /><main className="mx-auto max-w-7xl p-5 sm:p-8 lg:p-10">{children}</main></div>;
}
