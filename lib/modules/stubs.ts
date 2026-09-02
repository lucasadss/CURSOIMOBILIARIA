import type {
  FieldConfig,
  ImageSlot,
  ModuleDefinition,
  ModuleType,
  StepRef,
  SupportMaterial,
  ToolGuideConfig,
} from "@/types";
import type { CameraMode, CategorySlug, FidelityRules, PromptFormat, TargetTool } from "@/types";
import {
  beamColorField,
  cameraAngle,
  cameraMovementField,
  crewField,
  desiredStyle,
  droneAltitudeField,
  durationField,
  extraDetails,
  glowStyleField,
  lensOptions,
  musicField,
  paletteOptions,
  showAreaField,
  soundEffectsField,
  speedField,
  stabilizationField,
  timeOfDay,
  transformLevel,
  weatherField,
} from "./shared";

/**
 * The remaining 17 modules of the catalogue, brought to the same bar as the
 * 5 flagship modules in definitions.ts: real fields, module-specific rules,
 * fidelity, hard negatives and a technical prompt template. `stub()` only
 * removes boilerplate — every module still declares its own content.
 */

interface StubInput {
  name: string;
  slug: string;
  description: string;
  category: CategorySlug;
  type: ModuleType;
  accessLevel?: ModuleDefinition["accessLevel"];
  images: ImageSlot[];
  minImages?: number;
  tool?: TargetTool;
  availableTools?: TargetTool[];
  defaultFormat?: PromptFormat;
  allowStructuredJson?: boolean;
  instructions?: string[];
  toolGuide?: ToolGuideConfig;
  beginner: FieldConfig[];
  advanced?: FieldConfig[];
  template: string;
  systemRules?: string[];
  hardNegatives?: string[];
  fidelity?: FidelityRules;
  cameraMode?: CameraMode;
  toolOverrides?: Partial<Record<TargetTool, string>>;
  steps?: StepRef[];
  nextModule?: string;
  dependsOn?: string;
  supportMaterial?: SupportMaterial[];
  isNew?: boolean;
  thumbnailAlt?: string;
  thumbnailPosition?: string;
}

const DEFAULT_VIDEO_NEGATIVES = [
  "sem tremor ou deriva indesejada de câmera",
  "sem distorção de lente",
  "sem morphing de objetos",
  "sem mudanças de geometria entre frames",
  "sem flicker",
  "sem texto ou legendas na tela",
  "sem logos",
  "sem marca d'água",
];

function stub(i: StubInput): ModuleDefinition {
  const isVideo = i.type.startsWith("video");
  return {
    name: i.name,
    slug: i.slug,
    description: i.description,
    category: i.category,
    type: i.type,
    accessLevel: i.accessLevel ?? "free",
    requiredImages: i.images,
    minImages: i.minImages ?? i.images.length,
    recommendedTool: i.tool ?? "google-flow",
    availableTools:
      i.availableTools ??
      (isVideo
        ? ["google-flow", "runway", "pika", "sora"]
        : ["google-flow", "midjourney"]),
    defaultFormat: i.defaultFormat,
    allowStructuredJson: i.allowStructuredJson ?? isVideo,
    instructions: i.instructions,
    toolGuide: i.toolGuide,
    beginnerFields: i.beginner,
    advancedFields: i.advanced ?? [],
    promptTemplate: i.template,
    systemRules: i.systemRules,
    hardNegatives: i.hardNegatives ?? (isVideo ? DEFAULT_VIDEO_NEGATIVES : []),
    fidelity: i.fidelity,
    cameraMode: i.cameraMode,
    toolOverrides: i.toolOverrides,
    steps: i.steps,
    nextModule: i.nextModule,
    dependsOn: i.dependsOn,
    supportMaterial: i.supportMaterial,
    isNew: i.isNew,
    thumbnailAlt: i.thumbnailAlt,
    thumbnailPosition: i.thumbnailPosition,
  };
}

/* ============================================================================
   Shared image-slot pairs — specific labels, never "Imagem 1 / Imagem 2".
   ========================================================================== */

const antesDepois: ImageSlot[] = [
  { key: "before", label: "Antes", hint: "Foto real do ambiente hoje." },
  { key: "after", label: "Depois", hint: "Referência de como deve ficar (opcional se preencher pelos campos)." },
];

const flowGuide = (path: string[], steps: string[]): ToolGuideConfig => ({
  tool: "google-flow",
  path,
  steps,
});

/* ============================================================================
   1. Antes e Depois (Decoração)
   ========================================================================== */

const antesEDepoisDecoracao = stub({
  name: "Antes e Depois (Decoração)",
  slug: "antes-e-depois-decoracao",
  description: "Pegue a foto atual e gere a versão decorada, lado a lado com o original.",
  category: "interiores",
  type: "image-custom",
  images: [{ key: "before", label: "Antes", hint: "Foto real do ambiente hoje, sem edição." }],
  instructions: [
    "Envie a foto do ambiente como ele está agora — sem móveis extras fora de quadro.",
    "O comparativo final mostra a foto original ao lado do resultado gerado.",
  ],
  toolGuide: flowGuide(
    ["Imagem", "Referência", "Editar cena"],
    [
      "Projeto de Imagem no Google Flow.",
      "Anexe a foto atual como referência única.",
      "Cole o prompt e gere o lado ‘depois’; monte o comparativo ao lado da foto original.",
    ],
  ),
  beginner: [desiredStyle, transformLevel, extraDetails],
  advanced: [
    {
      key: "palette",
      type: "multiselect",
      label: "Paleta",
      options: paletteOptions.filter((o) =>
        ["neutros-quentes", "off-white", "terrosos", "verde-profundo"].includes(o.value),
      ),
    },
    {
      key: "materials",
      type: "multiselect",
      label: "Materiais",
      options: [
        { value: "madeira", label: "Madeira natural", promptValue: "natural wood finishes" },
        { value: "linho", label: "Linho / tecidos crus", promptValue: "linen and raw-textile upholstery" },
        { value: "metal-escovado", label: "Metal escovado", promptValue: "brushed-metal fixtures" },
        { value: "pedra", label: "Pedra / mármore", promptValue: "stone or marble surfaces" },
      ],
    },
    { ...cameraAngle, label: "Ângulo" },
    {
      key: "keepFurniture",
      type: "toggle",
      label: "Preservar móveis existentes",
      description: "Reaproveita as peças da foto em vez de substituir tudo.",
      defaultValue: false,
      booleanText: {
        on: "reuse the existing furniture pieces, only restyling the surroundings",
        off: "replace the furniture entirely to match the chosen style",
      },
    },
  ],
  template: `Gere a versão ‘depois’ deste ambiente no estilo {{desiredStyle}}, nível de transformação {{transformLevel}} de 5.
Paleta predominante: {{palette}}. Materiais de destaque: {{materials}}.
Preservar os móveis existentes na composição, apenas reestilizando o entorno: {{keepFurniture}}.
Manter arquitetura, janelas, piso e ponto de vista idênticos aos da foto original — apenas a ambientação muda.`,
  systemRules: [
    "gerar apenas o lado ‘depois’ — o ‘antes’ é a própria foto enviada, sem reprocessar",
    "manter exatamente o mesmo enquadramento e distância focal do original",
  ],
  hardNegatives: [
    "mover portas ou janelas",
    "alterar as dimensões do ambiente",
    "criar cômodos adicionais",
    "deformar móveis que devem ser preservados",
    "pessoas",
    "texto ou marca d'água",
  ],
  fidelity: {
    preserveStructure: true,
    preserveGeometry: true,
    preserveCamera: true,
    noInventedElements: true,
  },
  cameraMode: "static",
  dependsOn: "decoracao-de-interiores",
  nextModule: "reforma-cinematografica",
});

/* ============================================================================
   2. Casa em Terreno (Vídeo)
   ========================================================================== */

const casaEmTerrenoVideo = stub({
  name: "Casa em Terreno (Vídeo)",
  slug: "casa-em-terreno-video",
  description: "Anime a transição do terreno vazio até a casa pronta implantada nele.",
  category: "terrenos",
  type: "video-two-images",
  accessLevel: "pro",
  images: [
    { key: "empty", label: "Terreno vazio", hint: "A mesma foto usada em Casa em Terreno." },
    { key: "built", label: "Casa pronta", hint: "Resultado gerado no módulo Casa em Terreno." },
  ],
  allowStructuredJson: true,
  instructions: [
    "Use a foto original do terreno e o resultado do módulo Casa em Terreno, nessa ordem.",
    "O movimento de câmera é sutil — o foco é a transição do lote para a construção.",
  ],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    [
      "Modo Vídeo no Google Flow.",
      "Envie o terreno vazio como primeiro frame e a casa pronta como referência final.",
      "Cole o prompt e gere — câmera com leve movimento contínuo.",
    ],
  ),
  beginner: [speedField, musicField, extraDetails],
  advanced: [
    durationField,
    soundEffectsField,
    cameraMovementField,
    crewField,
    weatherField,
  ],
  template: `Anime a transição do terreno vazio (primeira imagem) até a casa pronta (segunda imagem), com ritmo {{speed}}, movimento de câmera {{cameraMovement}}.
A casa final deve permanecer estritamente fiel à segunda imagem — mesma fachada, proporções e posição no lote.
Trabalhadores e maquinário visíveis durante a transição: {{crew}}. Céu {{weather}}.`,
  systemRules: [
    "a última imagem do vídeo deve corresponder exatamente à foto ‘casa pronta’ fornecida",
    "limites do lote e via pública idênticos em todos os frames",
    "o eixo, a lente e a leitura arquitetônica da câmera permanecem consistentes mesmo quando ela se move",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "casa final diferente da imagem de referência fornecida",
    "alterar os limites do lote",
  ],
  fidelity: {
    preserveCamera: true,
    noPropertyChanges: true,
  },
  cameraMode: "controlled-motion",
  dependsOn: "casa-em-terreno",
  nextModule: "voo-de-drone",
  steps: [
    { label: "Casa no terreno (imagem)", moduleSlug: "casa-em-terreno" },
    { label: "Casa no terreno (vídeo)", moduleSlug: "casa-em-terreno-video" },
  ],
});

/* ============================================================================
   3. Metragem Animada
   ========================================================================== */

const metragemAnimada = stub({
  name: "Metragem Animada",
  slug: "metragem-animada",
  description: "Anime o traço de luz percorrendo o perímetro até fechar o contorno do lote.",
  category: "terrenos",
  type: "video-two-images",
  accessLevel: "pro",
  images: [
    { key: "original", label: "Terreno original", hint: "Foto aérea sem overlay." },
    { key: "outlined", label: "Terreno com contorno", hint: "Resultado do módulo Metragem do Terreno." },
  ],
  defaultFormat: "structured_json",
  instructions: [
    "Use a foto aérea original e o resultado com o contorno já desenhado, nessa ordem.",
    "A câmera fica 100% travada — só o traço de luz se move.",
  ],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    [
      "Modo Vídeo no Google Flow.",
      "Envie a foto aérea original como primeiro frame e a versão com contorno como referência final.",
      "Gere em formato JSON estruturado para maior controle da ferramenta.",
    ],
  ),
  beginner: [
    { ...speedField, label: "Velocidade do traçado" },
    soundEffectsField,
    showAreaField,
    extraDetails,
  ],
  advanced: [durationField, beamColorField],
  template: `Anime o feixe de luz {{beamColor}} percorrendo o perímetro do lote {{speed}} até fechar exatamente o contorno já definido na segunda imagem.
Ao fechar, revelar a metragem sobre o lote: {{showArea}}.
A foto aérea de fundo permanece 100% estática — câmera travada, nenhuma outra parte da cena muda.`,
  systemRules: [
    "câmera totalmente travada — nenhum pan, zoom ou reenquadramento",
    "o contorno final deve corresponder exatamente ao da segunda imagem, sem redesenhar",
    "preservar a cor e a posição do contorno definidos na referência",
    "não criar texto além da metragem, se não solicitado",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "redesenhar o contorno com traçado diferente da referência",
    "sombras ou reflexos falsos do feixe no chão",
  ],
  fidelity: {
    preserveStructure: true,
    lockedCamera: true,
    noPropertyChanges: true,
    noInventedElements: true,
  },
  cameraMode: "locked",
  dependsOn: "metragem-do-terreno",
  steps: [
    { label: "Criar metragem", moduleSlug: "metragem-do-terreno" },
    { label: "Animar metragem", moduleSlug: "metragem-animada" },
  ],
});

/* ============================================================================
   4. Timelapse de Reforma Interior
   ========================================================================== */

const timelapseReformaInterior = stub({
  name: "Timelapse de Reforma Interior",
  slug: "timelapse-de-reforma-interior",
  description: "Timelapse de um cômodo sendo reformado, do estado atual ao acabamento final.",
  category: "interiores",
  type: "video-two-images",
  accessLevel: "pro",
  images: antesDepois,
  instructions: [
    "Envie a foto do estado atual e uma referência de como deve ficar pronto.",
    "O resultado final precisa bater com a segunda imagem em composição e estrutura.",
  ],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    [
      "Modo Vídeo no Google Flow.",
      "Envie o ‘antes’ como primeiro frame e o ‘depois’ como referência final.",
      "Gere com câmera travada, do início ao fim.",
    ],
  ),
  beginner: [speedField, musicField, extraDetails],
  advanced: [
    durationField,
    soundEffectsField,
    transformLevel,
    crewField,
    {
      key: "lightingTransition",
      type: "toggle",
      label: "Transição de iluminação",
      description: "A luz evolui gradualmente do estado atual até o final.",
      defaultValue: true,
      booleanText: {
        on: "light evolves gradually from the initial to the final state",
        off: "lighting stays constant, no gradual transition",
      },
    },
  ],
  template: `Timelapse de reforma deste cômodo, câmera travada, ritmo {{speed}}, do estado inicial (primeira imagem) até o acabamento final (segunda imagem).
Intensidade da transformação {{transformLevel}} de 5. Trabalhadores e ferramentas visíveis: {{crew}}.
Transição gradual de iluminação entre os dois estados: {{lightingTransition}}.
O resultado final deve corresponder exatamente à segunda imagem em composição, estrutura e ponto de vista.`,
  systemRules: [
    "câmera travada do início ao fim, sem reenquadramento",
    "o último frame deve corresponder exatamente à imagem ‘depois’ fornecida",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "resultado final diferente da imagem de referência",
    "criar cômodos ou aberturas adicionais",
  ],
  fidelity: {
    preserveStructure: true,
    lockedCamera: true,
  },
  cameraMode: "locked",
});

/* ============================================================================
   5. Reforma Cinematográfica
   ========================================================================== */

const reformaCinematografica = stub({
  name: "Reforma Cinematográfica",
  slug: "reforma-cinematografica",
  description: "Transição cinematográfica entre um ‘antes’ e um ‘depois’ — interior, fachada, casa inteira ou imóvel comercial.",
  category: "cinematograficos",
  type: "video-two-images",
  accessLevel: "premium",
  isNew: true,
  images: antesDepois,
  instructions: [
    "Funciona com qualquer par antes/depois: interior, fachada, casa, apartamento ou imóvel comercial.",
    "Funciona melhor com fotos no mesmo ângulo — a IA interpola entre elas.",
    "Evite mudanças bruscas de enquadramento entre as duas imagens enviadas.",
  ],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    [
      "Modo Vídeo no Google Flow.",
      "Envie o ‘antes’ e o ‘depois’, nessa ordem.",
      "Gere com movimento de câmera contínuo para reforçar o efeito cinematográfico.",
    ],
  ),
  beginner: [musicField, extraDetails],
  advanced: [
    durationField,
    soundEffectsField,
    cameraMovementField,
    {
      key: "lightingStyle",
      type: "select",
      label: "Estilo de iluminação",
      defaultValue: "quente",
      options: [
        { value: "quente", label: "Quente e aconchegante", promptValue: "warm cinematic color grade" },
        { value: "neutra", label: "Neutra editorial", promptValue: "neutral editorial color grade" },
        { value: "dramatica", label: "Dramática, alto contraste", promptValue: "dramatic high-contrast grade" },
      ],
    },
  ],
  template: `Transição cinematográfica orgânica da imagem inicial (antes) para a final (depois), com movimento de câmera {{cameraMovement}}.
Interpolar iluminação, materiais e volumetria de forma gradual, sem morphing brusco — o espectador sente a passagem do tempo, não um corte.
Grade de cor {{lightingStyle}}. Evitar transformação fantasiosa: manter apenas o que é plausível entre os dois estados reais.`,
  systemRules: [
    "a interpolação deve permanecer fisicamente plausível — sem elementos que não existam em nenhuma das duas fotos",
    "o eixo, a lente e a leitura arquitetônica da câmera permanecem consistentes do início ao fim, mesmo quando ela se move",
  ],
  hardNegatives: [...DEFAULT_VIDEO_NEGATIVES, "elementos fantasiosos que não existem em nenhuma das duas fotos"],
  fidelity: {
    preserveCamera: true,
  },
  cameraMode: "controlled-motion",
});

/* ============================================================================
   6. Antes e Depois (Geral)
   ========================================================================== */

const antesEDepoisGeral = stub({
  name: "Antes e Depois (Geral)",
  slug: "antes-e-depois-geral",
  description: "Comparativo em vídeo para fachadas, áreas externas, terrenos ou obras.",
  category: "construcao",
  type: "video-two-images",
  images: antesDepois,
  instructions: [
    "Serve para qualquer par antes/depois: imóvel antigo → novo, terreno → construção, reforma ou fachada.",
    "Mantenha as duas fotos no mesmo ângulo para o wipe ficar alinhado.",
  ],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    ["Modo Vídeo no Google Flow.", "Envie o ‘antes’ e o ‘depois’, nessa ordem.", "Gere e ajuste a direção do wipe se necessário."],
  ),
  beginner: [speedField, extraDetails],
  advanced: [
    durationField,
    soundEffectsField,
    {
      key: "wipeDirection",
      type: "segmented-control",
      label: "Direção do wipe",
      defaultValue: "esquerda-direita",
      options: [
        { value: "esquerda-direita", label: "Esquerda → direita", promptValue: "left-to-right wipe reveal" },
        { value: "cima-baixo", label: "Cima → baixo", promptValue: "top-to-bottom wipe reveal" },
        { value: "central", label: "Central (íris)", promptValue: "center-out iris wipe reveal" },
      ],
    },
  ],
  template: `Revele o ‘depois’ sobre o ‘antes’ com um wipe {{wipeDirection}}, ritmo {{speed}}.
Ponto de vista idêntico nas duas imagens — o alinhamento entre elas é o que vende o efeito.`,
  systemRules: ["as duas imagens permanecem inalteradas — o efeito é só a transição entre elas"],
  fidelity: { lockedCamera: true },
  cameraMode: "locked",
});

/* ============================================================================
   7. Building Revealing
   ========================================================================== */

const buildingRevealing = stub({
  name: "Building Revealing",
  slug: "building-revealing",
  description: "Componha a imagem-base de um edifício sendo revelado por um plano de luz.",
  category: "construcao",
  type: "image-custom",
  images: [{ key: "reference", label: "Terreno ou construção atual", hint: "Foto real do lote ou obra." }],
  instructions: [
    "Esta imagem é a base para a animação — o resultado aqui não muda o prédio em si.",
    "Leve o resultado para ‘Building Revealing (Vídeo)’ para animar a revelação.",
  ],
  toolGuide: flowGuide(
    ["Imagem", "Referência", "Compor"],
    ["Projeto de Imagem no Google Flow.", "Anexe a foto do terreno ou obra atual.", "Cole o prompt e gere em 3:2."],
  ),
  beginner: [
    {
      key: "coverageIntensity",
      type: "slider",
      label: "Intensidade da cobertura",
      min: 10,
      max: 100,
      step: 5,
      unit: "%",
      defaultValue: 60,
      description: "Quanto do prédio já aparece construído vs. em wireframe de luz.",
    },
    glowStyleField,
    extraDetails,
  ],
  advanced: [
    { ...beamColorField, label: "Cor (opcional)", required: false },
    { ...cameraAngle, defaultValue: "nivel-olhos" },
  ],
  template: `Componha um edifício sendo ‘revelado’ por um plano de luz {{glowStyle}} sobre o terreno da referência, cobertura de {{coverageIntensity}}.
Metade construída em detalhe fotorrealista, metade ainda em wireframe de luz {{beamColor|âmbar}}.
Não alterar o prédio nem o terreno — apenas compor o efeito de revelação sobre a cena real.`,
  systemRules: [
    "o terreno e o entorno da foto original permanecem inalterados",
    "o wireframe de luz não invade a via pública nem terrenos vizinhos",
  ],
  hardNegatives: ["redesenhar o terreno", "alterar a vizinhança", "texto ou marca d'água"],
  fidelity: { noPropertyChanges: true, preserveCamera: true },
  cameraMode: "static",
  nextModule: "building-revealing-video",
  steps: [
    { label: "Criar revelação (imagem)", moduleSlug: "building-revealing" },
    { label: "Animar revelação (vídeo)", moduleSlug: "building-revealing-video" },
  ],
});

/* ============================================================================
   8. Building Revealing (Vídeo)
   ========================================================================== */

const buildingRevealingVideo = stub({
  name: "Building Revealing (Vídeo)",
  slug: "building-revealing-video",
  description: "Anima o plano de luz varrendo a cena até revelar o edifício completo.",
  category: "construcao",
  type: "video-single-image",
  accessLevel: "pro",
  images: [{ key: "reference", label: "Imagem gerada no Building Revealing", hint: "Resultado do módulo Building Revealing." }],
  instructions: ["Use exatamente o resultado gerado em ‘Building Revealing’ como referência."],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    ["Modo Vídeo no Google Flow.", "Envie a imagem do Building Revealing como primeiro frame.", "Câmera fixa — só o plano de luz se move."],
  ),
  beginner: [speedField, musicField, extraDetails],
  advanced: [durationField, soundEffectsField, timeOfDay, glowStyleField],
  template: `Anime o plano de luz {{glowStyle}} varrendo a cena {{speed}} até materializar o edifício completo, exatamente como na imagem de referência.
Câmera fixa do início ao fim. Luz de {{timeOfDay}}.
Preservar exatamente o prédio e o terreno da imagem base — a única coisa que muda é a revelação progressiva.`,
  systemRules: [
    "câmera 100% travada",
    "o edifício final deve corresponder exatamente à imagem de referência, sem redesenhar",
  ],
  hardNegatives: [...DEFAULT_VIDEO_NEGATIVES, "edifício final diferente da imagem de referência"],
  fidelity: { lockedCamera: true, noPropertyChanges: true, noInventedElements: true },
  cameraMode: "locked",
  dependsOn: "building-revealing",
  thumbnailAlt: "Vista aérea de uma propriedade cercada por terras cultivadas ao entardecer",
});

/* ============================================================================
   9. Timelapse Construção Simples
   ========================================================================== */

const timelapseConstrucaoSimples = stub({
  name: "Timelapse Construção Simples",
  slug: "timelapse-construcao-simples",
  description: "Versão enxuta do timelapse de obra, direto do terreno ao projeto pronto.",
  category: "construcao",
  type: "video-two-images",
  accessLevel: "pro",
  images: [
    { key: "empty", label: "Terreno", hint: "Foto do lote vazio." },
    { key: "final", label: "Projeto finalizado", hint: "Referência de como a obra deve terminar." },
  ],
  instructions: ["Versão rápida do timelapse — só 3 marcos, sem estágios detalhados."],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    ["Modo Vídeo no Google Flow.", "Envie o terreno e o projeto finalizado, nessa ordem.", "Gere com câmera travada."],
  ),
  beginner: [extraDetails],
  advanced: [durationField, speedField, {
    key: "milestones",
    type: "segmented-control",
    label: "Marcos visíveis",
    defaultValue: "3",
    options: [
      { value: "2", label: "2", promptValue: "two milestones: foundation, finished" },
      { value: "3", label: "3", promptValue: "three milestones: foundation, structure, finished" },
      { value: "4", label: "4", promptValue: "four milestones: foundation, structure, envelope, finished" },
    ],
  }, crewField, soundEffectsField],
  template: `Timelapse curto de construção, câmera travada, {{speed}}, passando por {{milestones}} marcos entre o terreno (primeira imagem) e o projeto finalizado (segunda imagem).
A construção final deve corresponder exatamente à segunda imagem. Trabalhadores e maquinário: {{crew}}.`,
  systemRules: ["câmera travada", "o resultado final corresponde exatamente à imagem ‘projeto finalizado’"],
  hardNegatives: [...DEFAULT_VIDEO_NEGATIVES, "resultado final diferente da referência"],
  fidelity: { lockedCamera: true, noPropertyChanges: true },
  cameraMode: "locked",
});

/* ============================================================================
   10. Apresentação Profissional
   ========================================================================== */

const apresentacaoProfissional = stub({
  name: "Apresentação Profissional",
  slug: "apresentacao-profissional",
  description: "Recorrido contínuo pelos ambientes principais do imóvel, com ritmo de anúncio.",
  category: "imovel-pronto",
  type: "video-multi-image",
  images: [
    { key: "room1", label: "Ambiente 1", hint: "Ex.: fachada ou sala." },
    { key: "room2", label: "Ambiente 2" },
    { key: "room3", label: "Ambiente 3" },
    { key: "room4", label: "Ambiente 4 (opcional)" },
  ],
  minImages: 3,
  allowStructuredJson: true,
  defaultFormat: "structured_json",
  instructions: [
    "Envie os ambientes na ordem em que devem aparecer no vídeo — a IA respeita essa sequência.",
    "3 imagens já funcionam; a quarta é opcional para recorridos mais longos.",
  ],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    ["Modo Vídeo no Google Flow.", "Envie os ambientes na ordem do recorrido.", "Gere com transições suaves entre eles."],
  ),
  beginner: [
    {
      key: "presentationPace",
      type: "segmented-control",
      label: "Ritmo da apresentação",
      defaultValue: "natural",
      options: [
        { value: "suave", label: "Suave", promptValue: "slow elegant stabilized walkthrough with gentle transitions between spaces" },
        { value: "natural", label: "Natural", promptValue: "balanced real-estate walkthrough pacing with smooth continuous camera movement" },
        { value: "dinamico", label: "Dinâmico", promptValue: "moderately faster cinematic walkthrough while preserving smooth transitions and architectural readability" },
      ],
    },
  ],
  advanced: [
    { ...speedField, label: "Velocidade da câmera" },
    {
      key: "transitionStyle",
      type: "select",
      label: "Estilo de transição",
      defaultValue: "corte-suave",
      options: [
        { value: "corte-suave", label: "Corte suave", promptValue: "smooth cross-dissolve cut between rooms" },
        { value: "movimento-continuo", label: "Movimento contínuo", promptValue: "continuous walking-through camera move between rooms" },
        { value: "corte-seco", label: "Corte seco no ritmo", promptValue: "clean hard cut on the beat" },
      ],
    },
    durationField,
    stabilizationField,
    extraDetails,
  ],
  template: `Vídeo de apresentação contínuo, percorrendo os ambientes na ordem enviada, ritmo {{presentationPace}}, com cortes limpos.`,
  systemRules: [
    "respeitar exatamente a ordem das imagens enviadas",
    "nunca misturar elementos de ambientes diferentes em um mesmo frame",
    "manter a identidade visual do mesmo imóvel do início ao fim (mesma paleta, mesmo acabamento)",
    "movimento de câmera suave — sem teleporte entre ambientes",
  ],
  hardNegatives: [...DEFAULT_VIDEO_NEGATIVES, "misturar ambientes diferentes", "pular a ordem enviada"],
  fidelity: { preserveStructure: true, preserveObjectPlacement: true, preserveCamera: true },
  cameraMode: "controlled-motion",
  thumbnailAlt: "Quarto amplo com cortina translúcida e luz retroiluminada",
});

/* ============================================================================
   11. Entrada Cinematográfica
   ========================================================================== */

const entradaCinematografica = stub({
  name: "Entrada Cinematográfica",
  slug: "entrada-cinematografica",
  description: "Plano único de entrada pela porta principal, revelando hall e sala em profundidade.",
  category: "imovel-pronto",
  type: "video-single-image",
  images: [{ key: "reference", label: "Fachada / entrada do imóvel", hint: "Foto da entrada, porta visível e centralizada." }],
  instructions: ["Use uma foto com a porta principal centralizada e bem iluminada."],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    ["Modo Vídeo no Google Flow.", "Envie a foto da entrada como primeiro frame.", "Gere um push-in único, sem cortes."],
  ),
  beginner: [{ ...speedField, label: "Velocidade do push-in" }, soundEffectsField, extraDetails],
  advanced: [
    durationField,
    {
      key: "intensity",
      type: "slider",
      label: "Intensidade do movimento",
      min: 10,
      max: 100,
      step: 5,
      unit: "%",
      defaultValue: 45,
    },
    { key: "altitude", type: "segmented-control", label: "Altura da câmera", defaultValue: "media", options: [
      { value: "baixa", label: "Baixa", promptValue: "low camera height, near ground level" },
      { value: "media", label: "Média", promptValue: "eye-level camera height" },
      { value: "alta", label: "Alta", promptValue: "elevated camera height, slightly above eye level" },
    ] },
    stabilizationField,
    timeOfDay,
  ],
  template: `Plano único entrando pela porta principal deste imóvel, push-in {{speed}} com intensidade {{intensity}}, revelando hall e sala em profundidade.
Luz de {{timeOfDay}}. Sem zoom digital — o avanço é físico, de câmera real.`,
  systemRules: [
    "um único plano contínuo, sem cortes",
    "avanço de câmera física — nunca zoom digital",
    "o eixo, a lente e a leitura arquitetônica permanecem consistentes durante todo o avanço",
    "a fachada não se deforma durante o movimento",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "zoom digital artificial",
    "deformação da fachada",
    "mudança de lente no meio do plano",
  ],
  fidelity: { preserveStructure: true, preserveCamera: true },
  cameraMode: "controlled-motion",
  thumbnailAlt: "Corredor elegante em profundidade, com portas e iluminação de teto",
});

/* ============================================================================
   12. Construção Completa (fluxo em 2 etapas via segmented control)
   ========================================================================== */

const construcaoCompleta = stub({
  name: "Construção Completa",
  slug: "construcao-completa",
  description: "Timelapse longo cobrindo a obra em duas etapas: do terreno à estrutura, e da estrutura à entrega.",
  category: "construcao",
  type: "video-two-images",
  accessLevel: "premium",
  images: [
    { key: "start", label: "Ponto de partida", hint: "Depende da etapa: terreno vazio ou obra em estrutura." },
    { key: "end", label: "Resultado da etapa", hint: "Como a etapa selecionada deve terminar." },
  ],
  instructions: [
    "Escolha a etapa abaixo — cada uma gera um prompt próprio, com imagens diferentes.",
    "Etapa 1: terreno vazio → estrutura em obra. Etapa 2: estrutura em obra → imóvel entregue.",
  ],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    ["Modo Vídeo no Google Flow.", "Envie o ponto de partida e o resultado da etapa escolhida.", "Gere uma etapa de cada vez — são dois prompts separados."],
  ),
  beginner: [
    {
      key: "stage",
      type: "segmented-control",
      label: "Etapa",
      required: true,
      defaultValue: "terreno-estrutura",
      options: [
        {
          value: "terreno-estrutura",
          label: "Terreno → Estrutura",
          promptValue:
            "Etapa 1 de 2 — do terreno vazio até a estrutura em obra: terraplenagem, fundação, alvenaria e cobertura visíveis progressivamente",
        },
        {
          value: "estrutura-entrega",
          label: "Estrutura → Entrega",
          promptValue:
            "Etapa 2 de 2 — da estrutura em obra até a entrega: acabamento, pintura, esquadrias, paisagismo e limpeza final",
        },
      ],
    },
    speedField,
    musicField,
    extraDetails,
  ],
  advanced: [durationField, crewField, weatherField, soundEffectsField],
  template: `Timelapse de construção, câmera travada, ritmo {{speed}}. {{stage}}.
O resultado final desta etapa deve corresponder exatamente à segunda imagem enviada.
Trabalhadores e maquinário visíveis: {{crew}}. Céu {{weather}}.`,
  systemRules: [
    "câmera travada durante toda a etapa",
    "gerar apenas a etapa selecionada — não avançar além do que a segunda imagem mostra",
  ],
  hardNegatives: [...DEFAULT_VIDEO_NEGATIVES, "avançar a obra além da segunda imagem enviada"],
  fidelity: { lockedCamera: true, noPropertyChanges: true },
  cameraMode: "locked",
  supportMaterial: [
    {
      kind: "guide",
      label: "Como funcionam as duas etapas",
      body: "Gere a Etapa 1 (terreno → estrutura) e copie o prompt. Depois troque para Etapa 2 (estrutura → entrega), envie as novas imagens e gere de novo. São dois vídeos que se encaixam em sequência.",
    },
  ],
});

/* ============================================================================
   13. Casa em Empreendimento
   ========================================================================== */

const casaEmEmpreendimento = stub({
  name: "Casa em Empreendimento",
  slug: "casa-em-empreendimento",
  description: "Insere a casa em um contexto de condomínio ou loteamento planejado, em vista aérea.",
  category: "terrenos",
  type: "image-custom",
  isNew: true,
  images: [{ key: "reference", label: "Planta ou imagem do projeto", hint: "Planta baixa, mapa do loteamento ou foto do terreno." }],
  instructions: [
    "Envie a planta do projeto ou uma foto/mapa do loteamento — quanto mais clara a referência, mais fiel o resultado.",
    "Se a referência já indicar o número de casas, esse número é respeitado.",
  ],
  toolGuide: flowGuide(
    ["Imagem", "Referência", "Compor"],
    ["Projeto de Imagem no Google Flow.", "Anexe a planta ou imagem do projeto.", "Gere a visualização aérea fotorrealista."],
  ),
  beginner: [extraDetails],
  advanced: [
    { ...desiredStyle, label: "Estilo arquitetônico" },
    {
      key: "density",
      type: "segmented-control",
      label: "Densidade",
      defaultValue: "media",
      options: [
        { value: "baixa", label: "Baixa", promptValue: "low-density layout, generous lot spacing" },
        { value: "media", label: "Média", promptValue: "medium-density layout, standard suburban spacing" },
        { value: "alta", label: "Alta", promptValue: "higher-density layout, compact lot spacing" },
      ],
    },
    {
      key: "greenery",
      type: "toggle",
      label: "Vegetação",
      defaultValue: true,
      booleanText: {
        on: "include street trees and landscaped greenery between the lots",
        off: "no street trees or landscaped greenery between the lots",
      },
    },
    timeOfDay,
    weatherField,
    { key: "realism", type: "slider", label: "Nível de realismo", min: 1, max: 5, step: 1, unit: "/5", defaultValue: 4 },
  ],
  template: `Gere uma visualização aérea fotorrealista deste empreendimento no estilo {{style}}, densidade {{density}}.
Vegetação e arborização entre os lotes: {{greenery}}. Cena em {{timeOfDay}}, {{weather}}. Nível de realismo {{realism}} de 5.
Respeitar exatamente o número e a disposição das casas indicados na referência — não inventar unidades além do projeto.`,
  systemRules: [
    "manter o traçado de ruas e a divisão de lotes exatamente como na referência",
    "não alterar a quantidade de unidades quando a referência a indicar claramente",
  ],
  hardNegatives: ["inventar casas fora do projeto", "alterar o traçado das vias", "texto ou marca d'água"],
  fidelity: { noPropertyChanges: true, noInventedElements: true },
  cameraMode: "static",
});

/* ============================================================================
   14. Vista de Drone
   ========================================================================== */

const vistaDeDrone = stub({
  name: "Vista de Drone",
  slug: "vista-de-drone",
  description: "Recria o terreno ou imóvel a partir de um ponto de vista aéreo.",
  category: "terrenos",
  type: "image-custom",
  images: [{ key: "reference", label: "Foto do imóvel ou terreno", hint: "Qualquer ângulo — a IA reprojeta para a vista aérea." }],
  instructions: ["Funciona a partir de qualquer foto do imóvel — não precisa já ser aérea."],
  toolGuide: flowGuide(
    ["Imagem", "Referência", "Compor"],
    ["Projeto de Imagem no Google Flow.", "Anexe a foto do imóvel ou terreno.", "Gere a vista aérea."],
  ),
  beginner: [
    droneAltitudeField,
    { ...cameraAngle, key: "droneAngle", label: "Ângulo do drone", defaultValue: "aerea", options: [
      { value: "aerea", label: "Vertical (topo)", promptValue: "top-down nadir view" },
      { value: "obliqua", label: "Oblíqua (3/4)", promptValue: "oblique three-quarter aerial view" },
    ] },
    extraDetails,
  ],
  advanced: [
    { key: "distance", type: "slider", label: "Distância", min: 10, max: 100, step: 5, unit: "m", defaultValue: 40 },
    { key: "lens", type: "select", label: "Lente", defaultValue: "24mm", options: lensOptions.filter((o) => o.value !== "50mm") },
    timeOfDay,
    weatherField,
  ],
  template: `Recrie esta cena a partir de uma vista de drone em altitude {{altitude}}, ângulo {{droneAngle}}, distância aproximada de {{distance}}.
Luz de {{timeOfDay}}, {{weather}}. Preservar exatamente o imóvel e o terreno reais — apenas o ponto de vista muda.`,
  systemRules: ["o imóvel e a vizinhança permanecem idênticos aos da referência, apenas vistos de outro ângulo"],
  hardNegatives: ["alterar o imóvel", "inventar construções vizinhas", "texto ou marca d'água"],
  fidelity: { noPropertyChanges: true, noInventedElements: true },
  cameraMode: "static",
  nextModule: "voo-de-drone",
});

/* ============================================================================
   15. Metragem em Terreno (Vídeo)
   ========================================================================== */

const metragemEmTerrenoVideo = stub({
  name: "Metragem em Terreno (Vídeo)",
  slug: "metragem-em-terreno-video",
  description: "Vídeo aéreo com o contorno da metragem se desenhando sobre o lote durante um sobrevoo.",
  category: "terrenos",
  type: "video-two-images",
  accessLevel: "pro",
  images: [
    { key: "original", label: "Imagem original", hint: "Foto aérea sem overlay." },
    { key: "outlined", label: "Imagem com contorno e metragem", hint: "Resultado do módulo Metragem do Terreno." },
  ],
  defaultFormat: "structured_json",
  instructions: ["Combina o sobrevoo com o traçado do contorno — use as mesmas duas imagens do módulo Metragem Animada."],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    ["Modo Vídeo no Google Flow.", "Envie a imagem original e a versão com contorno, nessa ordem.", "Gere em JSON estruturado."],
  ),
  beginner: [{ ...speedField, label: "Velocidade do traçado" }, musicField, extraDetails],
  advanced: [
    durationField,
    {
      key: "finalPause",
      type: "toggle",
      label: "Pausa final no contorno fechado",
      defaultValue: true,
      booleanText: {
        on: "brief pause once the outline closes, before the clip ends",
        off: "no pause — the clip ends right as the outline closes",
      },
    },
    { key: "sfxIntensity", type: "slider", label: "Intensidade sonora", min: 0, max: 100, step: 10, unit: "%", defaultValue: 30 },
  ],
  template: `Sobrevoo suave e contínuo do terreno enquanto o contorno de luz se desenha {{speed}} sobre as divisas, terminando exatamente como na segunda imagem.
Pausa breve com o contorno fechado antes do fim: {{finalPause}}.`,
  systemRules: [
    "movimento de sobrevoo suave e constante, sem solavancos",
    "o contorno final corresponde exatamente à segunda imagem",
  ],
  hardNegatives: [...DEFAULT_VIDEO_NEGATIVES, "contorno final diferente da referência"],
  fidelity: { noPropertyChanges: true, preserveStructure: true },
  cameraMode: "free-motion",
  dependsOn: "metragem-do-terreno",
});

/* ============================================================================
   16. Voo de Drone
   ========================================================================== */

const vooDeDrone = stub({
  name: "Voo de Drone",
  slug: "voo-de-drone",
  description: "Voo contínuo entre dois pontos de vista do imóvel, revelando o entorno real.",
  category: "cinematograficos",
  type: "video-two-images",
  accessLevel: "pro",
  isNew: true,
  images: [
    { key: "start", label: "Ponto inicial", hint: "De onde o voo começa." },
    { key: "end", label: "Ponto final", hint: "Onde o voo termina." },
  ],
  instructions: ["As duas imagens definem início e fim do voo — a IA constrói o trajeto entre elas."],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    ["Modo Vídeo no Google Flow.", "Envie o ponto inicial e o ponto final do voo, nessa ordem.", "Gere com movimento fluido e velocidade moderada."],
  ),
  beginner: [{ ...speedField, key: "peakSpeed", label: "Velocidade de pico" }, extraDetails],
  advanced: [
    { key: "acceleration", type: "select", label: "Aceleração", defaultValue: "gradual", options: [
      { value: "gradual", label: "Gradual", promptValue: "gradual smooth acceleration from rest" },
      { value: "imediata", label: "Imediata", promptValue: "near-immediate acceleration to cruise speed" },
    ] },
    { key: "deceleration", type: "select", label: "Desaceleração", defaultValue: "gradual", options: [
      { value: "gradual", label: "Gradual", promptValue: "gradual smooth deceleration into the final frame" },
      { value: "abrupta", label: "Abrupta", promptValue: "quick deceleration to a stop" },
    ] },
    droneAltitudeField,
    { key: "trajectory", type: "select", label: "Trajetória", defaultValue: "orbital", options: [
      { value: "orbital", label: "Orbital ao redor", promptValue: "orbital flight path around the property" },
      { value: "linear", label: "Linear direta", promptValue: "direct linear flight path" },
      { value: "arco", label: "Em arco", promptValue: "arcing flight path" },
    ] },
    durationField,
    stabilizationField,
  ],
  template: `Voo de drone contínuo do ponto inicial ao ponto final fornecidos, trajetória {{trajectory}}, altitude {{altitude}}, velocidade de pico {{peakSpeed}}.
Usar as duas imagens estritamente como início e fim do movimento — nunca como cortes.`,
  systemRules: [
    "movimento contínuo do início ao fim, sem cortes — o movimento de câmera é essencial e não deve ser suprimido",
    "não deformar o imóvel nem alterar a arquitetura durante o voo",
    "evitar velocidade que pareça fisicamente implausível para um drone real",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "deformar o imóvel durante o movimento",
    "velocidade irreal para um drone",
  ],
  fidelity: { preserveStructure: true, noPropertyChanges: true },
  cameraMode: "free-motion",
  thumbnailAlt: "Vista aérea vertical de um bairro residencial denso, telhados e piscinas",
});

/* ============================================================================
   17. Contorno da Casa
   ========================================================================== */

const contornoDaCasa = stub({
  name: "Contorno da Casa",
  slug: "contorno-da-casa",
  description: "Traço de luz percorrendo o volume da casa até fechar sua silhueta completa.",
  category: "cinematograficos",
  type: "video-two-images",
  accessLevel: "pro",
  images: [
    { key: "original", label: "Imagem original", hint: "Foto real da casa." },
    { key: "outlined", label: "Imagem com contorno", hint: "Referência de como o traço deve ficar." },
  ],
  defaultFormat: "structured_json",
  instructions: ["Envie a foto original e uma referência do contorno já desenhado sobre a casa."],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    ["Modo Vídeo no Google Flow.", "Envie a imagem original e a versão com contorno, nessa ordem.", "Câmera travada — só o traço se move."],
  ),
  beginner: [beamColorField, glowStyleField, { ...speedField, label: "Velocidade do traçado" }, extraDetails],
  advanced: [durationField, soundEffectsField],
  template: `Anime o traço de luz {{beamColor}}, estilo {{glowStyle}}, percorrendo o contorno externo da casa {{speed}} até fechar a silhueta completa, exatamente como na segunda imagem.
Imagem de fundo estática do início ao fim. Não redesenhar o contorno, não alterar sua cor e não criar texto.`,
  systemRules: [
    "câmera travada — propriedade e fundo completamente congelados",
    "revelar apenas o overlay do traço, nunca alterar a casa em si",
    "o contorno final corresponde exatamente à segunda imagem, sem redesenhar",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "redesenhar o contorno",
    "alterar a cor do traço",
    "inventar um contorno diferente da referência",
  ],
  fidelity: { preserveStructure: true, lockedCamera: true, noPropertyChanges: true },
  cameraMode: "locked",
});

export const STUB_MODULES: ModuleDefinition[] = [
  antesEDepoisDecoracao,
  casaEmTerrenoVideo,
  metragemAnimada,
  timelapseReformaInterior,
  reformaCinematografica,
  antesEDepoisGeral,
  buildingRevealing,
  buildingRevealingVideo,
  timelapseConstrucaoSimples,
  apresentacaoProfissional,
  entradaCinematografica,
  construcaoCompleta,
  casaEmEmpreendimento,
  vistaDeDrone,
  metragemEmTerrenoVideo,
  vooDeDrone,
  contornoDaCasa,
];
