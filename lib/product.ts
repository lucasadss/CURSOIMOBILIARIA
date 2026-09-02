/**
 * Single source of truth for commercial copy on the landing page.
 * Price is intentionally a placeholder — set `PRICE.display` when decided.
 * Nothing else on the page hardcodes a price.
 */

export const BRAND = {
  name: "IMOVIX",
  tagline: "Faça mais com as fotos dos seus imóveis",
};

export const PRICE = {
  /** Visible price. */
  display: "R$ 47",
  /** Optional line under the price, e.g. "ou 12x de R$ X,XX". Empty = hidden. */
  note: "",
  model: "Pagamento único",
};

export const OFFER = {
  cta: "Quero acessar a IMOVIX",
  ctaHero: "Quero criar meu primeiro vídeo",
  reassurance: ["Pagamento único", "Acesso imediato", "Sem mensalidade"],
  includes: [
    "Mais de 20 modelos de criação",
    "Geração de prompts para imagens",
    "Geração de prompts para vídeos",
    "Módulos para terrenos",
    "Módulos para construção",
    "Módulos para imóveis prontos",
    "Módulos de transformação",
    "Módulos cinematográficos",
    "Assistente para pedidos fora do padrão",
    "Treinamento rápido dentro da plataforma",
    "Histórico das suas criações",
    "Favoritos",
    "Atualizações incluídas",
    "Suporte nos primeiros passos",
    "Acesso vitalício",
  ],
};
