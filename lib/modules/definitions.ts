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
  promptTemplate: `Redecore este {{roomType|ambiente}} no estilo {{style}}, mantendo intactas a arquitetura, as janelas e o piso da foto de referência.
Iluminação {{lighting}}, capturada em {{cameraAngle}} com lente {{lens}}.
Paleta predominante: {{palette}}.
Incluir vegetação de interior discreta: {{greenery}}.
Acabamento fotorrealista de qualidade {{quality}}.`,
  systemRules: [
    "renderização fotorrealista, sem aparência de render CGI plastificado",
    "não alterar a planta, a metragem ou a posição das aberturas",
  ],
  hardNegatives: [
    "distorção de perspectiva",
    "móveis flutuantes",
    "texto ou marca d'água",
    "pessoas",
    "janelas ou portas inventadas",
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
      body: "Redecore esta sala de estar no estilo contemporâneo, mantendo intactas a arquitetura, as janelas e o piso da foto de referência. Iluminação natural suave, capturada em nível dos olhos com lente 35 mm. Paleta predominante: neutros quentes e madeira clara…",
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
    { key: "reference", label: "Foto do terreno", hint: "De frente para o lote, mostrando a testada e o entorno." },
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
        { value: "terrea", label: "Térrea", promptValue: "single-story house" },
        { value: "sobrado", label: "Sobrado", promptValue: "two-story house" },
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
  promptTemplate: `Insira uma casa {{houseType}} de {{floors|dois}} pavimento(s) sobre este terreno, alinhada aos limites reais visíveis na foto de referência.
Fachada {{facade}}. Paisagismo {{landscaping}} no recuo frontal.
Cena em {{weather}}, {{timeOfDay}}, vista em {{cameraAngle}}.
Escala coerente com a vizinhança e a rua existentes.
Acabamento fotorrealista de qualidade {{quality}}.`,
  systemRules: [
    "manter rua, calçada, postes e casas vizinhas exatamente como na referência",
    "escala arquitetônica plausível para um lote urbano",
  ],
  hardNegatives: [
    "alterar os limites do lote",
    "mudar a rua ou a vizinhança",
    "prédios altos ao fundo que não existem",
    "texto ou marca d'água",
    "pessoas em primeiro plano",
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
      body: "Insira uma casa moderna em volumes de dois pavimentos sobre este terreno, alinhada aos limites reais visíveis na foto. Fachada branco + madeira. Paisagismo moderado no recuo frontal. Cena em céu limpo, fim de tarde…",
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
    { key: "reference", label: "Foto aérea do terreno", hint: "Drone ou satélite, com o lote inteiro visível." },
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
  promptTemplate: `Sobre esta foto aérea, trace o perímetro exato do terreno com um feixe de luz na cor {{beamColor}}, estilo {{outlineStyle}}, espessura {{lineWeight}} e brilho a {{glowIntensity}}.
Escrever a metragem aproximada em {{areaUnit}} dentro do lote: {{showArea}}.
Não alterar nada da imagem original — apenas sobrepor o contorno e o texto.`,
  systemRules: [
    "a foto aérea permanece 100% intacta sob o overlay",
    "o contorno segue as divisas reais visíveis no terreno",
    "tipografia limpa e legível, sem serifa pesada",
  ],
  hardNegatives: [
    "redesenhar o terreno ou a vizinhança",
    "sombras ou reflexos falsos do feixe no chão",
    "múltiplos contornos sobrepostos",
    "marca d'água",
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
    { key: "reference", label: "Foto do terreno ou obra atual", hint: "Ponto de vista que ficará fixo durante todo o vídeo." },
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
  promptTemplate: `Timelapse acelerado, {{speed}}, construindo uma casa a partir deste terreno com a câmera 100% travada no enquadramento da foto.
Progressão visível pelas fases: {{stages}}.
Mostrar trabalhadores e maquinário em movimento acelerado: {{crew}}.
Céu com passagem de nuvens e sombras se movendo, {{weather}}.
Duração {{duration}}. Trilha {{music}}. Efeitos sonoros {{soundEffects}}.`,
  systemRules: [
    "câmera estática — nenhum pan, zoom ou reenquadramento",
    "o primeiro frame é idêntico à foto de referência",
    "geometria do terreno e do entorno constante entre frames",
  ],
  hardNegatives: [
    "morphing de estruturas",
    "flicker entre frames",
    "câmera flutuando ou girando",
    "a casa surgindo pronta de uma vez",
    "texto na tela",
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
    { key: "reference", label: "Foto do cômodo vazio", hint: "Ambiente sem móveis, com boa luz e ângulo reto." },
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
  promptTemplate: `A partir deste cômodo, anime os móveis entrando em cena {{animationSpeed}}, {{entryOrder}}, até o ambiente ficar completo.
Móveis no estilo {{furnitureStyle}}, pousando com peso realista e pequena sombra de contato.
Paredes, piso, janelas e ponto de vista permanecem fixos.
Leve aproximação de câmera: {{cameraDrift}}.
Duração {{duration}}. Trilha {{music}}. Efeitos sonoros {{soundEffects}}.`,
  systemRules: [
    "arquitetura do cômodo imóvel durante todo o clipe",
    "cada objeto mantém escala e material consistentes ao entrar",
    "movimento com física plausível, sem teletransporte",
  ],
  hardNegatives: [
    "paredes ou janelas mudando de lugar",
    "móveis atravessando uns aos outros",
    "morphing ou flicker",
    "mudança de iluminação brusca",
    "texto na tela",
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
