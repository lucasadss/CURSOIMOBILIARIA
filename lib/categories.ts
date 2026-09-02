import type { CategoryDefinition } from "@/types";

export const CATEGORIES: CategoryDefinition[] = [
  {
    slug: "terrenos",
    name: "Terrenos",
    tagline: "Mostre o potencial de um lote antes da primeira obra",
    description:
      "Módulos para quem tem um terreno e precisa comunicar valor: metragem destacada, projeção da casa no lote, vistas de drone e empreendimentos.",
    thumbnailAlt:
      "Vista aérea de uma vizinhança residencial com quintais arborizados",
  },
  {
    slug: "construcao",
    name: "Construção",
    tagline: "Timelapses e transformações de obra",
    description:
      "Da fundação à entrega. Gere timelapses de construção, revelações de fachada e comparativos antes e depois com aparência cinematográfica.",
    thumbnailAlt: "Guindaste de construção silhuetado contra o céu ao entardecer",
    thumbnailPosition: "38% 45%",
  },
  {
    slug: "interiores",
    name: "Interiores",
    tagline: "Decoração, reforma e ambientação",
    description:
      "Transforme ambientes vazios ou datados em espaços decorados e bem iluminados, mantendo a arquitetura real do imóvel.",
    thumbnailAlt: "Sala de jantar clara com mesa de madeira e portas de vidro",
  },
  {
    slug: "imovel-pronto",
    name: "Imóvel Pronto",
    tagline: "Apresentação de imóveis finalizados",
    description:
      "Conteúdos para anunciar imóveis prontos: apresentação profissional, entradas cinematográficas e recorridos que valorizam cada cômodo.",
    thumbnailAlt: "Casa com piscina no quintal em dia ensolarado",
    thumbnailPosition: "center 62%",
  },
  {
    slug: "cinematograficos",
    name: "Vídeos Cinematográficos",
    tagline: "Alto engajamento para redes e portfólio",
    description:
      "Peças de vídeo com linguagem de cinema — movimento de câmera, ritmo e trilha — pensadas para prender atenção nos primeiros segundos.",
    thumbnailAlt: "Arquitetura contemporânea fotografada ao entardecer",
  },
  {
    slug: "redes-sociais",
    name: "Redes Sociais",
    tagline: "Formatos verticais prontos para postar",
    description:
      "Cortes verticais, ganchos e variações rápidas para Reels, TikTok e Stories a partir dos mesmos módulos.",
  },
  {
    slug: "outros",
    name: "Outros",
    tagline: "Ferramentas e experimentos",
    description: "Módulos que não se encaixam nas demais trilhas e criações personalizadas.",
  },
];

export const CATEGORY_MAP: Record<string, CategoryDefinition> = Object.fromEntries(
  CATEGORIES.map((c) => [c.slug, c]),
);

export function getCategory(slug: string): CategoryDefinition | undefined {
  return CATEGORY_MAP[slug];
}
