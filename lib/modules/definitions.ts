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
  styleOptions,
  timeOfDay,
  timelapseSpeedField,
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
        { value: "alto-padrao", label: "Alto padrão", promptValue: "premium high-end residence with upscale finishes and generous proportions" },
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
  pairedModule: "casa-em-terreno-video",
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
    {
      ...showAreaField,
      booleanText: {
        on: "write only the exact area value given in the additional details below, inside the lot — never invent, estimate or approximate a number that wasn't provided",
        off: "no area text of any kind",
      },
    },
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
  promptRole:
    "You are an aerial real-estate image analyst and precision boundary-visualization specialist — your only job is to trace the lot's true perimeter exactly as it appears in the photo, never to invent, approximate or reinterpret it.",
  promptTemplate: `Over this aerial photo, trace the lot's exact perimeter with a {{beamColor}} light beam, {{outlineStyle}} style, {{lineWeight}} thickness and {{glowIntensity}} glow intensity.
Area label in {{areaUnit}}: {{showArea}}.
Do not alter anything in the original image — only overlay the outline and the text.`,
  systemRules: [
    "the aerial photo stays 100% intact under the overlay",
    "the outline follows the real boundaries visible on the lot",
    "clean, legible typography, no heavy serif",
    "the overlay blends seamlessly with the original photo's lighting, shadow direction and resolution — no artificial distortion",
    "outline edges stay sharp and high-definition",
  ],
  hardNegatives: [
    "redrawing the lot or the neighborhood",
    "fake shadows or reflections from the beam on the ground",
    "multiple overlapping outlines",
    "watermark",
    "writing a placeholder or invented area value, unit or label (e.g. \"XXX m²\", \"ÁREA:\") when no exact value was provided",
    "approximating, estimating or calculating a measurement that wasn't explicitly given",
  ],
  fidelity: {
    preserveStructure: true,
    noPropertyChanges: true,
    noInventedElements: true,
    preserveCamera: true,
  },
  cameraMode: "static",
  pairedModule: "metragem-animada",
  supportMaterial: [
    {
      kind: "walkthrough",
      label: "Passo a passo: overlay de metragem",
      body: "1. Consiga a foto aérea. 2. Defina cor e estilo do traço. 3. Gere. 4. Troque para o modo Vídeo aqui mesmo para animar o contorno.",
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
    timelapseSpeedField,
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
      defaultValue: ["terraplenagem", "fundacao", "estrutura", "cobertura", "acabamento"],
      options: [
        { value: "terraplenagem", label: "Terraplenagem", promptValue: "ground breaking and site excavation" },
        { value: "fundacao", label: "Fundação", promptValue: "foundation and concrete structure" },
        { value: "estrutura", label: "Estrutura", promptValue: "structural walls and columns rising" },
        { value: "alvenaria", label: "Alvenaria", promptValue: "masonry walls going up" },
        { value: "cobertura", label: "Cobertura", promptValue: "roof assembly" },
        { value: "acabamento", label: "Acabamento e pintura", promptValue: "facade cladding and exterior finishing" },
        { value: "paisagismo", label: "Paisagismo final", promptValue: "landscaping and final details" },
      ],
    },
    crewField,
    weatherField,
  ],
  promptRole:
    "You are a cinematic construction-timelapse director. The reference photo is the starting state; animate a realistic build progressing through the selected stages, in physically logical order.",
  promptTemplate: `Ultra-realistic accelerated construction timelapse, {{speed}}, building a house from this lot with the camera 100% locked to the photo's framing.
Visible progression through the stages, each advancing in logical order: {{stages}}.
Natural time-of-day cycling as construction advances — morning through midday, afternoon and warm sunset — with interior lights gradually turning on and exterior lighting activating as the house nears completion.
Show workers and machinery in accelerated motion: {{crew}}.
Sky with moving clouds and shifting shadows, {{weather}}.
Duration {{duration}}. Soundtrack {{music}}. Sound effects {{soundEffects}}.`,
  systemRules: [
    "static camera — no pan, zoom or reframing",
    "the first frame is identical to the reference photo",
    "lot and surroundings geometry stays constant across frames",
    "never let the same building style drift or change identity between stages — it is one continuous build, not several different houses",
  ],
  hardNegatives: [
    "structure morphing",
    "flicker between frames",
    "camera floating or rotating",
    "the house appearing fully built all at once",
    "on-screen text",
    "an apartment tower, commercial building or any structure inconsistent with a single house",
  ],
  fidelity: {
    lockedCamera: true,
    preserveObjectPlacement: true,
    noPropertyChanges: true,
    noInventedElements: true,
  },
  cameraMode: "locked",
  nextModule: "reforma-cinematografica",
  structuredExtras: {
    lighting: {
      transitions: "natural time-of-day cycling — morning through midday, afternoon and warm sunset — as construction advances",
      final_reveal: "interior lights gradually turn on and exterior lighting activates as the house nears completion",
    },
  },
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
    "Anime a mobília entrando em um cômodo vazio, peça por peça, até bater exatamente com uma foto de referência já decorada.",
  longDescription:
    "A partir da foto do cômodo vazio e de uma referência decorada (ex.: resultado de 'Decoração de Interiores'), a IA cria um vídeo curto em que os móveis ‘crescem’ do chão em sequência, cada um na posição exata da referência, mantendo paredes, piso e janelas fixos.",
  category: "interiores",
  type: "video-two-images",
  accessLevel: "pro",
  thumbnailAlt: "Cômodo totalmente mobiliado e iluminado, pronto para anúncio",
  requiredImages: [
    {
      key: "empty",
      label: "Cômodo vazio",
      hint: "Ambiente sem móveis, com boa luz e ângulo reto.",
      promptLabel: "Empty room",
      promptRole: "Starting state and the only source for the environment — walls, floor, ceiling, windows, doors, light and camera perspective are locked to this frame and never change.",
    },
    {
      key: "furnished",
      label: "Cômodo decorado",
      hint: "Resultado do módulo Decoração de Interiores, ou qualquer referência de como o ambiente deve ficar mobiliado.",
      promptLabel: "Furnished room",
      promptRole: "Ending state and the only source for the furniture — every piece's exact position, size, style, color and material comes from this image. The final frame of the clip must be identical to it.",
    },
  ],
  minImages: 2,
  recommendedTool: "google-flow",
  availableTools: ["google-flow", "runway", "pika"],
  allowStructuredJson: true,
  featured: true,
  instructions: [
    "Envie o cômodo vazio e uma referência decorada, nessa ordem — o resultado de 'Decoração de Interiores' funciona bem.",
    "Câmera fica parada; só os móveis se movem.",
  ],
  toolGuide: {
    tool: "google-flow",
    path: ["Vídeo", "Elementos", "Omni Flash"],
    steps: [
      "Modo Vídeo no Google Flow.",
      "Envie o cômodo vazio como primeiro frame e a versão decorada como referência final.",
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
      key: "entryOrder",
      type: "select",
      label: "Ordem de entrada",
      defaultValue: "grandes-primeiro",
      options: [
        { value: "grandes-primeiro", label: "Peças grandes primeiro", promptValue: "large furniture first, then smaller furniture, then rugs, then lighting, then decorative objects" },
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
  promptRole:
    "You are a precision furniture-placement renderer, not a creative interior designer. The first image is the only source for the environment; the second image is the only source for every furniture and decor piece. You are not allowed to interpret, improvise or invent any element.",
  promptTemplate: `Animate the transition from the empty room (first image) to the fully furnished room (second image): each furniture and decor piece grows smoothly upward from the floor, at its exact final position, size, style, color and material as shown in the second image, {{animationSpeed}}, {{entryOrder}}, until the room matches the second image exactly.
No sliding, flying in or fading from thin air — growth starts at the base and expands upward to full size only.
Walls, floor, windows, light and point of view stay exactly as in the first image throughout. Slight camera push-in: {{cameraDrift}}.
Duration {{duration}}. Soundtrack {{music}}. Sound effects {{soundEffects}}.`,
  systemRules: [
    "the room's architecture (walls, floor, ceiling, windows, doors) stays motionless and identical to the first image throughout the clip",
    "every furniture and decor piece's exact position, size, style, color and material comes from the second image — never invented or approximated",
    "each piece appears exactly once, growing upward from the floor to full size — never sliding in, flying in or fading from the air",
    "once placed, a piece never moves, disappears or changes again",
    "every piece visible in the second image must appear, and nothing is added that isn't in it",
    "the final frame matches the second image exactly",
  ],
  hardNegatives: [
    "walls, floor, ceiling, windows or doors changing position, color or material",
    "changing the camera angle, perspective or framing at any point",
    "furniture clipping through each other",
    "a placeholder or draft version of a piece before its final form",
    "a piece appearing in a different style, color or position before settling into its final one",
    "any piece moving, disappearing or changing after being placed",
    "any piece appearing more than once",
    "an element not visible in the second image",
    "skipping any element visible in the second image",
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
      body: "Decoração de Interiores → gere a imagem → use aqui como referência decorada, junto com a foto do cômodo vazio.",
    },
  ],
  structuredExtras: {
    placement: {
      order: "large furniture first, then smaller furniture, then rugs, then lighting, then decorative objects",
      style: "each piece grows smoothly upward from the floor to full size, exactly as it appears in the second image — never sliding, flying in or fading from the air",
      rules: [
        "identity lock: each piece appears in its exact final style, color, material and design from the moment it becomes visible — no placeholder or draft version",
        "position lock: each piece appears at its exact position and scale from the second image — no approximation",
        "single appearance: each piece appears exactly once and never moves again after being placed",
        "completeness: every piece visible in the second image appears; nothing is skipped or added",
      ],
    },
  },
};

export const FULL_MODULES: ModuleDefinition[] = [
  decoracaoInteriores,
  casaEmTerreno,
  metragemDoTerreno,
  timelapseConstrucao,
  mobiliandoComodos,
];
