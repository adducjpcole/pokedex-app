import { readFile } from 'node:fs/promises';

/**
 * @type {import('../globals.d.js').Pokemon[]|null}
 */
let pokemonListCache = null;
/**
 * @type {Promise<import('../globals.d.js').Pokemon[]>|null}
 */
let pokemonListCachePromise = null;

/**
 * @returns {Promise<import('../globals.d.js').Pokemon[]>}
 */
export default async function readPokemonList() {
  if (pokemonListCache) return pokemonListCache;
  if (pokemonListCachePromise) return pokemonListCachePromise;

  pokemonListCachePromise = (async () => {
    const raw = await readFile('./data/pokemonList.json', 'utf8');
    const list = raw.trim() ? JSON.parse(raw) : [];
    pokemonListCache = list;
    return list;
  })();

  try {
    return await pokemonListCachePromise;
  } finally {
    pokemonListCachePromise = null;
  }
}

export function invalidatePokemonListCache() {
  pokemonListCache = null;
}
