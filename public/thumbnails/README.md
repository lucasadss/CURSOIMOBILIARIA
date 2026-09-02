# Covers (thumbnails)

Real photos for module / category / training / hero covers live here. See
`CREDITS.md` for where the current set came from. Until a slug is registered
in `AVAILABLE_THUMBS` (`lib/assets.ts`), that cover falls back to the
**category scene** — a warm dark architectural illustration that depicts the
subject, not an abstract gradient.

## How to add or replace a photo

1. Export a **JPG**, ~1600×900 (16:9), ideally under 300 KB.
2. Save with the exact name:

   | Onde aparece  | Nome do arquivo                     |
   | ------------- | ------------------------------------ |
   | Módulo        | `<slug-do-modulo>.jpg`               |
   | Categoria     | `categoria-<slug-da-categoria>.jpg`  |
   | Treinamento   | `treinamento-<slug-do-treino>.jpg`   |
   | Hero da Home  | `hero.jpg` (e opcional `hero.mp4`)   |

3. Make sure the slug is listed in `AVAILABLE_THUMBS` in
   [`lib/assets.ts`](../../lib/assets.ts) (already true for everything below —
   only needed for new additions).

## How to add or replace a hover-preview video

Only a handful of modules use this (currently: `entrada-cinematografica`,
`apresentacao-profissional`, `building-revealing-video`, `voo-de-drone`,
`mobiliando-comodos`). To add one:

1. Export a short **MP4**, 5–8s, muted, ~960px wide, H.264, no audio track.
2. Save as `<slug-do-modulo>-preview.mp4`.
3. Add the slug to `AVAILABLE_PREVIEWS` in `lib/assets.ts`.

The clip only loads on hover (desktop pointers only — never on touch), loops
muted with no controls, and reverts to the module's static thumbnail on
mouse-leave. `prefers-reduced-motion` disables it entirely.

## Currently populated

**Modules (9):** decoracao-de-interiores · casa-em-terreno · metragem-do-terreno ·
timelapse-de-construcao · mobiliando-comodos · entrada-cinematografica ·
apresentacao-profissional · building-revealing-video · voo-de-drone

**Categories (5):** terrenos · construcao · interiores · imovel-pronto ·
cinematograficos (`redes-sociais` and `outros` have no modules yet — still on
the scene fallback)

**Trainings (3):** fundamentos-imovel-ia · videos-que-convertem ·
terreno-ao-lancamento

**Hero:** yes

**Preview videos (5):** entrada-cinematografica · apresentacao-profissional ·
building-revealing-video · voo-de-drone · mobiliando-comodos

Everything else (the remaining ~13 stub modules) still uses the scene
fallback — add their slugs here the same way as the list above.
