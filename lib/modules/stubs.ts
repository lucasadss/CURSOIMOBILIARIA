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
  traceSpeedField,
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
  "no unwanted camera shake or drift",
  "no lens distortion",
  "no object morphing",
  "no geometry changes between frames",
  "no flicker",
  "no on-screen text or captions",
  "no logos",
  "no watermark",
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
  { key: "before", label: "Antes", hint: "Foto real do ambiente hoje.", promptLabel: "Before" },
  { key: "after", label: "Depois", hint: "Referência de como deve ficar (opcional se preencher pelos campos).", promptLabel: "After" },
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
  images: [{ key: "before", label: "Antes", hint: "Foto real do ambiente hoje, sem edição.", promptLabel: "Before" }],
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
  template: `Generate the "after" version of this room in {{desiredStyle}}, transformation level {{transformLevel}}.
Predominant palette: {{palette}}. Featured materials: {{materials}}.
Preserve the existing furniture in the composition, only restyling the surroundings: {{keepFurniture}}.
Keep the architecture, windows, floor and point of view identical to the original photo — only the styling changes.`,
  systemRules: [
    "generate only the \"after\" side — the \"before\" is the uploaded photo itself, unprocessed",
    "keep exactly the same framing and focal distance as the original",
  ],
  hardNegatives: [
    "moving doors or windows",
    "altering the room's dimensions",
    "creating additional rooms",
    "deforming furniture that should be preserved",
    "people",
    "text or watermark",
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
    { key: "empty", label: "Terreno vazio", hint: "A mesma foto usada em Casa em Terreno.", promptLabel: "Empty lot" },
    { key: "built", label: "Casa pronta", hint: "Resultado gerado no módulo Casa em Terreno.", promptLabel: "Finished house" },
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
  template: `Animate the transition from the empty lot (first image) to the finished house (second image), with {{speed}}, {{cameraMovement}}.
The final house must remain strictly faithful to the second image — same facade, proportions and position on the lot.
Workers and machinery visible during the transition: {{crew}}. Weather: {{weather}}.`,
  systemRules: [
    "the video's last frame must match the supplied \"finished house\" photo exactly",
    "lot boundaries and the public road stay identical across every frame",
    "the camera's axis, lens and architectural reading stay consistent even while it moves",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "final house different from the supplied reference image",
    "altering the lot boundaries",
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
    { key: "original", label: "Terreno original", hint: "Foto aérea sem overlay.", promptLabel: "Original lot" },
    { key: "outlined", label: "Terreno com contorno", hint: "Resultado do módulo Metragem do Terreno.", promptLabel: "Lot with outline" },
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
    traceSpeedField,
    soundEffectsField,
    showAreaField,
    extraDetails,
  ],
  advanced: [durationField, beamColorField],
  template: `Animate the {{beamColor}} light beam tracing the lot's perimeter, {{speed}}, until it exactly closes the outline already defined in the second image.
On closing, reveal the area over the lot: {{showArea}}.
The background aerial photo stays 100% static — camera locked, no other part of the scene changes.`,
  systemRules: [
    "camera fully locked — no pan, zoom or reframing",
    "the final outline must match the second image exactly, with no redrawing",
    "preserve the outline's color and position as defined in the reference",
    "do not create any text beyond the area label, unless requested",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "redrawing the outline with a different path than the reference",
    "fake shadows or reflections from the beam on the ground",
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
  template: `Renovation timelapse of this room, camera locked, {{speed}}, from the initial state (first image) to the final finish (second image).
Transformation intensity {{transformLevel}}. Workers and tools visible: {{crew}}.
Gradual lighting transition between the two states: {{lightingTransition}}.
The final result must match the second image exactly in composition, structure and point of view.`,
  systemRules: [
    "camera locked from start to finish, no reframing",
    "the last frame must match the supplied \"after\" image exactly",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "final result different from the reference image",
    "creating additional rooms or openings",
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
  template: `Organic cinematic transition from the initial image (before) to the final one (after), with {{cameraMovement}}.
Interpolate lighting, materials and volume gradually, with no abrupt morphing — the viewer feels the passage of time, not a cut.
{{lightingStyle}}. Avoid fanciful transformation: keep only what is plausible between the two real states.`,
  systemRules: [
    "the interpolation must stay physically plausible — no elements that don't exist in either photo",
    "the camera's axis, lens and architectural reading stay consistent from start to finish, even while it moves",
  ],
  hardNegatives: [...DEFAULT_VIDEO_NEGATIVES, "fanciful elements that don't exist in either photo"],
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
  template: `Reveal the "after" over the "before" with a {{wipeDirection}}, {{speed}}.
Identical point of view in both images — the alignment between them is what sells the effect.`,
  systemRules: ["both images stay unaltered — the effect is only the transition between them"],
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
  images: [{ key: "reference", label: "Terreno ou construção atual", hint: "Foto real do lote ou obra.", promptLabel: "Lot or current construction" }],
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
  template: `Compose a building being "revealed" by a {{glowStyle}} plane of light over the reference lot, {{coverageIntensity}} coverage.
Half built in photorealistic detail, half still in {{beamColor|amber}} light wireframe.
Do not alter the building or the lot — only compose the reveal effect over the real scene.`,
  systemRules: [
    "the lot and surroundings from the original photo stay unaltered",
    "the light wireframe never spills onto the public road or neighboring lots",
  ],
  hardNegatives: ["redrawing the lot", "altering the neighborhood", "text or watermark"],
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
  images: [{ key: "reference", label: "Imagem gerada no Building Revealing", hint: "Resultado do módulo Building Revealing.", promptLabel: "Building Revealing image" }],
  instructions: ["Use exatamente o resultado gerado em ‘Building Revealing’ como referência."],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    ["Modo Vídeo no Google Flow.", "Envie a imagem do Building Revealing como primeiro frame.", "Câmera fixa — só o plano de luz se move."],
  ),
  beginner: [speedField, musicField, extraDetails],
  advanced: [durationField, soundEffectsField, timeOfDay, glowStyleField],
  template: `Animate the {{glowStyle}} plane of light sweeping the scene, {{speed}}, until the complete building materializes, exactly as in the reference image.
Fixed camera from start to finish. {{timeOfDay}}.
Preserve the building and the lot from the base image exactly — the only thing that changes is the progressive reveal.`,
  systemRules: [
    "camera 100% locked",
    "the final building must match the reference image exactly, with no redrawing",
  ],
  hardNegatives: [...DEFAULT_VIDEO_NEGATIVES, "final building different from the reference image"],
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
    { key: "empty", label: "Terreno", hint: "Foto do lote vazio.", promptLabel: "Lot" },
    { key: "final", label: "Projeto finalizado", hint: "Referência de como a obra deve terminar.", promptLabel: "Finished project" },
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
  template: `Short construction timelapse, camera locked, {{speed}}, passing through {{milestones}}, between the lot (first image) and the finished project (second image).
The final construction must match the second image exactly. Workers and machinery: {{crew}}.`,
  systemRules: ["camera locked", "the final result matches the \"finished project\" image exactly"],
  hardNegatives: [...DEFAULT_VIDEO_NEGATIVES, "final result different from the reference"],
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
    { key: "room1", label: "Ambiente 1", hint: "Ex.: fachada ou sala.", promptLabel: "Room 1" },
    { key: "room2", label: "Ambiente 2", promptLabel: "Room 2" },
    { key: "room3", label: "Ambiente 3", promptLabel: "Room 3" },
    { key: "room4", label: "Ambiente 4 (opcional)", promptLabel: "Room 4 (optional)" },
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
  template: `Continuous walkthrough video, moving through the rooms in the order they were uploaded: {{presentationPace}}, with clean cuts.`,
  systemRules: [
    "follow the exact order of the uploaded images",
    "never mix elements from different rooms in the same frame",
    "keep the same property's visual identity from start to finish (same palette, same finish)",
    "smooth camera movement — no teleporting between rooms",
  ],
  hardNegatives: [...DEFAULT_VIDEO_NEGATIVES, "mixing different rooms", "skipping the uploaded order"],
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
  images: [{ key: "reference", label: "Fachada / entrada do imóvel", hint: "Foto da entrada, porta visível e centralizada.", promptLabel: "Property facade / entrance" }],
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
  template: `Single continuous shot entering through this property's main door, {{speed}} push-in at {{intensity}} intensity, revealing the hall and living room in depth.
{{timeOfDay}}. No digital zoom — the advance is physical, real-camera motion.`,
  systemRules: [
    "a single continuous shot, no cuts",
    "physical camera advance — never digital zoom",
    "the axis, lens and architectural reading stay consistent throughout the advance",
    "the facade does not deform during the movement",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "artificial digital zoom",
    "facade deformation",
    "lens change mid-shot",
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
    { key: "start", label: "Ponto de partida", hint: "Depende da etapa: terreno vazio ou obra em estrutura.", promptLabel: "Starting point" },
    { key: "end", label: "Resultado da etapa", hint: "Como a etapa selecionada deve terminar.", promptLabel: "Stage result" },
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
            "Stage 1 of 2 — from the empty lot to the structure under construction: site grading, foundation, masonry and roofing visible progressively",
        },
        {
          value: "estrutura-entrega",
          label: "Estrutura → Entrega",
          promptValue:
            "Stage 2 of 2 — from the structure under construction to handover: finishing, paint, window and door frames, landscaping and final cleanup",
        },
      ],
    },
    speedField,
    musicField,
    extraDetails,
  ],
  advanced: [durationField, crewField, weatherField, soundEffectsField],
  template: `Construction timelapse, camera locked, {{speed}}. {{stage}}.
This stage's final result must match the second uploaded image exactly.
Workers and machinery visible: {{crew}}. Weather: {{weather}}.`,
  systemRules: [
    "camera locked throughout the stage",
    "generate only the selected stage — do not progress beyond what the second image shows",
  ],
  hardNegatives: [...DEFAULT_VIDEO_NEGATIVES, "progressing the construction beyond the second uploaded image"],
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
  images: [{ key: "reference", label: "Planta ou imagem do projeto", hint: "Planta baixa, mapa do loteamento ou foto do terreno.", promptLabel: "Site plan or project image" }],
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
  template: `Generate a photorealistic aerial visualization of this development in {{desiredStyle}}, {{density}}.
Greenery and street trees between the lots: {{greenery}}. Scene in {{timeOfDay}}, {{weather}}. Realism level {{realism}}.
Follow exactly the number and layout of houses shown in the reference — do not invent units beyond the project.`,
  systemRules: [
    "keep the street layout and lot subdivision exactly as in the reference",
    "do not alter the number of units when the reference clearly indicates it",
  ],
  hardNegatives: ["inventing houses outside the project", "altering the street layout", "text or watermark"],
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
  images: [{ key: "reference", label: "Foto do imóvel ou terreno", hint: "Qualquer ângulo — a IA reprojeta para a vista aérea.", promptLabel: "Property or lot photo" }],
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
  template: `Recreate this scene from a drone view at {{altitude}}, {{droneAngle}} angle, approximately {{distance}} away.
{{timeOfDay}}, {{weather}}. Preserve the real property and lot exactly — only the point of view changes.`,
  systemRules: ["the property and neighborhood stay identical to the reference, only seen from a different angle"],
  hardNegatives: ["altering the property", "inventing neighboring buildings", "text or watermark"],
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
    { key: "original", label: "Imagem original", hint: "Foto aérea sem overlay.", promptLabel: "Original image" },
    { key: "outlined", label: "Imagem com contorno e metragem", hint: "Resultado do módulo Metragem do Terreno.", promptLabel: "Image with outline and area" },
  ],
  defaultFormat: "structured_json",
  instructions: ["Combina o sobrevoo com o traçado do contorno — use as mesmas duas imagens do módulo Metragem Animada."],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    ["Modo Vídeo no Google Flow.", "Envie a imagem original e a versão com contorno, nessa ordem.", "Gere em JSON estruturado."],
  ),
  beginner: [traceSpeedField, musicField, extraDetails],
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
  template: `Smooth, continuous flyover of the lot while the light outline draws itself, {{speed}}, over the boundaries, finishing exactly as in the second image.
Brief pause with the outline closed before the end: {{finalPause}}.`,
  systemRules: [
    "smooth, constant flyover movement, no jolts",
    "the final outline matches the second image exactly",
  ],
  hardNegatives: [...DEFAULT_VIDEO_NEGATIVES, "final outline different from the reference"],
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
    { key: "start", label: "Ponto inicial", hint: "De onde o voo começa.", promptLabel: "Starting point" },
    { key: "end", label: "Ponto final", hint: "Onde o voo termina.", promptLabel: "Ending point" },
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
  template: `Continuous drone flight from the supplied starting point to the ending point, {{trajectory}}, {{altitude}}, {{peakSpeed}} peak speed.
Use the two images strictly as the start and end of the movement — never as cuts.`,
  systemRules: [
    "continuous movement from start to finish, no cuts — the camera movement is essential and must not be suppressed",
    "do not deform the property or alter the architecture during the flight",
    "avoid speeds that would look physically implausible for a real drone",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "deforming the property during the movement",
    "unrealistic speed for a drone",
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
    { key: "original", label: "Imagem original", hint: "Foto real da casa.", promptLabel: "Original image" },
    { key: "outlined", label: "Imagem com contorno", hint: "Referência de como o traço deve ficar.", promptLabel: "Image with outline" },
  ],
  defaultFormat: "structured_json",
  instructions: ["Envie a foto original e uma referência do contorno já desenhado sobre a casa."],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    ["Modo Vídeo no Google Flow.", "Envie a imagem original e a versão com contorno, nessa ordem.", "Câmera travada — só o traço se move."],
  ),
  beginner: [beamColorField, glowStyleField, traceSpeedField, extraDetails],
  advanced: [durationField, soundEffectsField],
  template: `Animate the {{beamColor}} light trace, {{glowStyle}} style, tracing the house's outer outline, {{speed}}, until it closes the complete silhouette, exactly as in the second image.
Static background image from start to finish. Do not redraw the outline, do not change its color and do not create any text.`,
  systemRules: [
    "camera locked — property and background completely frozen",
    "reveal only the trace overlay, never alter the house itself",
    "the final outline matches the second image exactly, with no redrawing",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "redrawing the outline",
    "changing the trace's color",
    "inventing an outline different from the reference",
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
