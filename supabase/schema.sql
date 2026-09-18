-- IMOVIX — login por e-mail de compra (Cakto) — schema inicial
-- Cole isto no SQL Editor do projeto Supabase (bewcewvguzmpwotngtgq) e rode uma vez.

-- Compradores autorizados. Escrito SOMENTE pelo webhook da Cakto (server-side,
-- com a service_role key). RLS habilitada e sem nenhuma policy = acesso
-- negado por padrão pra anon/authenticated; a service_role sempre ignora RLS,
-- então o webhook continua funcionando normalmente.
create table if not exists public.authorized_buyers (
  email text primary key,
  status text not null default 'active' check (status in ('active', 'revoked')),
  product text,
  cakto_transaction_id text,
  purchased_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.authorized_buyers enable row level security;

-- Dedup de eventos do webhook da Cakto — evita processar o mesmo evento
-- duas vezes se a Cakto reenviar por timeout.
create table if not exists public.cakto_processed_events (
  event_id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now()
);

alter table public.cakto_processed_events enable row level security;

-- Índice pra busca por status (usado na checagem de revogação a cada acesso).
create index if not exists authorized_buyers_status_idx
  on public.authorized_buyers (status);
