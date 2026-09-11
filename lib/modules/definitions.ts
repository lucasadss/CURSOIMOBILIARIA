import type { ModuleDefinition } from "@/types";
import {
  AMBER_SWATCHES,
  cameraAngle,
  crewField,
  durationField,
  extraDetails,
  lensField,
  musicField,
  oneReferenceImage,
  paletteOptions,
  qualityField,
  showAreaField,
  soundEffectsField,
  speedField,
  styleOptions,
  timeOfDay,
  weatherField,
} from "./shared";

/* ============================================================================
   Fase 1 — 5 módulos completos e navegáveis
   ========================================================================== */

const decoracaoInteriores: ModuleDefinition = {
  name: "Decoração de Interiores",
  slug: "decoracao-de-interiores",
  description:
    "Transforme um ambiente vazio ou datado em um espaço decorado e bem iluminado, sem mexer na arquitetura real.",
  longDescription:
    "Envie uma foto do cômodo como ele está hoje. A IA mantém paredes, janelas, piso e ponto de vista, e reconstrói apenas a ambientação — mobília, texturas, iluminação e clima.",
  category: "interiores",
  type: "image-custom",
  accessLevel: "free",
  thumbnailAlt: "Sala de estar decorada com luz natural, mobília contemporânea e paleta neutra",
  requiredImages: oneReferenceImage,
  minImages: 1,
  recommendedTool: "google-flow",
  availableTools: ["google-flow", "midjourney"],
  allowStructuredJson: true,
  defaultFormat: "plain_text",
  startHere: true,
  featured: true,
  instructions: [
    "Use uma foto bem enquadrada do ambiente, de preferência com luz natural.",
    "Quanto mais reto o ângulo, mais fiel fica o resultado.",
  ],
  toolGuide: {
    tool: "google-flow",
    path: ["Imagem", "Referência", "Editar cena"],
    steps: [
      "Abra o Google Flow e crie um projeto de Imagem.",
      "Anexe a foto do ambiente como referência principal.",
      "Cole o prompt gerado e ajuste a proporção para 3:2.",
    ],
    walkthroughHref: "/app/treinamento/fundamentos-imovel-ia",
  },
  beginnerFields: [
    {
      key: "roomType",
      type: "select",
      label: "Tipo do ambiente",
      placeholder: "Selecione…",
      required: true,
      options: [
        { value: "sala", label: "Sala de estar", promptValue: "living room" },
        { value: "jantar", label: "Sala de jantar", promptValue: "dining room" },
        { value: "quarto", label: "Quarto", promptValue: "bedroom" },
        { value: "cozinha", label: "Cozinha", promptValue: "kitchen" },
        { value: "home-office", label: "Home office", promptValue: "home office" },
        { value: "varanda", label: "Varanda / área externa", promptValue: "covered balcony / outdoor living area" },
        { value: "banheiro", label: "Banheiro", promptValue: "bathroom" },
      ],
    },
    {
      key: "style",
      type: "select",
      label: "Estilo de decoração",
      placeholder: "Selecione…",
      required: true,
      options: styleOptions,
    },
    {
      key: "lighting",
      type: "select",
      label: "Iluminação",
      defaultValue: "natural-suave",
      options: [
        { value: "natural-suave", label: "Natural suave", promptValue: "soft diffuse natural daylight" },
        { value: "golden-hour", label: "Fim de tarde quente", promptValue: "warm golden-hour light streaming through openings" },
        { value: "noturna-aconchegante", label: "Noturna aconchegante", promptValue: "cozy evening lighting, warm-white lamps on" },
        { value: "showroom", label: "Showroom neutra", promptValue: "neutral even showroom lighting, no color cast" },
      ],
    },
    extraDetails,
  ],
  advancedFields: [
    cameraAngle,
    qualityField,
    {
      key: "palette",
      type: "multiselect",
      label: "Paleta de cores",
      description: "Escolha até três tons de base.",
      options: paletteOptions,
    },
    lensField,
    {
      key: "greenery",
      type: "toggle",
      label: "Incluir plantas",
      defaultValue: true,
      booleanText: {
        on: "include a few discreet interior plants",
        off: "no plants or greenery",
      },
    },
  ],
  promptTemplate: `Redecorate this {{roomType|room}} in {{style}}, keeping the architecture, windows and floor from the reference photo completely intact.
{{lighting}}, captured at {{cameraAngle}} with a {{lens}} lens.
Predominant palette: {{palette}}.
Include discreet interior greenery: {{greenery}}.
Photorealistic finish, {{quality}} quality.`,
  systemRules: [
    "photorealistic rendering, no plasticky CGI-render look",
    "do not alter the floor plan, the area or the position of openings",
  ],
  hardNegatives: [
    "perspective distortion",
    "floating furniture",
    "text or watermark",
    "people",
    "invented windows or doors",
  ],
  fidelity: {
    preserveStructure: true,
    preserveGeometry: true,
    preserveObjectPlacement: true,
    preserveCamera: true,
    noInventedElements: true,
  },
  cameraMode: "static",
  nextModule: "antes-e-depois-decoracao",
  supportMaterial: [
    {
      kind: "guide",
      label: "Guia rápido: fotos que funcionam",
      body: "Fotografe na altura do peito, com as costas na parede oposta e luz natural. Evite grande-angular de celular muito fechada.",
    },
    { kind: "video", label: "Aula: primeira decoração", href: "/app/treinamento/fundamentos-imovel-ia" },
  ],
  examples: [
    {
      label: "Sala contemporânea",
      body: "Redecorate this living room in contemporary style, keeping the architecture, windows and floor from the reference photo completely intact. Soft natural lighting, captured at eye level with a 35mm lens. Predominant palette: warm neutrals and light wood…",
    },
  ],
};

const casaEmTerreno: ModuleDefinition = {
  name: "Casa em Terreno",
  slug: "casa-em-terreno",
  description:
    "Projete uma casa realista sobre a foto do seu lote, respeitando os limites e a topografia reais do terreno.",
  longDescription:
    "A partir de uma foto do terreno, a IA insere uma construção no lugar certo, com escala coerente ao entorno. Os limites, a rua e a vizinhança permanecem como na foto.",
  category: "terrenos",
  type: "image-custom",
  accessLevel: "free",
  thumbnailAlt: "Casa moderna de dois pavimentos em um lote urbano, com garagem, gramado e entrada de carros",
  thumbnailPosition: "center 38%",
  requiredImages: [
    { key: "reference", label: "Foto do terreno", hint: "De frente para o lote, mostrando a testada e o entorno.", promptLabel: "Lot photo" },
  ],
  minImages: 1,
  recommendedTool: "google-flow",
  availableTools: ["google-flow", "midjourney"],
  allowStructuredJson: true,
  startHere: true,
  featured: true,
  instructions: [
    "Fotografe o terreno da calçada oposta, com a testada inteira no quadro.",
    "Se houver desnível, mostre-o — a IA respeita a topografia visível.",
  ],
  toolGuide: {
    tool: "google-flow",
    path: ["Imagem", "Referência", "Compor"],
    steps: [
      "Crie um projeto de Imagem no Google Flow.",
      "Anexe a foto do terreno como referência.",
      "Cole o prompt e gere em 3:2. Regenere variando o ângulo se precisar.",
    ],
  },
  beginnerFields: [
    {
      key: "houseType",
      type: "select",
      label: "Tipo de casa",
      required: true,
      placeholder: "Selecione…",
      options: [
        { value: "terrea", label: "Térrea", promptValue: "single-story" },
        { value: "sobrado", label: "Sobrado", promptValue: "two-story" },
        { value: "moderna-caixa", label: "Moderna em volumes", promptValue: "modern boxy-volumes architectural style" },
        { value: "contemporanea-madeira", label: "Contemporânea com madeira", promptValue: "contemporary style with wood cladding accents" },
        { value: "colonial-atualizada", label: "Colonial atualizada", promptValue: "updated colonial style with contemporary finishes" },
      ],
    },
    {
      key: "floors",
      type: "segmented-control",
      label: "Número de andares",
      defaultValue: "2",
      options: [
        { value: "1", label: "1" },
        { value: "2", label: "2" },
        { value: "3", label: "3" },
      ],
    },
    {
      key: "facade",
      type: "select",
      label: "Fachada",
      defaultValue: "branco-madeira",
      options: [
        { value: "branco-madeira", label: "Branco + madeira", promptValue: "white stucco and wood-cladding facade" },
        { value: "concreto-vidro", label: "Concreto + vidro", promptValue: "exposed concrete and glass facade" },
        { value: "tijolo", label: "Tijolo aparente", promptValue: "exposed brick facade" },
        { value: "grafite-madeira", label: "Grafite + madeira", promptValue: "graphite-grey panel and wood-cladding facade" },
      ],
    },
    extraDetails,
  ],
  advancedFields: [
    weatherField,
    timeOfDay,
    { ...cameraAngle, defaultValue: "amplo" },
    qualityField,
    {
      key: "landscaping",
      type: "select",
      label: "Paisagismo",
      defaultValue: "moderado",
      options: [
        { value: "minimo", label: "Mínimo", promptValue: "minimal landscaping, mostly lawn" },
        { value: "moderado", label: "Moderado", promptValue: "moderate landscaping, mixed lawn and plant beds" },
        { value: "exuberante", label: "Exuberante", promptValue: "lush landscaping, dense plant beds and trees" },
      ],
    },
  ],
  promptTemplate: `Place a {{houseType}} house with {{floors|two}} floor(s) on this lot, aligned with the real boundaries visible in the reference photo.
{{facade}}. {{landscaping}} in the front setback.
Scene in {{weather}}, {{timeOfDay}}, viewed at {{cameraAngle}}.
Scale consistent with the existing neighborhood and street.
Photorealistic finish, {{quality}} quality.`,
  systemRules: [
    "keep the street, sidewalk, utility poles and neighboring houses exactly as in the reference",
    "architecturally plausible scale for an urban lot",
  ],
  hardNegatives: [
    "altering the lot boundaries",
    "changing the street or the neighborhood",
    "tall background buildings that don't exist",
    "text or watermark",
    "people in the foreground",
  ],
  fidelity: {
    preserveCamera: true,
    noPerspectiveChanges: true,
    noPropertyChanges: true,
    noInventedElements: true,
  },
  cameraMode: "static",
  nextModule: "casa-em-terreno-video",
  steps: [
    { label: "Casa no terreno (imagem)", moduleSlug: "casa-em-terreno" },
    { label: "Casa no terreno (vídeo)", moduleSlug: "casa-em-terreno-video" },
  ],
  supportMaterial: [
    {
      kind: "guide",
      label: "Como fotografar o terreno",
      body: "Fique na calçada oposta, centralize a testada e mantenha a linha do horizonte no meio do quadro. Foto na horizontal.",
    },
  ],
  examples: [
    {
      label: "Sobrado moderno",
      body: "Place a modern boxy-volumes architectural style house with 2 floor(s) on this lot, aligned with the real boundaries visible in the reference photo. White stucco and wood-cladding facade. Moderate landscaping in the front setback. Scene in clear sky, golden hour…",
    },
  ],
};

const metragemDoTerreno: ModuleDefinition = {
  name: "Metragem do Terreno",
  slug: "metragem-do-terreno",
  description:
    "Destaque o contorno e a área do lote sobre uma foto aérea, com um traço de luz limpo e legível.",
  longDescription:
    "Sobre uma imagem aérea do terreno, a IA desenha o perímetro com um feixe de luz e, opcionalmente, escreve a metragem. Nada da foto original é alterado.",
  category: "terrenos",
  type: "image-custom",
  accessLevel: "free",
  thumbnailAlt: "Vista aérea de talhões de terreno com limites bem definidos, casa isolada ao centro",
  requiredImages: [
    { key: "reference", label: "Foto aérea do terreno", hint: "Drone ou satélite, com o lote inteiro visível.", promptLabel: "Aerial lot photo" },
  ],
  minImages: 1,
  recommendedTool: "google-flow",
  availableTools: ["google-flow", "midjourney"],
  startHere: true,
  instructions: [
    "Use uma imagem aérea com o lote inteiro e alguma folga nas bordas.",
    "Se souber a metragem exata, informe em ‘Detalhes extras’.",
  ],
  toolGuide: {
    tool: "google-flow",
    path: ["Imagem", "Referência", "Overlay"],
    steps: [
      "Projeto de Imagem no Google Flow.",
      "Anexe a foto aérea como referência.",
      "Cole o prompt e mantenha a proporção original da foto.",
    ],
  },
  beginnerFields: [
    {
      key: "beamColor",
      type: "color",
      label: "Cor do feixe",
      defaultValue: "#c9662e",
      swatches: AMBER_SWATCHES,
    },
    {
      key: "glowIntensity",
      type: "slider",
      label: "Intensidade do brilho",
      min: 10,
      max: 100,
      step: 5,
      unit: "%",
      defaultValue: 55,
    },
    showAreaField,
    extraDetails,
  ],
  advancedFields: [
    {
      key: "outlineStyle",
      type: "select",
      label: "Estilo do contorno",
      defaultValue: "linha-continua",
      options: [
        { value: "linha-continua", label: "Linha contínua", promptValue: "continuous unbroken outline" },
        { value: "tracejado", label: "Tracejado técnico", promptValue: "technical dashed outline" },
        { value: "duplo", label: "Linha dupla", promptValue: "double parallel outline" },
        { value: "cantos", label: "Só os cantos (marcadores)", promptValue: "corner markers only, no continuous line" },
      ],
    },
    {
      key: "areaUnit",
      type: "select",
      label: "Unidade",
      defaultValue: "m2",
      options: [
        { value: "m2", label: "m²", promptValue: "square meters (m²)" },
        { value: "ha", label: "hectares", promptValue: "hectares" },
        { value: "alqueire", label: "alqueires", promptValue: "alqueires (Brazilian land unit)" },
      ],
    },
    {
      key: "lineWeight",
      type: "slider",
      label: "Espessura da linha",
      min: 1,
      max: 8,
      step: 1,
      unit: "px",
      defaultValue: 3,
    },
    { ...cameraAngle, defaultValue: "aerea" },
  ],
  promptTemplate: `Over this aerial photo, trace the lot's exact perimeter with a {{beamColor}} light beam, {{outlineStyle}} style, {{lineWeight}} thickness and {{glowIntensity}} glow intensity.
Write the approximate area in {{areaUnit}} inside the lot: {{showArea}}.
Do not alter anything in the original image — only overlay the outline and the text.`,
  systemRules: [
    "the aerial photo stays 100% intact under the overlay",
    "the outline follows the real boundaries visible on the lot",
    "clean, legible typography, no heavy serif",
  ],
  hardNegatives: [
    "redrawing the lot or the neighborhood",
    "fake shadows or reflections from the beam on the ground",
    "multiple overlapping outlines",
    "watermark",
  ],
  fidelity: {
    preserveStructure: true,
    noPropertyChanges: true,
    noInventedElements: true,
    preserveCamera: true,
  },
  cameraMode: "static",
  nextModule: "metragem-animada",
  steps: [
    { label: "Criar metragem", moduleSlug: "metragem-do-terreno" },
    { label: "Animar metragem", moduleSlug: "metragem-animada" },
  ],
  supportMaterial: [
    {
      kind: "walkthrough",
      label: "Passo a passo: overlay de metragem",
      body: "1. Consiga a foto aérea. 2. Defina cor e estilo do traço. 3. Gere. 4. Leve o resultado para o módulo ‘Metragem Animada’.",
    },
  ],
};

const timelapseConstrucao: ModuleDefinition = {
  name: "Timelapse de Construção",
  slug: "timelapse-de-construcao",
  description:
    "Gere um timelapse curto que sobe uma obra do zero — da fundação à cobertura — a partir de uma foto do terreno.",
  longDescription:
    "A IA usa a foto atual como primeiro frame e anima a construção acelerada, mantendo o ponto de vista fixo. Ideal para stories e portfólio.",
  category: "construcao",
  type: "video-single-image",
  accessLevel: "pro",
  thumbnailAlt: "Casa em construção com estrutura à mostra e canteiro de obras",
  requiredImages: [
    { key: "reference", label: "Foto do terreno ou obra atual", hint: "Ponto de vista que ficará fixo durante todo o vídeo.", promptLabel: "Lot or current construction photo" },
  ],
  minImages: 1,
  recommendedTool: "google-flow",
  availableTools: ["google-flow", "runway", "pika", "sora"],
  allowStructuredJson: true,
  defaultFormat: "plain_text",
  featured: true,
  instructions: [
    "O enquadramento da foto será mantido do começo ao fim — escolha bem.",
    "Tripé ou apoio firme ajuda a IA a travar a câmera.",
  ],
  toolGuide: {
    tool: "google-flow",
    path: ["Vídeo", "Elementos", "Omni Flash"],
    steps: [
      "Abra o Google Flow em modo Vídeo.",
      "Envie a foto do terreno como primeiro frame.",
      "Cole o prompt, defina a duração e gere. Câmera travada.",
    ],
    walkthroughHref: "/app/treinamento/videos-que-convertem",
  },
  beginnerFields: [
    { ...speedField, label: "Velocidade do timelapse" },
    musicField,
    extraDetails,
  ],
  advancedFields: [
    soundEffectsField,
    durationField,
    {
      key: "stages",
      type: "multiselect",
      label: "Estágios a mostrar",
      description: "A obra passa por estas fases, em ordem.",
      defaultValue: ["fundacao", "estrutura", "acabamento"],
      options: [
        { value: "terraplenagem", label: "Terraplenagem", promptValue: "site grading and earthwork" },
        { value: "fundacao", label: "Fundação", promptValue: "foundation pour" },
        { value: "estrutura", label: "Estrutura", promptValue: "structural framing" },
        { value: "alvenaria", label: "Alvenaria", promptValue: "masonry walls going up" },
        { value: "cobertura", label: "Cobertura", promptValue: "roof structure and covering" },
        { value: "acabamento", label: "Acabamento e pintura", promptValue: "finishing and paint" },
        { value: "paisagismo", label: "Paisagismo final", promptValue: "final landscaping" },
      ],
    },
    crewField,
    weatherField,
  ],
  promptTemplate: `Accelerated timelapse, {{speed}}, building a house from this lot with the camera 100% locked to the photo's framing.
Visible progression through the stages: {{stages}}.
Show workers and machinery in accelerated motion: {{crew}}.
Sky with moving clouds and shifting shadows, {{weather}}.
Duration {{duration}}. Soundtrack {{music}}. Sound effects {{soundEffects}}.`,
  systemRules: [
    "static camera — no pan, zoom or reframing",
    "the first frame is identical to the reference photo",
    "lot and surroundings geometry stays constant across frames",
  ],
  hardNegatives: [
    "structure morphing",
    "flicker between frames",
    "camera floating or rotating",
    "the house appearing fully built all at once",
    "on-screen text",
  ],
  fidelity: {
    lockedCamera: true,
    preserveObjectPlacement: true,
    noPropertyChanges: true,
    noInventedElements: true,
  },
  cameraMode: "locked",
  nextModule: "reforma-cinematografica",
  supportMaterial: [
    {
      kind: "video",
      label: "Aula: vídeos que convertem",
      href: "/app/treinamento/videos-que-convertem",
    },
    {
      kind: "guide",
      label: "Checklist do primeiro frame",
      body: "Horizonte reto, testada inteira no quadro, sem carros passando na frente, luz uniforme.",
    },
  ],
};

const mobiliandoComodos: ModuleDefinition = {
  name: "Mobiliando Cômodos",
  slug: "mobiliando-comodos",
  description:
    "Anime a mobília entrando em um cômodo vazio, peça por peça, até o ambiente ficar completo.",
  longDescription:
    "A partir da foto de um cômodo vazio, a IA cria um vídeo curto em que os móveis ‘pousam’ em sequência, mantendo paredes, piso e janelas fixos.",
  category: "interiores",
  type: "video-single-image",
  accessLevel: "pro",
  thumbnailAlt: "Cômodo totalmente mobiliado e iluminado, pronto para anúncio",
  requiredImages: [
    { key: "reference", label: "Foto do cômodo vazio", hint: "Ambiente sem móveis, com boa luz e ângulo reto.", promptLabel: "Empty room photo" },
  ],
  minImages: 1,
  recommendedTool: "google-flow",
  availableTools: ["google-flow", "runway", "pika"],
  allowStructuredJson: true,
  featured: true,
  instructions: [
    "Funciona melhor a partir de uma imagem já decorada (ex.: resultado de ‘Decoração de Interiores’).",
    "Câmera fica parada; só os móveis se movem.",
  ],
  toolGuide: {
    tool: "google-flow",
    path: ["Vídeo", "Elementos", "Omni Flash"],
    steps: [
      "Modo Vídeo no Google Flow.",
      "Use a foto do cômodo (vazio ou já decorado) como primeiro frame.",
      "Cole o prompt e gere entre 6 e 10 segundos.",
    ],
  },
  dependsOn: "decoracao-de-interiores",
  beginnerFields: [
    {
      key: "animationSpeed",
      type: "segmented-control",
      label: "Velocidade da animação",
      defaultValue: "media",
      options: [
        { value: "lenta", label: "Lenta", promptValue: "slow, gentle furniture-entry pacing" },
        { value: "media", label: "Média", promptValue: "moderate, natural furniture-entry pacing" },
        { value: "rapida", label: "Rápida", promptValue: "brisk, energetic furniture-entry pacing" },
      ],
    },
    musicField,
    extraDetails,
  ],
  advancedFields: [
    soundEffectsField,
    {
      key: "furnitureStyle",
      type: "select",
      label: "Estilo dos móveis",
      defaultValue: "contemporaneo",
      options: styleOptions.filter((o) =>
        ["contemporaneo", "escandinavo", "organico", "classico"].includes(o.value),
      ),
    },
    {
      key: "entryOrder",
      type: "select",
      label: "Ordem de entrada",
      defaultValue: "grandes-primeiro",
      options: [
        { value: "grandes-primeiro", label: "Peças grandes primeiro", promptValue: "large pieces land first, then smaller items" },
        { value: "fundo-para-frente", label: "Do fundo para a frente", promptValue: "back-to-front entry order, relative to camera" },
        { value: "aleatoria-suave", label: "Aleatória suave", promptValue: "gentle, naturally staggered entry order" },
      ],
    },
    { ...durationField, defaultValue: 8 },
    {
      key: "cameraDrift",
      type: "toggle",
      label: "Leve aproximação de câmera",
      description: "Um push-in muito sutil enquanto os móveis entram.",
      defaultValue: false,
      booleanText: {
        on: "a very subtle push-in while the furniture enters",
        off: "camera fully static, no push-in",
      },
    },
  ],
  promptTemplate: `Starting from this room, animate the furniture entering the scene {{animationSpeed}}, {{entryOrder}}, until the room is fully furnished.
Furniture in {{furnitureStyle}}, landing with realistic weight and a subtle contact shadow.
Walls, floor, windows and point of view stay fixed.
Slight camera push-in: {{cameraDrift}}.
Duration {{duration}}. Soundtrack {{music}}. Sound effects {{soundEffects}}.`,
  systemRules: [
    "the room's architecture stays motionless throughout the clip",
    "each object keeps consistent scale and material as it enters",
    "physically plausible movement, no teleporting",
  ],
  hardNegatives: [
    "walls or windows changing position",
    "furniture clipping through each other",
    "morphing or flicker",
    "abrupt lighting changes",
    "on-screen text",
  ],
  fidelity: {
    preserveStructure: true,
    preserveGeometry: true,
    preserveCamera: true,
    preserveLighting: true,
    noInventedElements: true,
  },
  cameraMode: "controlled-motion",
  supportMaterial: [
    {
      kind: "guide",
      label: "Fluxo recomendado",
      body: "Decoração de Interiores → gere a imagem → traga para cá como primeiro frame → anime a montagem.",
    },
  ],
};

export const FULL_MODULES: ModuleDefinition[] = [
  decoracaoInteriores,
  casaEmTerreno,
  metragemDoTerreno,
  timelapseConstrucao,
  mobiliandoComodos,
];
