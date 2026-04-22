import { readFile, writeFile } from 'node:fs/promises';
import queueWrite from '../utils/queueWrite.js';

const DATA_FILE = './data/pokemon.json';

async function readPokemonList() {
  const raw = await readFile(DATA_FILE, 'utf8');
  return raw.trim() ? JSON.parse(raw) : [];
}

async function writePokemonList(list) {
  await queueWrite(() => writeFile(DATA_FILE, JSON.stringify(list, null, 2)));
}

function getNextId(list) {
  return list.reduce((max, p) => Math.max(max, p.id ?? 0), 0) + 1;
}

function tryParseJsonField(value, fallback) {
  if (value == null || value === '') return fallback;

  if (typeof value === 'string') {
    try {
      return JSON.parse(value);
    } catch {
      return fallback;
    }
  }

  return value;
}

function tryParsePokemonInput({ body, file }) {
  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const desc = typeof body.desc === 'string' ? body.desc.trim() : '';

  const weight = Number(body.weight);
  const height = Number(body.height);
  const baseExperience = Number(body.baseExperience);

  const stats = tryParseJsonField(body.stats, []);
  const abilities = tryParseJsonField(body.abilities, []);

  let image = null;
  if (file) {
    image = `/uploads/${file.filename}`;
  } else if (typeof body.image === 'string' && body.image.trim() !== '') {
    if (!/^https?:\/\/.+/i.test(body.image)) {
      return 'Invalid image URL';
    }
    image = body.image.trim();
  }

  return {
    id: -1,
    name,
    image,
    desc,
    weight,
    height,
    baseExperience,
    stats,
    abilities,
  };
}

function validatePokemon(data) {
  if (!data.name) return 'Pokemon name cannot be empty';
  if (!data.desc) return 'Description cannot be empty';
  if (Number.isNaN(data.weight)) return 'Weight must be a number';
  if (Number.isNaN(data.height)) return 'Height must be a number';
  if (Number.isNaN(data.baseExperience))
    return 'Base experience must be a number';

  if (!Array.isArray(data.stats)) return 'Stats must be an array';
  if (!Array.isArray(data.abilities)) return 'Abilities must be an array';

  if (
    data.stats.some(
      (s) =>
        !s ||
        typeof s.name !== 'string' ||
        typeof s.value !== 'number' ||
        Number.isNaN(s.value),
    )
  ) {
    return 'Each stat must have a string name and numeric value';
  }

  if (data.abilities.some((a) => typeof a !== 'string' || a.trim() === '')) {
    return 'Each ability must be a non-empty string';
  }

  return null;
}

// CREATE
export async function createPokemon(req, res) {
  try {
    const parsed = tryParsePokemonInput(req);

    if (typeof parsed === 'string') {
      return res.status(400).json({ error: parsed });
    }

    const validationError = validatePokemon(parsed);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const list = await readPokemonList();

    const newPokemon = {
      ...parsed,
      id: getNextId(list),
    };

    list.push(newPokemon);
    await writePokemonList(list);

    return res.status(201).json(newPokemon);
  } catch (error) {
    console.error('Error adding Pokemon:', error);
    return res.status(500).json({ error: 'Failed to add Pokemon' });
  }
}

// READ
export async function getAllPokemon(_req, res) {
  try {
    const list = await readPokemonList();
    return res.json(list);
  } catch (error) {
    console.error('Error reading Pokemon list:', error);
    return res.status(500).json({ error: 'Failed to load Pokemon' });
  }
}

// READ
export async function getPokemonById(req, res) {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
      return res.status(400).json({ error: 'Invalid Pokemon id' });
    }

    const list = await readPokemonList();
    const pokemon = list.find((p) => p.id === id);

    if (!pokemon) {
      return res.status(404).json({ error: 'Pokemon not found' });
    }

    return res.json(pokemon);
  } catch (error) {
    console.error('Error reading Pokemon:', error);
    return res.status(500).json({ error: 'Failed to load Pokemon' });
  }
}
