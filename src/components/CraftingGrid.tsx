import type { Recipe } from '../types';
import { itemLabel } from '../lib/items';

function hue(id: string) {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) % 360;
  return h;
}

/** Item textures are not bundled yet: slots show a coloured tile with the item name. */
function Slot({ item, count, hidden }: { item: string | null; count?: number; hidden?: boolean }) {
  if (!item) return <div className="slot" role="img" aria-label="empty slot" />;
  const label = itemLabel(item);
  return (
    <div className="slot" role="img" aria-label={hidden ? 'hidden item' : label} title={hidden ? '' : label}>
      <span className="tile" style={{ background: `hsl(${hue(item)} 45% 50%)` }}>
        {!hidden && <span className="tile-name">{label}</span>}
      </span>
      {count && count > 1 ? <span className="count">{count}</span> : null}
    </div>
  );
}

export function CraftingGrid({ recipe, hideResult }: { recipe: Recipe; hideResult?: boolean }) {
  return (
    <div className="crafting" aria-label={`${recipe.type} crafting recipe`}>
      <div className="grid3">{recipe.grid.map((c, i) => <Slot key={i} item={c} />)}</div>
      <span className="arrow" aria-hidden="true">➜</span>
      <Slot item={recipe.result.item} count={recipe.result.count} hidden={hideResult} />
    </div>
  );
}
