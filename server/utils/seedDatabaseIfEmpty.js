import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import queueWrite from './queueWrite.js';

/**
 * @param {import("node:fs").PathLike} dataDir
 * @param {import("node:fs").PathLike} dataFile
 */
export default async function seedDatabaseIfEmpty(dataDir, dataFile) {
  await mkdir(dataDir, { recursive: true });

  let existing = [];
  if (existsSync(dataFile)) {
    const raw = await readFile(dataFile, 'utf8');
    existing = raw.trim() ? JSON.parse(raw) : [];
  }
  if (existing.length > 0) return;

  const res = await fetch(
    'https://pokeapi.co/api/v2/pokemon?offset=30&limit=30',
  );
  if (!res.ok) {
    throw new Error(`Failed to fetch Pokémon list: ${res.status}`);
  }
  const list = await res.json();

  const seeded = await Promise.all(
    list.results.map(async (p) => {
      const detailRes = await fetch(p.url);
      if (!detailRes.ok) throw new Error(`Failed to fetch ${p.name}`);
      const details = await detailRes.json();

      const speciesRes = await fetch(details.species.url);
      if (!speciesRes.ok)
        throw new Error(`Failed to fetch species for ${details.name}`);
      const species = await speciesRes.json();

      return {
        id: details.id,
        name: details.name,
        image: details.sprites?.front_default ?? null,
        desc:
          species.flavor_text_entries
            .find((e) => e.language.name === 'en')
            ?.flavor_text.replace(/\n|\f/g, ' ') || '',
        weight: Number(((details.weight ?? 0) * 0.1).toFixed(4)),
        height: Number(((details.height ?? 0) * 0.1).toFixed(4)),
        baseExperience: details.base_experience,
        stats: details.stats.map((s) => ({
          name: s.stat.name,
          value: s.base_stat,
        })),
        abilities: details.abilities.map((a) => a.ability.name),
        cries: details.cries.latest,
      };
    }),
  );

  await queueWrite(() => writeFile(dataFile, JSON.stringify(seeded, null, 2)));
}
