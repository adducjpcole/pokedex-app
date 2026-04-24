/**
 * @typedef {import('express').Request<
 *   import('express-serve-static-core').ParamsDictionary,
 *   any,
 *   import('../globals.d.js').CustomPokemon
 * >} PokemonRequest
 */

import writePokemonList from '../utils/writePokemonList.js';
import readPokemonList from '../utils/readPokemonList.js';
import getMaxId from '../utils/getMaxId.js';
import parseJsonField from '../utils/parseJsonField.js';

/**
 * @param {PokemonRequest} req
 */
function parsePokemonInput(req) {
  const body = req.body;
  const file = req.file;

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const desc = typeof body.desc === 'string' ? body.desc.trim() : '';

  const weight = Number(body.weight);
  const height = Number(body.height);
  const baseExperience = Number(body.baseExperience);

  const stats = parseJsonField(body.stats, []);
  const abilities = parseJsonField(body.abilities, []);

  /** @type {string | null} */
  let image = null;
  if (file) {
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    image = `${baseUrl}/uploads/${file.filename}`;
  } else if (typeof body.image === 'string' && body.image.trim() !== '') {
    if (!/^https?:\/\/.+/i.test(body.image)) return 'Invalid image URL';

    image = body.image.trim();
  }

  /** @type {import('../globals.d.js').CustomPokemon} */
  const parsed = {
    // Will be set when saving
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

  return parsed;
}

/**
 * @param {import('../globals.d.js').CustomPokemon} data
 */
function validatePokemon(data) {
  if (!data.name) return 'Pokemon name cannot be empty';
  if (!data.desc) return 'Description cannot be empty';

  if (Number.isNaN(data.weight)) return 'Weight must be a number';
  if (data.weight < 0) return 'Weight cannot be negative';

  if (Number.isNaN(data.height)) return 'Height must be a number';
  if (data.height < 0) return 'Height cannot be negative';

  if (Number.isNaN(data.baseExperience))
    return 'Base experience must be a number';
  if (data.baseExperience < 0) return 'Base experience cannot be negative';

  if (!Array.isArray(data.stats)) return 'Stats must be an array';
  if (data.stats.length === 0) return 'At least one stat is required';

  if (
    data.stats.some(
      (s) =>
        !s ||
        typeof s.name !== 'string' ||
        s.name.trim() === '' ||
        typeof s.value !== 'number' ||
        Number.isNaN(s.value),
    )
  )
    return 'Each stat must have a non-empty string name and numeric value';
  if (data.stats.some((s) => s.value < 0))
    return 'Each stat value must be a non-negative number';

  if (!Array.isArray(data.abilities)) return 'Abilities must be an array';
  if (data.abilities.length === 0) return 'At least one ability is required';
  if (data.abilities.some((a) => typeof a !== 'string' || a.trim() === ''))
    return 'Each ability must be a non-empty string';

  return null;
}

/**
 * @param {PokemonRequest} req
 * @param {import('express').Response} res
 */
export async function createPokemon(req, res) {
  try {
    const parsed = parsePokemonInput(req);
    if (typeof parsed === 'string')
      return res.status(400).json({ error: parsed });

    const validationError = validatePokemon(parsed);
    if (validationError)
      return res.status(400).json({ error: validationError });

    const list = await readPokemonList();

    const newPokemon = {
      ...parsed,
      id: getMaxId(list) + 1,
    };

    list.push(newPokemon);
    await writePokemonList(list);

    return res.status(201).json(newPokemon);
  } catch (error) {
    console.error('Error adding Pokemon:', error);
    return res.status(500).json({ error: 'Failed to add Pokemon' });
  }
}

/**
 * @param {import('express').Request} _req
 * @param {import('express').Response} res
 */
export async function getAllPokemon(_req, res) {
  try {
    const list = await readPokemonList();
    return res.json(list);
  } catch (error) {
    console.error('Error reading Pokemon list:', error);
    return res.status(500).json({ error: 'Failed to load Pokemon' });
  }
}

/**
 * @param {import('express').Request<{ id: string }>} req
 * @param {import('express').Response} res
 */
export async function getPokemonById(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return res.status(400).json({ error: 'Invalid Pokemon id' });

    const list = await readPokemonList();
    const pokemon = list.find((p) => p.id === id);
    if (!pokemon) return res.status(404).json({ error: 'Pokemon not found' });

    return res.json(pokemon);
  } catch (error) {
    console.error('Error reading Pokemon:', error);
    return res.status(500).json({ error: 'Failed to load Pokemon' });
  }
}

/**
 * @param {PokemonRequest} req
 * @param {import('../globals.d.js').Pokemon} existingPokemon
 */
function parsePokemonUpdateInput({ body }, existingPokemon) {
  return {
    ...existingPokemon,
    name: typeof body.name === 'string' ? body.name.trim() : '',
    desc: typeof body.desc === 'string' ? body.desc.trim() : '',
    weight: Number(body.weight),
    height: Number(body.height),
    baseExperience: Number(body.baseExperience),
    abilities: parseJsonField(body.abilities, []),
  };
}

/**
 * @param {PokemonRequest} req
 * @param {import('express').Response} res
 */
export async function updatePokemon(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return res.status(400).json({ error: 'Invalid Pokemon id' });

    const list = await readPokemonList();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1)
      return res.status(404).json({ error: 'Pokemon not found' });

    const parsed = parsePokemonUpdateInput(req, list[index]);
    if (typeof parsed === 'string')
      return res.status(400).json({ error: parsed });

    const validationError = validatePokemon(parsed);
    if (validationError)
      return res.status(400).json({ error: validationError });

    const updatedPokemon = {
      ...list[index],
      ...parsed,
      id,
    };

    list[index] = updatedPokemon;
    await writePokemonList(list);

    return res.json(updatedPokemon);
  } catch (error) {
    console.error('Error updating Pokemon:', error);
    return res.status(500).json({ error: 'Failed to update Pokemon' });
  }
}

/**
 * @param {PokemonRequest} req
 * @param {import('express').Response} res
 */
export async function deletePokemon(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id) || id <= 0)
      return res.status(400).json({ error: 'Invalid Pokemon id' });

    const list = await readPokemonList();
    const index = list.findIndex((p) => p.id === id);
    if (index === -1)
      return res.status(404).json({ error: 'Pokemon not found' });

    const [deletedPokemon] = list.splice(index, 1);
    await writePokemonList(list);

    return res.json(deletedPokemon);
  } catch (error) {
    console.error('Error deleting Pokemon:', error);
    return res.status(500).json({ error: 'Failed to delete Pokemon' });
  }
}
