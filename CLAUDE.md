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

**Pure logic** (`src/utils/gameLogic.js`) — `pickWord`, `pickImposter`, `tallyVotes` — is stateless and separate from the hook.

**Word data** (`src/data/words.js`) exports `CATEGORIES` (object keyed by category ID) and `ALL_CATEGORY_KEYS`. Each category has `label`, `emoji`, and `words[]`.

**Screens** (`src/components/screens/`) are full-viewport components — one per game phase. **UI primitives** (`src/components/ui/`) are `Button`, `PlayerChip`, and `CategoryCard`.

All game state is in-memory only — a page refresh resets the game. No persistence layer.

## PWA

`vite-plugin-pwa` generates the service worker and manifest at build time via `vite.config.js`. Icons must exist at `public/icons/icon-192.png` and `public/icons/icon-512.png`. The manifest locks orientation to portrait.
