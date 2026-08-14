-- Execute após as migrations anteriores.
-- Controle operacional: unidade, status, duplicidade e trilha de auditoria.

alter table public.turnos add column if not exists unidade text;
alter table public.turnos add column if not exists status text not null default 'realizado';
alter table public.turnos drop constraint if exists turnos_status_valido;
alter table public.turnos add constraint turnos_status_valido check (status in ('previsto', 'realizado', 'pago', 'cancelado'));

create unique index if not exists turnos_sem_duplicidade_ativa
  on public.turnos (owner_id, profissional_id, data_plantao, periodo)
  where status <> 'cancelado';

create table if not exists public.historico_alteracoes (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id),
  usuario_id uuid references auth.users(id),
  entidade text not null,
  entidade_id uuid not null,
  acao text not null check (acao in ('criado', 'atualizado', 'excluido')),
  dados_anteriores jsonb,
  dados_novos jsonb,
  created_at timestamptz not null default now()
);

alter table public.historico_alteracoes enable row level security;
drop policy if exists "Dono lê histórico" on public.historico_alteracoes;
create policy "Dono lê histórico" on public.historico_alteracoes for select to authenticated using (owner_id = auth.uid());

create or replace function public.registrar_historico_turno()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'INSERT' then
    insert into historico_alteracoes (owner_id, usuario_id, entidade, entidade_id, acao, dados_novos)
    values (new.owner_id, auth.uid(), 'turno', new.id, 'criado', to_jsonb(new));
    return new;
  elsif tg_op = 'UPDATE' then
    insert into historico_alteracoes (owner_id, usuario_id, entidade, entidade_id, acao, dados_anteriores, dados_novos)
    values (new.owner_id, auth.uid(), 'turno', new.id, 'atualizado', to_jsonb(old), to_jsonb(new));
    return new;
  else
    insert into historico_alteracoes (owner_id, usuario_id, entidade, entidade_id, acao, dados_anteriores)
    values (old.owner_id, auth.uid(), 'turno', old.id, 'excluido', to_jsonb(old));
    return old;
  end if;
end;
$$;

drop trigger if exists auditar_turnos on public.turnos;
create trigger auditar_turnos after insert or update or delete on public.turnos
for each row execute function public.registrar_historico_turno();
