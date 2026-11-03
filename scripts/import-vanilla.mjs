// Converts the OFFICIAL 1.21.11 recipe JSON files into src/data/recipes.json.
// UNTESTED against real data: run it, then review the report it prints.
//
// Usage: node scripts/import-vanilla.mjs <recipeDir> [en_us.json]
//   recipeDir  = data/minecraft/recipe from the 1.21.11 client jar (or `java -DbundlerMainClass=net.minecraft.data.Main -jar server.jar --server`)
//   en_us.json = assets/minecraft/lang/en_us.json from the same jar (for exact in-game names)
import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const [dir, langFile] = process.argv.slice(2);
if (!dir) { console.error('Usage: node scripts/import-vanilla.mjs <recipeDir> [en_us.json]'); process.exit(1); }
const lang = langFile ? JSON.parse(readFileSync(langFile, 'utf8')) : {};
const strip = (id) => id.replace(/^minecraft:/, '');
const nameOf = (id) => lang[`item.minecraft.${id}`] ?? lang[`block.minecraft.${id}`] ??
  id.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
// An ingredient is an item id, a #tag, or an array of alternatives.
const ing = (v) => (Array.isArray(v) ? (v.length === 1 ? ing(v[0]) : v.map((x) => ing(x)).join('|')) : v);

const out = [], skipped = [];
for (const file of readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
  const r = JSON.parse(readFileSync(join(dir, file), 'utf8'));
  const id = file.replace(/\.json$/, '');
  const type = strip(r.type ?? '');
  if (type !== 'crafting_shaped' && type !== 'crafting_shapeless') { skipped.push(`${id} (${type})`); continue; }
  let grid = Array(9).fill(null);
  if (type === 'crafting_shaped') {
    r.pattern.forEach((row, y) => [...row].forEach((ch, x) => { if (ch !== ' ') grid[y * 3 + x] = ing(r.key[ch]); }));
  } else r.ingredients.forEach((v, i) => { grid[i] = ing(v); });
  const result = r.result;
  out.push({
    id, name: nameOf(strip(result.id)), category: r.category ?? 'misc',
    type: type === 'crafting_shaped' ? 'shaped' : 'shapeless', grid,
    result: { item: result.id, count: result.count ?? 1 },
    verified: true, source: 'Minecraft Java 1.21.11 data (official recipe JSON)',
  });
}
writeFileSync('src/data/recipes.json', JSON.stringify(out, null, 2));
console.log(`Imported ${out.length} crafting recipes.`);
console.log(`NOT imported (${skipped.length}) - review each one, special recipes need hand-written entries:`);
console.log(skipped.join('\n'));
