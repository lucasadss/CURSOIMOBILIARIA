# IMÓVEL IA — Área do cliente (Fase 1)

Plataforma para profissionais do mercado imobiliário criarem conteúdos com IA.
Descoberta estilo streaming na Home, workspace estilo SaaS dentro dos módulos.

## Rodar

```bash
npm install
npm run dev      # http://localhost:3000/app
npm run build
```

> No Windows, o binário nativo do SWC pode estar bloqueado por política do sistema;
> o build cai automaticamente no SWC em WebAssembly (funciona, só mais lento).

## Stack

- **Next.js 15** (App Router) · React 19 · TypeScript
- **Tailwind v4** — tokens em `app/globals.css` (`@theme`). Trocar a cor da marca =
  editar `--color-brand` e as 4 variáveis irmãs.
- Radix primitives estilizados à mão em `components/ui/`
- `embla-carousel` (carrosséis) · `cmdk` (busca ⌘K) · `zustand` + `localStorage`
  (favoritos, histórico, progresso, preferências)
- Sem backend / auth / banco nesta fase — dados em `lib/`.

## Estrutura

```
app/
  app/
    (discover)/        # Home, Explorar, Categorias, Favoritos, Histórico,
                       # Treinamentos, FAQ  — usam AppHeader (topo)
    (workspace)/       # Módulo, Assistente, Suporte, Configurações
                       # — usam WorkspaceSidebar (lateral recolhível)
    layout.tsx         # Providers: tooltip + busca global + atalhos
components/
  ui/                  # botão, input, select, slider, dialog, drawer, tabs…
  layout/  home/  module/  training/  assistant/  common/  explore/
lib/
  modules/             # registro dinâmico de módulos
    definitions.ts     # 5 módulos completos
    stubs.ts           # demais módulos (navegáveis, prompt mais enxuto)
  prompt-engine/       # dados → template → regras → negativos → ferramenta → prompt
  categories.ts  trainings.ts  faq.ts  assistant.ts  user.ts
  storage/             # stores zustand persistidos
types/                 # ModuleDefinition, FieldConfig, PromptResult, …
hooks/
```

## Motor de módulos

`/app/modulo/[slug]` renderiza qualquer módulo a partir de uma `ModuleDefinition`.
Um módulo declara `beginnerFields` / `advancedFields` (renderizados por
`ModuleFieldRenderer`), `promptTemplate`, `hardNegatives`, `fidelity`,
`requiredImages`, `nextModule`, `toolGuide`, `supportMaterial`, etc.

O `prompt-engine` resolve os valores para rótulos legíveis, interpola o template
(descartando trechos de campos vazios), anexa regras / fidelidade / negativos e
aplica o perfil da ferramenta de destino. Saída em `plain_text` ou
`structured_json`.

### Módulos completos nesta fase

Decoração de Interiores · Casa em Terreno · Metragem do Terreno ·
Timelapse de Construção · Mobiliando Cômodos.

Os demais (~17) já aparecem em toda a navegação com campos reais; o texto final
do prompt é evoluído aos poucos.

## Preparado para depois

- Níveis de acesso (`accessLevel: free | pro | premium`) já modelados.
- Interfaces de dados prontas para Supabase (users, profiles, modules,
  categories, favorites, prompt_history, trainings, lessons, progress).
- Seletor de ferramenta (Google Flow / Midjourney / Runway / Pika / Sora) só
  formata o prompt — nenhuma integração real.
