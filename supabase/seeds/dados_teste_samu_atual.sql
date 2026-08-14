-- BASE DE TESTES - MODELO ATUAL SAMU
-- Execute após todas as migrations, incluindo 20260814_regras_repasses.sql.
-- Preparada para a conta de teste informada neste projeto.

do $$
declare
  conta uuid := '6245ddbf-04a3-47ac-8157-089e3c16b8e0';
  enf_ana uuid;
  enf_beatriz uuid;
  tec_carlos uuid;
  tec_daniela uuid;
  tec_eduardo uuid;
begin
  delete from public.turnos where owner_id = conta and observacoes = '[DADOS TESTE SAMU ATUAL]';

  insert into public.regras_repasses (owner_id, percentual_nota, valor_samu_tecnico, repasse_tecnico_diurno, repasse_tecnico_noturno)
  values (conta, 6, 420, 300, 350)
  on conflict (owner_id) do update set percentual_nota = excluded.percentual_nota, valor_samu_tecnico = excluded.valor_samu_tecnico, repasse_tecnico_diurno = excluded.repasse_tecnico_diurno, repasse_tecnico_noturno = excluded.repasse_tecnico_noturno;

  insert into public.profissionais (owner_id, nome, coren, categoria) values
    (conta, 'Ana Martins', 'SAMU-ENF-1001', 'Enfermeiro'),
    (conta, 'Beatriz Costa', 'SAMU-ENF-1002', 'Enfermeiro'),
    (conta, 'Carlos Souza', 'SAMU-TEC-2001', 'Técnico de enfermagem'),
    (conta, 'Daniela Lima', 'SAMU-TEC-2002', 'Técnico de enfermagem'),
    (conta, 'Eduardo Rocha', 'SAMU-TEC-2003', 'Técnico de enfermagem')
  on conflict (owner_id, coren) do update set nome = excluded.nome, categoria = excluded.categoria;

  select id into enf_ana from public.profissionais where owner_id = conta and coren = 'SAMU-ENF-1001';
  select id into enf_beatriz from public.profissionais where owner_id = conta and coren = 'SAMU-ENF-1002';
  select id into tec_carlos from public.profissionais where owner_id = conta and coren = 'SAMU-TEC-2001';
  select id into tec_daniela from public.profissionais where owner_id = conta and coren = 'SAMU-TEC-2002';
  select id into tec_eduardo from public.profissionais where owner_id = conta and coren = 'SAMU-TEC-2003';

  insert into public.turnos (owner_id, profissional_id, data_plantao, tipo, periodo, unidade, status, valor_bruto, observacoes) values
    (conta, tec_carlos, '2026-06-03', 'Plantão SAMU', 'Diurno', 'SAMU Central', 'pago', 420, '[DADOS TESTE SAMU ATUAL]'),
    (conta, tec_daniela, '2026-06-08', 'Plantão SAMU', 'Noturno', 'SAMU Central', 'pago', 420, '[DADOS TESTE SAMU ATUAL]'),
    (conta, enf_ana, '2026-06-15', 'Plantão SAMU', 'Diurno', 'SAMU Norte', 'pago', 780, '[DADOS TESTE SAMU ATUAL]'),
    (conta, tec_eduardo, '2026-06-21', 'Plantão SAMU', 'Diurno', 'SAMU Norte', 'realizado', 420, '[DADOS TESTE SAMU ATUAL]'),
    (conta, enf_beatriz, '2026-07-02', 'Plantão SAMU', 'Diurno', 'SAMU Central', 'pago', 820, '[DADOS TESTE SAMU ATUAL]'),
    (conta, tec_carlos, '2026-07-07', 'Plantão SAMU', 'Noturno', 'SAMU Central', 'pago', 420, '[DADOS TESTE SAMU ATUAL]'),
    (conta, tec_daniela, '2026-07-14', 'Plantão SAMU', 'Diurno', 'SAMU Sul', 'realizado', 420, '[DADOS TESTE SAMU ATUAL]'),
    (conta, enf_ana, '2026-07-26', 'Plantão SAMU', 'Diurno', 'SAMU Norte', 'pago', 780, '[DADOS TESTE SAMU ATUAL]'),
    (conta, tec_eduardo, '2026-08-03', 'Plantão SAMU', 'Noturno', 'SAMU Sul', 'pago', 420, '[DADOS TESTE SAMU ATUAL]'),
    (conta, enf_beatriz, '2026-08-08', 'Plantão SAMU', 'Diurno', 'SAMU Central', 'realizado', 820, '[DADOS TESTE SAMU ATUAL]'),
    (conta, tec_carlos, '2026-08-11', 'Plantão SAMU', 'Diurno', 'SAMU Central', 'pago', 420, '[DADOS TESTE SAMU ATUAL]'),
    (conta, tec_daniela, '2026-08-13', 'Plantão SAMU', 'Noturno', 'SAMU Norte', 'previsto', 420, '[DADOS TESTE SAMU ATUAL]'),
    (conta, enf_ana, '2026-08-16', 'Plantão SAMU', 'Diurno', 'SAMU Sul', 'previsto', 780, '[DADOS TESTE SAMU ATUAL]'),
    (conta, tec_eduardo, '2026-08-19', 'Plantão SAMU', 'Diurno', 'SAMU Norte', 'cancelado', 420, '[DADOS TESTE SAMU ATUAL]'),
    (conta, enf_beatriz, '2026-08-24', 'Plantão SAMU', 'Diurno', 'SAMU Central', 'previsto', 820, '[DADOS TESTE SAMU ATUAL]');
end $$;
