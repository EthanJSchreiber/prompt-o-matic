# Prompt-o-Matic Style Guide

The site is styled to look like a personal webpage from ~1998, before CSS
was widely used and before "web design" was a discipline. It is a
deliberate choice, not laziness. The content is the point; the chrome
should get out of its way.

## Guiding principles

1. **Content first.** Prompts are prose. They should read as prose,
   in a serif font, at a comfortable size, with generous line spacing.
2. **No external stylesheet.** Presentation lives inline in
   [`index.html`](index.html) using deprecated-but-supported HTML
   attributes (`bgcolor`, `<font>`, `<center>`, `border`). This is on
   purpose. If you find yourself reaching for `<style>` or a `.css`
   file, stop.
3. **No web fonts, no icons, no images.** Times New Roman is universal
   and free. The retro aesthetic depends on the browser's default
   rendering.
4. **No frameworks, no build step.** Vanilla JS. One script tag from a
   CDN (`js-yaml`). That is all.
5. **Every rendered element is a real HTML element from 1998.**
   `<blockquote>`, `<hr>`, `<center>`, `<font>`, `<table>`, `<input>`,
   `<label>`. No `<div class="...">` soup.

## Color palette

| Element         | Value       | Notes                                  |
|-----------------|-------------|----------------------------------------|
| Page background | `#c0c0c0`   | Classic Windows 95 gray                |
| Panel background| `#ffffe0`   | Light yellow ("legal pad")             |
| Body text       | `#000000`   | Pure black                             |
| Links           | `#0000ee`   | Browser-default blue                   |
| Visited links   | `#551a8b`   | Browser-default purple                 |
| Muted text      | `#555555` / `#666666` | For metadata and footers   |
| Error text      | `#aa0000`   | Rust red, for the rare error state     |

Do not introduce new colors without a reason. There should never be
gradients, shadows, or transparency.

## Typography

- **Face:** `Times New Roman`, always. Set inline via `<font face>`.
- **Sizes** use the deprecated `<font size="N">` scale, 1–6:
  - `6` — the site header
  - `5` — a served prompt (largest content)
  - `4` — form step headers ("Step 1.", "Step 2.", …)
  - `3` — form body copy and result text
  - `2` — metadata, footer, inventory line
  - `1` — reserved (unused right now)
- **Emphasis:** `<b>` for the button labels and step headers, `<i>` for
  quiet metadata, `&ldquo; &rdquo;` around served prompts.

## Layout

- The entire page is centered horizontally with `<center>`.
- The main body is inside a `<table border="0" width="640">` so line
  length stays readable on wide monitors. 640 px is a fixed width —
  this is a period-appropriate choice, do not make it responsive.
- The header is its own `<table border="3" cellpadding="12">` with the
  legal-pad background, sitting above the main table. Think of it as
  a printed letterhead.
- `<hr size="2" noshade>` separates functional sections. Do not use it
  for decoration; every `<hr>` should mark a change in purpose (form,
  output, inventory, meta).

## Interaction patterns

- The **primary action** is the giant `PROMPT ME` submit button. Give
  it two leading and two trailing spaces (`"  PROMPT ME  "`) so it
  reads as chunky and pressable, not cramped.
- **Meta actions** (start over, view raw prompts, external links) are
  formatted as bracketed links, e.g. `[start over]`. Never as buttons.
  This mirrors 1998 conventions where "click here"-style links did
  everything.
- **Form fields** get default browser rendering — no attempt to style
  radios, checkboxes, or the submit button beyond font-family / size.
- **Results** replace the output area in place. Never open a modal,
  never navigate.

## Voice (for user-facing copy)

- Direct, slightly dry, self-aware. See the sub-header
  (`est. 2026 · no signup, no tracking`) as the reference tone.
- No exclamation points except in error text (which we do not have).
- No emoji. Ever.
- Use en/em dashes freely (`—`), not `--`.
- When referring to the site, spell it **Prompt-o-Matic** — capital P,
  lowercase o, capital M. Not "Prompt-O-Matic" or "PromptOMatic".

## Prompt writing

Prompts live in [`prompts.yml`](prompts.yml) and are considered part of
the site's voice. Keep them:

- **Concrete.** A specific object, place, or moment beats an abstract
  theme.
- **One sentence.** Two at most. If it needs a paragraph, it is a
  writing exercise, not a prompt.
- **Neutral in tone.** The tone-suggestion feature is what layers voice
  on top. The prompt itself should not already be snarky or dramatic —
  it should accept any tone gracefully.
- **Free of proper nouns.** No named characters, cities, or brands.
  Prompts should feel adaptable to any writer's life or setting.
- **Not "write a story about"-shaped.** Prefer concrete situations
  ("A blacksmith forges a sword that refuses to be used for violence")
  or clear directives for poetry ("Write a poem in which weather is the
  antagonist").

## What is off-limits

- CSS files, `<style>` blocks, or `style="..."` attributes beyond
  what is already in [`index.html`](index.html) for the submit button.
- JavaScript frameworks, bundlers, TypeScript, or any build tooling.
- Cookies, analytics, telemetry, tracking pixels, third-party
  embeds.
- Images, SVGs, favicons, or web fonts.
- Dark mode, responsive breakpoints, or any accommodation for modern
  design conventions. The site looks the same at 320 px as at 4K, and
  that is fine.
