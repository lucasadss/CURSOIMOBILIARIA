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
  timelapseSpeedField,
  traceSpeedField,
  pushInSpeedField,
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
  promptRole?: string;
  structuredExtras?: Record<string, unknown>;
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
    promptRole: i.promptRole,
    structuredExtras: i.structuredExtras,
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
    {
      key: "empty",
      label: "Terreno vazio",
      hint: "A mesma foto usada em Casa em Terreno.",
      promptLabel: "Empty lot",
      promptRole: "Starting state. Camera angle locked permanently to this frame — the clip must begin here, unchanged.",
    },
    {
      key: "built",
      label: "Casa pronta",
      hint: "Resultado gerado no módulo Casa em Terreno.",
      promptLabel: "Finished house",
      promptRole: "Ending state. The final frame of the clip must be identical to this image — same facade, proportions and position on the lot.",
    },
  ],
  allowStructuredJson: true,
  defaultFormat: "structured_json",
  instructions: [
    "Use a foto original do terreno e o resultado do módulo Casa em Terreno, nessa ordem.",
    "A câmera fica travada — o foco é a obra evoluindo, não o movimento de câmera.",
  ],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    [
      "Modo Vídeo no Google Flow.",
      "Envie o terreno vazio como primeiro frame e a casa pronta como referência final.",
      "Cole o prompt e gere — câmera travada, foco na obra.",
    ],
  ),
  beginner: [timelapseSpeedField, musicField, extraDetails],
  advanced: [
    durationField,
    soundEffectsField,
    crewField,
    weatherField,
  ],
  promptRole:
    "You are a cinematic construction-timelapse director. The first image is the empty lot; the second is the finished house. Animate everything in between, in physically logical order.",
  template: `Construction timelapse from the empty lot to the finished house shown in the second image, {{speed}}: foundation poured, structural walls rising, roof assembled, facade cladding, windows installed, landscaping planted — each phase advancing in logical order.
Natural time-of-day cycling as construction advances — morning through midday, afternoon and warm sunset — with interior lights gradually turning on and exterior lighting activating as the house nears completion.
The finished house must remain strictly faithful to the second image — same facade, proportions and position on the lot. Workers and machinery visible throughout: {{crew}}. Weather: {{weather}}.`,
  systemRules: [
    "camera locked to the exact angle and perspective of the first image — never moves, rotates, tilts or zooms at any point",
    "the video's last frame must match the supplied \"finished house\" photo exactly",
    "lot boundaries and the public road stay identical across every frame",
    "never build anything other than the house shown in the second image",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "any camera movement at all",
    "final house different from the supplied reference image",
    "altering the lot boundaries",
    "ending on anything other than the exact, unmodified second image",
  ],
  fidelity: {
    lockedCamera: true,
    noPropertyChanges: true,
  },
  cameraMode: "locked",
  dependsOn: "casa-em-terreno",
  nextModule: "voo-de-drone",
  steps: [
    { label: "Casa no terreno (imagem)", moduleSlug: "casa-em-terreno" },
    { label: "Casa no terreno (vídeo)", moduleSlug: "casa-em-terreno-video" },
  ],
  structuredExtras: {
    construction: {
      phases: [
        "foundation poured",
        "structural walls rising",
        "roof assembled",
        "facade cladding",
        "windows installed",
        "landscaping planted",
      ],
      order: "each phase advances in physically logical order, never out of sequence",
    },
    lighting: {
      transitions: "natural time-of-day cycling — morning through midday, afternoon and warm sunset — as construction advances",
      final_reveal: "interior lights gradually turn on and exterior lighting activates as the house nears completion",
    },
  },
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
    {
      key: "original",
      label: "Terreno original",
      hint: "Foto aérea sem overlay.",
      promptLabel: "Original lot",
      promptRole: "Exact starting frame and untouched background plate. The clip must begin with these pixels unchanged, with no contour and no text visible.",
    },
    {
      key: "outlined",
      label: "Terreno com contorno",
      hint: "Resultado do módulo Metragem do Terreno.",
      promptLabel: "Lot with outline",
      promptRole: "Exact final frame, and the only source for the contour's path, thickness, color, glow and area label. The clip must end with these pixels unchanged.",
    },
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
    {
      ...showAreaField,
      booleanText: {
        on: "reveal the area label exactly as it already appears in the second image, pixel for pixel — never recalculate, translate or restyle it",
        off: "do not reveal any area label",
      },
    },
    extraDetails,
  ],
  advanced: [durationField, beamColorField],
  promptRole:
    "You are a precision frame-compositing renderer, not a creative scene generator. Your only job is to reveal, over time, the exact overlay that already exists in the second image — never redraw, restyle or reinterpret it.",
  template: `This is a compositing reveal, not a new generation: progressively reveal the exact contour already visible in the second image over the first image, using a reveal mask along its existing pixels.
Sample the beam's path, thickness, color and glow directly from the second image and keep them identical from the first visible pixel to the final frame — color {{beamColor}}, pace {{speed}}.
On closing, {{showArea}}.
The background aerial photo stays 100% static and pixel-identical to the source images throughout the clip — camera locked, nothing else in the scene changes.`,
  systemRules: [
    "camera fully locked — no pan, zoom or reframing",
    "this is a compositing reveal of existing pixels from the second image, not a newly generated or redrawn line",
    "the beam's path, thickness, color and glow are sampled from the second image and never vary during the reveal",
    "revealed pixels stay visible and lit once the beam passes them — nothing fades or disappears after being drawn",
    "hold the exact, unmodified second image for the final moment of the clip so the ending is verifiably identical to it",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "redrawing the outline with a different path, color or style than the second image",
    "a temporary or intermediate outline color before settling on the final one",
    "fake shadows or reflections from the beam on the ground",
    "inventing, estimating, calculating or translating the area value or unit",
    "writing any area label, unit or text not already present in the second image",
    "any revealed line or label disappearing again before the clip ends",
    "ending on anything other than the exact, unmodified second image",
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
  structuredExtras: {
    compositing: {
      mode: "progressive reveal mask along existing pixels, not a newly generated or redrawn line",
      background: "keep the property, lot, vegetation and lighting frozen and pixel-consistent with the source images for the entire clip",
      overlay_source: "the contour's path, thickness, color, glow and area label all come from the second image — sample and reveal them, never recreate them",
    },
  },
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
  beginner: [timelapseSpeedField, musicField, extraDetails],
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
  promptRole:
    "You are a cinematic interior-renovation-timelapse director. The second image is the only permitted final result — lock its exact composition and structure before animating, then reveal the renovation progressing toward it, stage by stage.",
  template: `Renovation timelapse of this room, camera locked, {{speed}}, from the initial state (first image) to the final finish (second image).
Progression, each stage advancing naturally toward the second image: old elements removed, walls prepared with new paint and flooring, large furniture placed, lighting fixtures and smaller furniture added, then decorative styling.
Transformation intensity {{transformLevel}}. Workers and tools visible: {{crew}}.
Gradual lighting transition between the two states: {{lightingTransition}}.
The final result must match the second image exactly in composition, structure and point of view.`,
  systemRules: [
    "camera locked from start to finish, no reframing",
    "the last frame must match the supplied \"after\" image exactly",
    "never invent a different final look than the second image",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "final result different from the reference image",
    "creating additional rooms or openings",
    "a different renovation style, palette or furniture than the second image",
  ],
  fidelity: {
    preserveStructure: true,
    lockedCamera: true,
    noInventedElements: true,
  },
  cameraMode: "locked",
  structuredExtras: {
    renovation: {
      phases: [
        "demolition and removal of old elements",
        "wall preparation, painting and flooring",
        "large furniture placement",
        "lighting fixtures and smaller furniture",
        "decorative elements and final styling",
      ],
    },
  },
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
  promptRole:
    "You are a cinematic architectural-transition director. The final frame of the clip must land exactly on the second image — never a corrected, softened or alternate version of it.",
  template: `Organic cinematic transition from the initial image (before) to the final one (after), with {{cameraMovement}}.
Interpolate lighting, materials and volume gradually, with no abrupt morphing — the viewer feels the passage of time, not a cut.
{{lightingStyle}}. Avoid fanciful transformation: keep only what is plausible between the two real states.`,
  systemRules: [
    "the interpolation must stay physically plausible — no elements that don't exist in either photo",
    "the camera's axis, lens and architectural reading stay consistent from start to finish, even while it moves",
    "the final frame matches the second image exactly, with no last-second correction or swap",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "fanciful elements that don't exist in either photo",
    "a different final result than the second image",
    "replacing or swapping the result near the end of the clip",
  ],
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
  promptRole:
    "You are a precision compositing renderer, not a creative scene generator. The only content in this clip is a clean wipe transition between the two exact reference images — nothing is generated, invented or interpolated.",
  template: `Reveal the exact "after" image over the exact "before" image with a {{wipeDirection}}, {{speed}} — a clean compositing wipe, not a generated transition.
Both images stay 100% unaltered throughout the clip; only the wipe boundary moves. Identical point of view in both — their alignment is what sells the effect.`,
  systemRules: [
    "both images stay 100% unaltered — the only motion is the wipe boundary itself",
    "no interpolation, morphing or blending between the two images — the wipe is a hard, clean edge",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "blending, morphing or cross-dissolving between the two images",
    "any generated or invented content not present in either image",
  ],
  fidelity: { lockedCamera: true, noInventedElements: true },
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
  images: [{
    key: "reference",
    label: "Imagem gerada no Building Revealing",
    hint: "Resultado do módulo Building Revealing.",
    promptLabel: "Building Revealing image",
    promptRole: "The only permitted final state. Its exact building, materials, lot and half-wireframe composition are locked before animating — the reveal must resolve into exactly this frame, never a generic or approximate version of it.",
  }],
  instructions: ["Use exatamente o resultado gerado em ‘Building Revealing’ como referência."],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    ["Modo Vídeo no Google Flow.", "Envie a imagem do Building Revealing como primeiro frame.", "Câmera fixa — só o plano de luz se move."],
  ),
  beginner: [traceSpeedField, musicField, extraDetails],
  advanced: [durationField, soundEffectsField, timeOfDay, glowStyleField],
  promptRole: "Precision compositing artist revealing a locked final building through a moving plane of light — not a creative generation task.",
  template: `Animate the {{glowStyle}} plane of light sweeping across the scene, {{speed}}, progressively revealing the complete building exactly as in the reference image.
Fixed camera from start to finish. {{timeOfDay}}.
Preserve the building, materials and lot from the reference image exactly — the only thing that changes is how much of it has been revealed by the light.`,
  systemRules: [
    "camera 100% locked",
    "the final building must match the reference image exactly, with no redrawing",
    "the revealed portion always matches the reference image at that point in the sweep — never a different structure",
    "nothing beyond the light plane is revealed ahead of time",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "final building different from the reference image",
    "revealing part of the building ahead of the light plane",
    "the light plane skipping or leaving gaps in the reveal",
  ],
  fidelity: { lockedCamera: true, noPropertyChanges: true, noInventedElements: true },
  cameraMode: "locked",
  dependsOn: "building-revealing",
  thumbnailAlt: "Vista aérea de uma propriedade cercada por terras cultivadas ao entardecer",
  structuredExtras: {
    compositing: {
      rule: "the light plane is a mask that progressively reveals the locked reference image — it never generates new building content",
      reveal_direction: "consistent single direction across the whole sweep, no back-and-forth",
    },
  },
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
    {
      key: "empty",
      label: "Terreno",
      hint: "Foto do lote vazio.",
      promptLabel: "Lot",
      promptRole: "Starting state. Camera angle locked permanently to this frame.",
    },
    {
      key: "final",
      label: "Projeto finalizado",
      hint: "Referência de como a obra deve terminar.",
      promptLabel: "Finished project",
      promptRole: "Ending state and the only permitted final design. The finished building's exact footprint, height, levels, silhouette, roofline and facade come from this image — never a generic or approximate version of it.",
    },
  ],
  instructions: ["Versão rápida do timelapse — só 3 marcos, sem estágios detalhados."],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    ["Modo Vídeo no Google Flow.", "Envie o terreno e o projeto finalizado, nessa ordem.", "Gere com câmera travada."],
  ),
  beginner: [extraDetails],
  advanced: [durationField, timelapseSpeedField, {
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
  promptRole:
    "You are a precision construction-timelapse renderer, not a creative architect. The second image is the only permitted final design. Before animating, silently lock its exact footprint, position, height, number of levels, silhouette, roofline and facade, then reveal only that exact building, stage by stage.",
  template: `Locked-camera construction timelapse between the two uploaded images, {{speed}}, passing through {{milestones}}.
Before animating, silently lock the exact building shown in the second image and progressively assemble and reveal only that exact building, stage by stage — never a generic or invented construction concept.
The structure in progress must align with the second image's footprint and silhouette at every point in the clip, not only at the end. Workers and machinery: {{crew}}.`,
  systemRules: [
    "camera locked — no pan, zoom or reframing",
    "before animating, lock the exact footprint, position, height, number of levels, silhouette, roofline and facade of the building in the second image",
    "every new structural element occupies its final position from the second image the moment it appears — never a generic or approximate placement",
    "the final result matches the second image exactly, with no last-second correction or swap",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "a different building than the one in the second image — different footprint, height, number of levels or silhouette",
    "a generic, alternate or invented architecture not shown in the second image",
    "an extra floor or volume not present in the second image",
    "demolishing or restarting the structure partway through the clip",
    "a second, different project appearing at any point",
    "correcting, replacing or swapping the structure near the end of the clip",
    "final result different from the reference",
  ],
  fidelity: { lockedCamera: true, noPropertyChanges: true, noInventedElements: true },
  cameraMode: "locked",
  structuredExtras: {
    continuity_check: "at roughly one quarter, half and three quarters through the clip, the structure in progress must still align exactly with the second image's footprint, edges, height and silhouette",
  },
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
    { key: "room1", label: "Ambiente 1", hint: "Ex.: fachada ou sala.", promptLabel: "Room 1", promptRole: "First space in the walkthrough — its real layout, furniture, décor, colors, lighting, windows and outdoor features are preserved exactly, nothing added or redecorated." },
    { key: "room2", label: "Ambiente 2", promptLabel: "Room 2", promptRole: "Second space in the walkthrough — its real layout, furniture, décor, colors, lighting, windows and outdoor features are preserved exactly, nothing added or redecorated." },
    { key: "room3", label: "Ambiente 3", promptLabel: "Room 3", promptRole: "Third space in the walkthrough — its real layout, furniture, décor, colors, lighting, windows and outdoor features are preserved exactly, nothing added or redecorated." },
    { key: "room4", label: "Ambiente 4 (opcional)", promptLabel: "Room 4 (optional)", promptRole: "Fourth space in the walkthrough, if provided — same preservation rule as the other rooms." },
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
  promptRole: "Real-estate cinematographer capturing an honest walkthrough for a professional listing — preserving the real layout, furniture, décor, colors, lighting, windows and outdoor features of every room exactly as photographed, without adding or redecorating anything.",
  template: `Continuous walkthrough video, moving through the rooms in the order they were uploaded, with smooth eye-level handheld camera movement: {{presentationPace}}, with clean cuts.
Each room's real layout, furniture, décor, colors, lighting, windows and outdoor features stay exactly as photographed — nothing added, removed or redecorated.`,
  systemRules: [
    "follow the exact order of the uploaded images",
    "never mix elements from different rooms in the same frame",
    "keep the same property's visual identity from start to finish (same palette, same finish)",
    "preserve each room's real furniture, décor and layout exactly as photographed — no redecorating or staging",
    "smooth eye-level handheld camera movement — no teleporting between rooms",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "mixing different rooms",
    "skipping the uploaded order",
    "adding, removing or restyling furniture or décor",
    "changing a room's wall color, flooring or finishes",
  ],
  fidelity: { preserveStructure: true, preserveObjectPlacement: true, preserveCamera: true, noInventedElements: true },
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
  images: [{ key: "reference", label: "Fachada / entrada do imóvel", hint: "Foto da entrada, porta visível e centralizada.", promptLabel: "Property facade / entrance", promptRole: "Starting frame — the facade, door and entrance are locked to this reference; the door opens naturally as part of the shot, never replaced or redesigned." }],
  instructions: ["Use uma foto com a porta principal centralizada e bem iluminada."],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    ["Modo Vídeo no Google Flow.", "Envie a foto da entrada como primeiro frame.", "Gere um push-in único, sem cortes."],
  ),
  beginner: [pushInSpeedField, soundEffectsField, extraDetails],
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
  promptRole: "Cinematographer capturing a single unbroken entrance shot — camera and lines stay perfectly straight and stabilized, and the door opens naturally as part of the motion, never cut away or skipped.",
  template: `Single continuous shot entering through this property's main door: the door opens smoothly and naturally as the camera approaches, {{pushInSpeed}} at {{intensity}} intensity, revealing the hall and living room in depth.
Perfectly straight vertical and horizontal lines throughout, super-stabilized as if on a gimbal — no tilt, no wobble.
{{timeOfDay}}. No digital zoom — the advance is physical, real-camera motion.`,
  systemRules: [
    "a single continuous shot, no cuts",
    "physical camera advance — never digital zoom",
    "the axis, lens and architectural reading stay consistent throughout the advance",
    "the facade does not deform during the movement",
    "the front door opens naturally and smoothly as the camera approaches, on its real hinge",
    "vertical and horizontal lines stay perfectly straight — no tilt, no wobble, gimbal-level stabilization",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "artificial digital zoom",
    "facade deformation",
    "lens change mid-shot",
    "the door staying closed or disappearing instead of opening",
    "tilted or converging vertical lines",
    "handheld shake or wobble",
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
    {
      key: "start",
      label: "Ponto de partida",
      hint: "Depende da etapa: terreno vazio ou obra em estrutura.",
      promptLabel: "Starting point",
      promptRole: "Starting state. Camera angle locked permanently to this frame.",
    },
    {
      key: "end",
      label: "Resultado da etapa",
      hint: "Como a etapa selecionada deve terminar.",
      promptLabel: "Stage result",
      promptRole: "Ending state for this stage, and the only permitted result. Its exact footprint, height, levels, silhouette and facade must be locked before animating — never a generic or invented version of it.",
    },
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
    timelapseSpeedField,
    musicField,
    extraDetails,
  ],
  advanced: [durationField, crewField, weatherField, soundEffectsField],
  promptRole:
    "You are a precision construction-timelapse renderer, not a creative architect. The second image is the only permitted result for this stage. Before animating, silently lock its exact footprint, height, levels, silhouette and facade, then reveal only that exact structure.",
  template: `Construction timelapse, camera locked, {{speed}}. {{stage}}.
Before animating, silently lock the exact structure shown in the second image and progressively reveal only that exact result — never a generic or invented construction concept. It must align with the second image's footprint and silhouette at every point in the clip, not only at the end.
Workers and machinery visible: {{crew}}. Weather: {{weather}}.`,
  systemRules: [
    "camera locked throughout the stage",
    "before animating, lock the exact footprint, height, levels, silhouette and facade of the structure in the second image",
    "generate only the selected stage — do not progress beyond what the second image shows",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "progressing the construction beyond the second uploaded image",
    "a different structure than the one in the second image — different footprint, height or silhouette",
    "correcting, replacing or swapping the structure near the end of the clip",
  ],
  fidelity: { lockedCamera: true, noPropertyChanges: true, noInventedElements: true },
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
    {
      key: "start",
      label: "Ponto inicial",
      hint: "De onde o voo começa.",
      promptLabel: "Starting point",
      promptRole: "Starting position. The flight begins here, hovering completely still. Angle, height and direction must match this frame exactly.",
    },
    {
      key: "end",
      label: "Ponto final",
      hint: "Onde o voo termina.",
      promptLabel: "Ending point",
      promptRole: "Ending position. The flight ends here, hovering completely still. Angle, height and direction must match this frame exactly.",
    },
  ],
  instructions: ["As duas imagens definem início e fim do voo — a IA constrói o trajeto entre elas."],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    ["Modo Vídeo no Google Flow.", "Envie o ponto inicial e o ponto final do voo, nessa ordem.", "Gere com movimento fluido e velocidade moderada."],
  ),
  beginner: [
    {
      key: "peakSpeed",
      type: "select",
      label: "Velocidade de pico",
      tooltip: "Velocidade relativa no ponto mais rápido do voo, entre os dois pontos.",
      placeholder: "Selecione…",
      defaultValue: "2x",
      options: [
        { value: "1x", label: "1x", promptValue: "a normal, realistic peak speed" },
        { value: "1.5x", label: "1.5x", promptValue: "a moderately accelerated peak speed" },
        { value: "2x", label: "2x", promptValue: "a fast, energetic peak speed" },
        { value: "3x", label: "3x", promptValue: "a maximum, aggressive peak speed" },
      ],
    },
    extraDetails,
  ],
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
  promptRole:
    "You are a drone pilot. Fly from the starting point to the ending point exactly as defined by the two uploaded images, in a single continuous, physically realistic flight.",
  template: `Continuous drone flight from the supplied starting point to the ending point, {{trajectory}}, {{altitude}}.
Flight profile: {{acceleration}}, reaching {{peakSpeed}} through the middle of the flight, then {{deceleration}}, arriving completely still at the ending point.
Use the two images strictly as the start and end of the movement — never as cuts.`,
  systemRules: [
    "continuous movement from start to finish, no cuts — the camera movement is essential and must not be suppressed",
    "never arrive at the ending point at full speed — always decelerate smoothly on arrival, hovering still in the exact final frame",
    "do not deform the property or alter the architecture during the flight",
    "avoid speeds that would look physically implausible for a real drone",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "deforming the property during the movement",
    "unrealistic speed for a drone",
    "camera shake or wobble",
    "motion blur",
    "changing the environment, property or lighting between the two images",
    "cutting or reframing mid-flight",
  ],
  fidelity: { preserveStructure: true, noPropertyChanges: true },
  cameraMode: "free-motion",
  thumbnailAlt: "Vista aérea vertical de um bairro residencial denso, telhados e piscinas",
  structuredExtras: {
    flight: {
      profile: "starts slow, accelerates through the middle, decelerates gently on arrival — never a constant speed throughout",
      arrival: "the drone must always end hovering completely still, in the exact frame of the ending point image",
    },
  },
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
    {
      key: "original",
      label: "Imagem original",
      hint: "Foto real da casa.",
      promptLabel: "Original image",
      promptRole: "Exact starting frame and untouched background plate. The clip must begin with these pixels unchanged, with no trace visible.",
    },
    {
      key: "outlined",
      label: "Imagem com contorno",
      hint: "Referência de como o traço deve ficar.",
      promptLabel: "Image with outline",
      promptRole: "Exact final frame, and the only source for the trace's path, thickness, color and glow. The clip must end with these pixels unchanged.",
    },
  ],
  defaultFormat: "structured_json",
  instructions: ["Envie a foto original e uma referência do contorno já desenhado sobre a casa."],
  toolGuide: flowGuide(
    ["Vídeo", "Elementos", "Omni Flash"],
    ["Modo Vídeo no Google Flow.", "Envie a imagem original e a versão com contorno, nessa ordem.", "Câmera travada — só o traço se move."],
  ),
  beginner: [beamColorField, glowStyleField, traceSpeedField, extraDetails],
  advanced: [durationField, soundEffectsField],
  promptRole:
    "You are a precision frame-compositing renderer, not a creative scene generator. Your only job is to reveal, over time, the exact light trace that already exists in the second image — never redraw, restyle or reinterpret it.",
  template: `This is a compositing reveal, not a new generation: progressively reveal the exact light trace already visible in the second image over the first image, following every corner and curve of its path in one continuous fluid motion — starting at the ground-level property boundary, then the roofline, then any secondary structures or pathways already outlined there.
Sample the trace's color, thickness and glow directly from the second image and keep them identical throughout — color {{beamColor}}, {{glowStyle}} style, pace {{speed}}.
Once a segment is revealed it stays lit for the rest of the clip — nothing fades or disappears as the trace continues.
Static background from start to finish. Do not redraw the outline, change its color or create any text.`,
  systemRules: [
    "camera locked — property and background completely frozen",
    "this is a compositing reveal of the existing trace from the second image, not a newly generated or redrawn line",
    "trace the property boundary first, then the roofline, then any secondary structures or pathways already outlined in the second image",
    "once revealed, a segment of the trace stays lit for the rest of the clip — never fades or disappears",
    "the final frame matches the second image exactly, with no redrawing",
  ],
  hardNegatives: [
    ...DEFAULT_VIDEO_NEGATIVES,
    "redrawing the outline with a different path, thickness or style than the second image",
    "changing the trace's color, even temporarily",
    "a harsh or generic neon effect that doesn't match the second image's glow",
    "any revealed segment of the trace fading or disappearing before the clip ends",
    "inventing an outline different from the reference",
    "ending on anything other than the exact, unmodified second image",
  ],
  fidelity: { preserveStructure: true, lockedCamera: true, noPropertyChanges: true },
  cameraMode: "locked",
  structuredExtras: {
    drawing_order: [
      "ground-level property boundary",
      "roofline",
      "any secondary structures or pathways already outlined in the second image",
    ],
    persistence: "each segment of the trace remains lit once revealed — nothing fades or disappears as the beam continues",
  },
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
