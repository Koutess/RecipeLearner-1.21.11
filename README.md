# Minecraft Recipe Mastery

A private study app for **Minecraft Java Edition 1.21.11 crafting-table recipes**: browse, learn in guided lessons, quiz yourself, and track mastery.

## Status: first scaffold, NOT yet run
This code was written without the ability to run `npm install`, tests or a build. Treat everything as untested until the commands below pass on your machine.

```bash
npm install
npm run validate:recipes   # checks recipe data structure
npm run typecheck && npm test
npm run dev
```

## Recipe data (most important)
`src/data/recipes.json` currently holds **8 seed recipes written from memory, all marked `verified: false`**. Do not rely on them. The real database is generated from the game's own files:

1. Get the 1.21.11 client jar (from your Minecraft install) and unzip it.
2. `node scripts/import-vanilla.mjs <jar>/data/minecraft/recipe <jar>/assets/minecraft/lang/en_us.json`
3. Read the report: special recipes (banner/firework/map/dye variants etc.) are listed, not silently dropped, and need hand-written entries.
4. `npm run validate:recipes`

Shaped recipes are displayed anchored top-left in a 3x3 grid. In-game they can sit anywhere in the grid.

## Decisions so far
Minecraft-authentic look · themes Overworld + Deepslate (remembered, follows device by default) · sidebar / mobile tab bar · in-game categories · crafting-table recipes only · guided lessons + free choice · learned = automatic · quiz: typed identify + quantity questions · no difficulty levels · progress in localStorage.
Mastered (my default, change in `src/lib/progress.ts`): 3 correct in a row, on 2+ days, including a typed answer.

## Not done yet
Item textures (private use; add later), GitHub Pages deploy (public by default), Claude GitHub Action (`@claude`), an accessibility audit, a mobile pass.
