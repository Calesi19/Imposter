# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev        # start dev server (add -- --host to expose on local network for phone testing)
npm run build      # production build (also generates PWA service worker)
npm run preview    # preview production build locally
```

## Architecture

Single-page app with no router. `App.jsx` renders one full-screen component based on `state.phase`.

**State machine** (`src/hooks/useGameState.js`) is the single source of truth. All game logic flows through it. Phases:

```
SETUP → REVEAL_SEQUENCE → DISCUSSION → VOTING → RESULT → IMPOSTER_GUESS → GAME_OVER
```

From DISCUSSION, skipping the vote goes straight to RESULT, and RESULT then returns to SETUP. VOTING only leads to IMPOSTER_GUESS if the accused really is an Imposter; otherwise RESULT goes to GAME_OVER. The title screen (`CoverScreen`) is not a phase: `App.jsx` shows it once per load, in front of SETUP.

**Pure logic** (`src/utils/gameLogic.js`) — `pickWord`, `pickImposter`, `tallyVotes` — is stateless and separate from the hook. Votes are keyed by player index because names can repeat.

**Word data** (`src/data/words.js`, plus `_es` and `_pt`) exports `CATEGORIES` (object keyed by category ID). Each category has `label`, `emoji`, and `words[]`.

**Copy** lives in `src/i18n/{en,es,pt}.json`; every key must exist in all three. `t()` uses a `key_one` variant when `count` is 1.

**Screens** (`src/components/screens/`) are full-viewport components — one per game phase, plus `CoverScreen`.

Settings (players, categories, imposter count, hints, language, sound) persist in `localStorage`. The game in progress is in-memory only — a page refresh resets it.

## Design system: The Classified Dossier

One case file on one lit desk. `src/index.css` holds the tokens (`@theme`), type roles (`.t-display`, `.t-h1`, `.t-h2`, `.t-body`, `.t-label`) and physical objects (`.sheet`, `.folder`, `.stamp`, `.polaroid`, `.console`). Use a role, not an ad-hoc font size; League Gothic is for stamps and headings, Special Elite for everything typed.

**UI primitives** (`src/components/ui/`): `StampButton` (primary action; plays the slam, then calls `onClick` 210ms later), `Stamp` (decorative ink), `RedactionStrip`, `Polaroid` (procedural mugshot seeded by name), `RotaryDial`, `ToggleSwitch`, `Typewriter`, `CategoryCard`, `Paperclip`, `Desk`, and `BottomBar`.

Rules that protect the game or the layout:

- **The Redaction Strip is the signature interaction.** A secret is visible only while it is held open; with `keepOpen` it stays off once dragged past 72%. It also works by holding Space or Enter, and by assistive-tech activation.
- **Nothing may reveal a player's role.** Word and Imposter sheets share one layout, ink colour and set of sounds.
- **Fixed bars go through `BottomBar`.** It portals to `<body>`, because the scene's `.deal-in` transform captures `position: fixed`.
- **One `animation` per element.** `.stamp-slam` and `.thud` overwrite each other, so `.thud` goes on the sheet under the stamp.
- **Textures are baked**, not live SVG filters. Regenerate them with `node scripts/make-textures.mjs` (needs `cwebp`).
- **Sound is synthesised** in `src/utils/sound.js`, so there are no audio assets.

## PWA

`vite-plugin-pwa` generates the service worker and manifest at build time via `vite.config.js`. Icons must exist at `public/icons/icon-192.png` and `public/icons/icon-512.png`. The manifest locks orientation to portrait. Fonts are self-hosted through `@fontsource` and precached by the service worker, so the game runs offline.
