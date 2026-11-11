-- Contas (fase 3): perfil com foto, histórico de lições concluídas e exclusão da própria conta (LGPD).

-- ---------- perfis ----------
create table public.perfis (
  id uuid primary key references auth.users (id) on delete cascade,
  nome text check (char_length(nome) <= 60),
  foto_url text check (char_length(foto_url) <= 500),
  criado_em timestamptz not null default now()
);
alter table public.perfis enable row level security;
create policy "vê o próprio perfil" on public.perfis for select to authenticated using (id = (select auth.uid()));
create policy "edita o próprio perfil" on public.perfis for update to authenticated
  using (id = (select auth.uid())) with check (id = (select auth.uid()));
grant select on public.perfis to authenticated;
grant update (nome, foto_url) on public.perfis to authenticated;

-- todo usuário novo ganha um perfil; Google traz nome e foto, o cadastro por e-mail traz `nome`
create function public.criar_perfil()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.perfis (id, nome, foto_url)
  values (
    new.id,
    left(coalesce(new.raw_user_meta_data->>'nome', new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'), 60),
    coalesce(new.raw_user_meta_data->>'avatar_url', new.raw_user_meta_data->>'picture')
  );
  return new;
end;
$$;
revoke execute on function public.criar_perfil() from public, anon, authenticated;
create trigger criar_perfil after insert on auth.users for each row execute function public.criar_perfil();

-- ---------- lições concluídas (cada conclusão vale XP; base das milhas e insígnias da fase 4) ----------
create table public.conclusoes (
  usuario_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  licao_id text not null,
  xp int not null check (xp between 0 and 15),
  acertos int not null check (acertos >= 0),
  total int not null check (total >= acertos),
  em timestamptz not null,
  primary key (usuario_id, licao_id, em)
);
alter table public.conclusoes enable row level security;
create policy "vê as próprias conclusões" on public.conclusoes for select to authenticated using (usuario_id = (select auth.uid()));
create policy "registra as próprias conclusões" on public.conclusoes for insert to authenticated
  with check (usuario_id = (select auth.uid()) and em <= now() + interval '5 minutes');
grant select, insert on public.conclusoes to authenticated;

-- ---------- fotos de perfil: bucket público, cada um escreve só na própria pasta ----------
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('avatars', 'avatars', true, 1048576, array['image/webp', 'image/jpeg', 'image/png']);

create policy "avatar: vê a própria pasta" on storage.objects for select to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "avatar: envia na própria pasta" on storage.objects for insert to authenticated
  with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "avatar: troca na própria pasta" on storage.objects for update to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "avatar: apaga na própria pasta" on storage.objects for delete to authenticated
  using (bucket_id = 'avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);

-- ---------- excluir a própria conta (o app apaga a foto antes, pela API de storage) ----------
create function public.excluir_minha_conta()
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then
    raise exception 'não autenticado';
  end if;
  delete from auth.users where id = auth.uid();
end;
$$;
revoke execute on function public.excluir_minha_conta() from public, anon;
grant execute on function public.excluir_minha_conta() to authenticated;
