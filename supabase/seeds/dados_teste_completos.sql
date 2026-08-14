-- BASE DE TESTES - execute após todas as migrations.
-- 1. No Supabase, abra Authentication > Users e copie o UUID da conta de teste.
-- 2. Substitua SOMENTE o valor da variável abaixo.
-- 3. Execute este arquivo no SQL Editor.
-- Pode ser executado mais de uma vez: profissionais e valores são atualizados;
-- plantões de teste antigos são removidos antes de novos serem criados.

do $$
declare
  conta uuid := '6245ddbf-04a3-47ac-8157-089e3c16b8e0';
  ana uuid;
  bruno uuid;
  carla uuid;
  diego uuid;
  elisa uuid;
  felipe uuid;
begin
  if conta is null then raise exception 'Informe o UUID da conta de teste.'; end if;

  delete from public.turnos where owner_id = conta and observacoes = '[DADOS DE TESTE]';

  insert into public.configuracoes (owner_id, percentual_nota)
  values (conta, 6) on conflict (owner_id) do update set percentual_nota = excluded.percentual_nota;

  insert into public.valores_padrao (owner_id, categoria, tipo, periodo, valor) values
    (conta, 'Enfermeiro', 'Plantão 12h', 'Diurno', 720),
    (conta, 'Enfermeiro', 'Plantão 12h', 'Noturno', 780),
    (conta, 'Enfermeiro', 'Plantão 24h', 'Diurno', 1440),
    (conta, 'Enfermeiro', 'Plantão 24h', 'Noturno', 1560),
    (conta, 'Enfermeiro', 'Hora avulsa', 'Diurno', 60),
    (conta, 'Enfermeiro', 'Hora avulsa', 'Noturno', 70),
    (conta, 'Técnico de enfermagem', 'Plantão 12h', 'Diurno', 480),
    (conta, 'Técnico de enfermagem', 'Plantão 12h', 'Noturno', 540),
    (conta, 'Técnico de enfermagem', 'Plantão 24h', 'Diurno', 960),
    (conta, 'Técnico de enfermagem', 'Plantão 24h', 'Noturno', 1080),
    (conta, 'Técnico de enfermagem', 'Hora avulsa', 'Diurno', 40),
    (conta, 'Técnico de enfermagem', 'Hora avulsa', 'Noturno', 45)
  on conflict (owner_id, categoria, tipo, periodo) do update set valor = excluded.valor;

  insert into public.profissionais (owner_id, nome, coren, categoria) values
    (conta, 'Ana Martins', 'TESTE-1001-SP', 'Enfermeiro'),
    (conta, 'Bruno Alves', 'TESTE-1002-SP', 'Técnico de enfermagem'),
    (conta, 'Carla Ribeiro', 'TESTE-1003-SP', 'Enfermeiro'),
    (conta, 'Diego Santos', 'TESTE-1004-SP', 'Técnico de enfermagem'),
    (conta, 'Elisa Costa', 'TESTE-1005-SP', 'Enfermeiro'),
    (conta, 'Felipe Rocha', 'TESTE-1006-SP', 'Técnico de enfermagem')
  on conflict (owner_id, coren) do update set nome = excluded.nome, categoria = excluded.categoria;

  select id into ana from public.profissionais where owner_id = conta and coren = 'TESTE-1001-SP';
  select id into bruno from public.profissionais where owner_id = conta and coren = 'TESTE-1002-SP';
  select id into carla from public.profissionais where owner_id = conta and coren = 'TESTE-1003-SP';
  select id into diego from public.profissionais where owner_id = conta and coren = 'TESTE-1004-SP';
  select id into elisa from public.profissionais where owner_id = conta and coren = 'TESTE-1005-SP';
  select id into felipe from public.profissionais where owner_id = conta and coren = 'TESTE-1006-SP';

  insert into public.turnos (owner_id, profissional_id, data_plantao, tipo, periodo, valor_bruto, observacoes) values
    (conta, ana, '2026-01-06', 'Plantão 12h', 'Diurno', 720, '[DADOS DE TESTE]'),
    (conta, bruno, '2026-01-15', 'Plantão 12h', 'Noturno', 540, '[DADOS DE TESTE]'),
    (conta, carla, '2026-01-28', 'Plantão 24h', 'Diurno', 1440, '[DADOS DE TESTE]'),
    (conta, diego, '2026-02-04', 'Plantão 12h', 'Diurno', 480, '[DADOS DE TESTE]'),
    (conta, elisa, '2026-02-13', 'Plantão 12h', 'Noturno', 780, '[DADOS DE TESTE]'),
    (conta, felipe, '2026-02-24', 'Plantão 24h', 'Diurno', 960, '[DADOS DE TESTE]'),
    (conta, ana, '2026-03-03', 'Plantão 24h', 'Noturno', 1560, '[DADOS DE TESTE]'),
    (conta, bruno, '2026-03-12', 'Plantão 12h', 'Diurno', 480, '[DADOS DE TESTE]'),
    (conta, carla, '2026-03-26', 'Plantão 12h', 'Noturno', 780, '[DADOS DE TESTE]'),
    (conta, diego, '2026-04-07', 'Plantão 24h', 'Noturno', 1080, '[DADOS DE TESTE]'),
    (conta, elisa, '2026-04-17', 'Plantão 12h', 'Diurno', 720, '[DADOS DE TESTE]'),
    (conta, felipe, '2026-04-29', 'Hora avulsa', 'Diurno', 200, '[DADOS DE TESTE]'),
    (conta, ana, '2026-05-05', 'Plantão 12h', 'Noturno', 780, '[DADOS DE TESTE]'),
    (conta, bruno, '2026-05-14', 'Plantão 24h', 'Diurno', 960, '[DADOS DE TESTE]'),
    (conta, carla, '2026-05-25', 'Plantão 24h', 'Noturno', 1560, '[DADOS DE TESTE]'),
    (conta, ana, '2026-06-03', 'Plantão 12h', 'Diurno', 720, '[DADOS DE TESTE]'),
    (conta, bruno, '2026-06-05', 'Plantão 12h', 'Noturno', 540, '[DADOS DE TESTE]'),
    (conta, carla, '2026-06-11', 'Plantão 24h', 'Diurno', 1440, '[DADOS DE TESTE]'),
    (conta, diego, '2026-06-17', 'Plantão 12h', 'Diurno', 480, '[DADOS DE TESTE]'),
    (conta, elisa, '2026-06-22', 'Plantão 12h', 'Noturno', 780, '[DADOS DE TESTE]'),
    (conta, felipe, '2026-06-27', 'Plantão 24h', 'Noturno', 1080, '[DADOS DE TESTE]'),
    (conta, ana, '2026-07-02', 'Plantão 12h', 'Noturno', 780, '[DADOS DE TESTE]'),
    (conta, bruno, '2026-07-07', 'Plantão 12h', 'Diurno', 480, '[DADOS DE TESTE]'),
    (conta, carla, '2026-07-12', 'Plantão 12h', 'Diurno', 720, '[DADOS DE TESTE]'),
    (conta, diego, '2026-07-16', 'Plantão 24h', 'Noturno', 1080, '[DADOS DE TESTE]'),
    (conta, elisa, '2026-07-21', 'Plantão 24h', 'Diurno', 1440, '[DADOS DE TESTE]'),
    (conta, felipe, '2026-07-26', 'Hora avulsa', 'Noturno', 225, '[DADOS DE TESTE]'),
    (conta, ana, '2026-08-03', 'Plantão 12h', 'Diurno', 720, '[DADOS DE TESTE]'),
    (conta, bruno, '2026-08-06', 'Plantão 12h', 'Noturno', 540, '[DADOS DE TESTE]'),
    (conta, carla, '2026-08-10', 'Plantão 24h', 'Noturno', 1560, '[DADOS DE TESTE]'),
    (conta, diego, '2026-08-12', 'Plantão 12h', 'Diurno', 480, '[DADOS DE TESTE]'),
    (conta, elisa, '2026-08-14', 'Plantão 12h', 'Noturno', 780, '[DADOS DE TESTE]'),
    (conta, felipe, '2026-08-15', 'Plantão 24h', 'Diurno', 960, '[DADOS DE TESTE]'),
    (conta, ana, '2026-09-02', 'Plantão 24h', 'Diurno', 1440, '[DADOS DE TESTE]'),
    (conta, bruno, '2026-09-11', 'Plantão 12h', 'Noturno', 540, '[DADOS DE TESTE]'),
    (conta, carla, '2026-09-23', 'Hora avulsa', 'Diurno', 300, '[DADOS DE TESTE]'),
    (conta, diego, '2026-10-06', 'Plantão 12h', 'Diurno', 480, '[DADOS DE TESTE]'),
    (conta, elisa, '2026-10-16', 'Plantão 24h', 'Noturno', 1560, '[DADOS DE TESTE]'),
    (conta, felipe, '2026-10-28', 'Plantão 12h', 'Noturno', 540, '[DADOS DE TESTE]'),
    (conta, ana, '2026-11-04', 'Plantão 12h', 'Diurno', 720, '[DADOS DE TESTE]'),
    (conta, bruno, '2026-11-13', 'Plantão 24h', 'Noturno', 1080, '[DADOS DE TESTE]'),
    (conta, carla, '2026-11-24', 'Plantão 12h', 'Noturno', 780, '[DADOS DE TESTE]'),
    (conta, diego, '2026-12-03', 'Hora avulsa', 'Diurno', 200, '[DADOS DE TESTE]'),
    (conta, elisa, '2026-12-15', 'Plantão 12h', 'Diurno', 720, '[DADOS DE TESTE]'),
    (conta, felipe, '2026-12-27', 'Plantão 24h', 'Diurno', 960, '[DADOS DE TESTE]');
end $$;
