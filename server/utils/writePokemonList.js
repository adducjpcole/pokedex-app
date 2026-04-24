import { fileURLToPath } from 'node:url';
import { writeFile } from 'node:fs/promises';
import queueWrite from './queueWrite.js';
import { invalidatePokemonListCache } from './readPokemonList.js';

const DATA_FILE = fileURLToPath(
  import.meta.resolve('../data/pokemonList.json'),
);

/**
 * @param {import("../globals.d.js").Pokemon[]} list
 */
export default async function writePokemonList(list) {
  await queueWrite(async (file) => {
    await writeFile(file, JSON.stringify(list, null, 2));
    invalidatePokemonListCache();
  }, DATA_FILE);
}
