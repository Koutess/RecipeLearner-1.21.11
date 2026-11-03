import recipes from '../src/data/recipes.json';
import { validateRecipes } from '../src/lib/validate';

const errors = validateRecipes(recipes);
const list = recipes as { verified: boolean }[];
const verified = list.filter((r) => r.verified).length;
console.log(`${list.length} recipes, ${verified} verified against 1.21.11 data, ${list.length - verified} unverified.`);
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log('Recipe data is structurally valid.');
