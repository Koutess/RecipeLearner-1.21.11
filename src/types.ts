export type Category = 'building' | 'redstone' | 'equipment' | 'misc';

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'building', label: 'Building Blocks' },
  { id: 'redstone', label: 'Redstone' },
  { id: 'equipment', label: 'Equipment' },
  { id: 'misc', label: 'Miscellaneous' },
];

/** One crafting-table recipe. `grid` is always the 3x3 display layout (row-major, 9 cells). */
export interface Recipe {
  id: string;
  name: string;
  category: Category;
  type: 'shaped' | 'shapeless';
  /** Item ids such as "minecraft:stick". Tags start with "#" (e.g. "#minecraft:planks"). */
  grid: (string | null)[];
  result: { item: string; count: number };
  notes?: string;
  /** true only when checked against the official 1.21.11 data. */
  verified: boolean;
  source: string;
}
