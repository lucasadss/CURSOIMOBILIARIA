-- IMOVIX — login por e-mail de compra (Payt) — schema inicial
-- Cole isto no SQL Editor do projeto Supabase (bewcewvguzmpwotngtgq) e rode uma vez.

-- Compradores autorizados. Escrito SOMENTE pelo webhook da Payt (server-side,
-- com a service_role key). RLS habilitada e sem nenhuma policy = acesso
-- negado por padrão pra anon/authenticated; a service_role sempre ignora RLS,
-- então o webhook continua funcionando normalmente.
create table if not exists public.authorized_buyers (
  email text primary key,
  status text not null default 'active' check (status in ('active', 'revoked')),
  product text,
  transaction_id text,
  purchased_at timestamptz,
  -- Último link de acesso enviado (throttle por e-mail contra spam de e-mails).
  last_link_sent_at timestamptz,
  updated_at timestamptz not null default now()
);

alter table public.authorized_buyers enable row level security;

-- Dedup de eventos do webhook de pagamento (chave = transaction_id:status) —
-- evita processar o mesmo evento duas vezes se a Payt reenviar.
create table if not exists public.webhook_processed_events (
  event_id text primary key,
  event_type text not null,
  processed_at timestamptz not null default now()
);

alter table public.webhook_processed_events enable row level security;

-- Índice pra busca por status (usado na checagem de revogação a cada acesso).
create index if not exists authorized_buyers_status_idx
  on public.authorized_buyers (status);
