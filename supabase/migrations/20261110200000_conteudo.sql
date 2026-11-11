-- Conteúdo das lições (fase 2). O site lê tudo de uma vez no build via rpc `conteudo()`,
-- que devolve exatamente o formato de src/content/schema.ts (ConteudoSchema).
-- Editar pelo Table Editor do Supabase: cada cartão = tipo + `dados` (os demais campos do JSON).

create table public.temas (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  titulo text not null check (btrim(titulo) <> ''),
  icone text not null,
  ordem int not null,
  em_breve boolean not null default false,
  constraint temas_ordem_unica unique (ordem) deferrable initially deferred
);

create table public.licoes (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  tema_id text not null references public.temas (id) on update cascade,
  ordem int not null,
  titulo text not null check (btrim(titulo) <> ''),
  descricao text not null check (btrim(descricao) <> ''),
  constraint licoes_ordem_unica unique (tema_id, ordem) deferrable initially deferred
);
create index on public.licoes (tema_id);

create table public.cartoes (
  id text primary key check (id ~ '^[a-z0-9]+(-[a-z0-9]+)*$'),
  licao_id text not null references public.licoes (id) on update cascade on delete cascade,
  ordem int not null,
  tipo text not null,
  -- o resto do cartão (enunciado, opcoes, cena...); validado no build pelo zod
  dados jsonb not null default '{}' check (jsonb_typeof(dados) = 'object' and not dados ? 'id' and not dados ? 'tipo'),
  constraint cartoes_ordem_unica unique (licao_id, ordem) deferrable initially deferred
);
create index on public.cartoes (licao_id);

-- leitura pública, escrita só pelo painel (sem políticas de insert/update/delete)
alter table public.temas enable row level security;
alter table public.licoes enable row level security;
alter table public.cartoes enable row level security;
create policy "conteúdo é público" on public.temas for select to anon, authenticated using (true);
create policy "conteúdo é público" on public.licoes for select to anon, authenticated using (true);
create policy "conteúdo é público" on public.cartoes for select to anon, authenticated using (true);
grant select on public.temas, public.licoes, public.cartoes to anon, authenticated;

create function public.conteudo()
returns jsonb
language sql
stable
security invoker
set search_path = ''
as $$
  select jsonb_build_object(
    'temas', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', t.id,
          'titulo', t.titulo,
          'icone', t.icone,
          'licoes', coalesce((select jsonb_agg(l.id order by l.ordem) from public.licoes l where l.tema_id = t.id), '[]'::jsonb)
        ) || case when t.em_breve then '{"emBreve": true}'::jsonb else '{}'::jsonb end
        order by t.ordem)
      from public.temas t), '[]'::jsonb),
    'licoes', coalesce((
      select jsonb_agg(
        jsonb_build_object(
          'id', l.id,
          'temaId', l.tema_id,
          'titulo', l.titulo,
          'descricao', l.descricao,
          'cartoes', coalesce((
            select jsonb_agg(c.dados || jsonb_build_object('tipo', c.tipo, 'id', c.id) order by c.ordem)
            from public.cartoes c where c.licao_id = l.id), '[]'::jsonb)
        )
        order by t.ordem, l.ordem)
      from public.licoes l join public.temas t on t.id = l.tema_id), '[]'::jsonb)
  );
$$;
grant execute on function public.conteudo() to anon, authenticated;

-- troca todo o conteúdo por um JSON no formato do ConteudoSchema (carga inicial / importação)
create function public.substituir_conteudo(c jsonb)
returns void
language plpgsql
set search_path = ''
as $$
begin
  delete from public.cartoes where true;
  delete from public.licoes where true;
  delete from public.temas where true;

  insert into public.temas (id, titulo, icone, ordem, em_breve)
  select t->>'id', t->>'titulo', t->>'icone', o - 1, coalesce((t->>'emBreve')::boolean, false)
  from jsonb_array_elements(c->'temas') with ordinality as x(t, o);

  insert into public.licoes (id, tema_id, ordem, titulo, descricao)
  select l->>'id', l->>'temaId',
    (select y.o - 1
       from jsonb_array_elements(c->'temas') tt,
            jsonb_array_elements_text(tt->'licoes') with ordinality as y(id, o)
      where tt->>'id' = l->>'temaId' and y.id = l->>'id'),
    l->>'titulo', l->>'descricao'
  from jsonb_array_elements(c->'licoes') as x(l);

  insert into public.cartoes (id, licao_id, ordem, tipo, dados)
  select k->>'id', l->>'id', y.o - 1, k->>'tipo', k - 'id' - 'tipo'
  from jsonb_array_elements(c->'licoes') as x(l),
       jsonb_array_elements(l->'cartoes') with ordinality as y(k, o);
end;
$$;
revoke execute on function public.substituir_conteudo(jsonb) from public, anon, authenticated;

-- Rebuild do site quando o conteúdo muda: chama o repository_dispatch do GitHub.
-- O token fica no Vault (nome 'github_dispatch_token'); sem ele, não faz nada.
create extension if not exists pg_net with schema extensions;

create function public.disparar_rebuild()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  token text;
begin
  select decrypted_secret into token from vault.decrypted_secrets where name = 'github_dispatch_token';
  if token is not null then
    perform net.http_post(
      url := 'https://api.github.com/repos/samukdev/bom-marujo/dispatches',
      body := jsonb_build_object('event_type', 'conteudo', 'client_payload', jsonb_build_object('tabela', tg_table_name)),
      headers := jsonb_build_object(
        'Authorization', 'Bearer ' || token,
        'Accept', 'application/vnd.github+json',
        'User-Agent', 'bom-marujo-supabase',
        'Content-Type', 'application/json'
      )
    );
  end if;
  return null;
end;
$$;
revoke execute on function public.disparar_rebuild() from public, anon, authenticated;

create trigger rebuild after insert or update or delete or truncate on public.temas for each statement execute function public.disparar_rebuild();
create trigger rebuild after insert or update or delete or truncate on public.licoes for each statement execute function public.disparar_rebuild();
create trigger rebuild after insert or update or delete or truncate on public.cartoes for each statement execute function public.disparar_rebuild();
