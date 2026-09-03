/**
 * Single source of truth for commercial copy on the landing page.
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
  /** Anchor price shown struck through, to frame the real price as a discount. */
  anchor: "R$ 197",
  /** Difference between anchor and display, shown as a savings badge. */
  savings: "R$ 150",
};

/** Bonus items shown as "incluso grátis" next to their individual value, to build perceived value. */
export const BONUSES = [
  { title: "Treinamento rápido dentro da plataforma", value: "R$ 29" },
  { title: "Biblioteca de templates prontos", value: "R$ 39" },
  { title: "Kit Do Vídeo à Venda: legendas, CTAs e roteiro de fechamento no WhatsApp", value: "R$ 49" },
  { title: "Assistente de IA para criação dos vídeos", value: "R$ 79" },
];

/** Mini value breakdown shown near the price to reinforce the anchor. */
export const VALUE_SUMMARY = [
  { label: "Plataforma completa", value: "R$ 79" },
  { label: "Treinamento", value: "R$ 29" },
  { label: "Templates", value: "R$ 39" },
  { label: "Kit de vendas", value: "R$ 49" },
];

/** Cost of a single outsourced video versus the full platform, for the value comparison strip. */
export const COMPARISON = {
  competitor: { label: "1 vídeo editado por terceiros", value: "R$ 80 a R$ 200+" },
  imovix: { label: "IMOVIX completa", value: "R$ 47 uma única vez" },
};

export const OFFER = {
  cta: "Quero acessar a IMOVIX agora",
  ctaHero: "Quero criar meu primeiro vídeo",
  reassurance: ["Pagamento único", "Sem mensalidade", "Acesso vitalício"],
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
