/**
 * @typedef {Object} CustomPokemon
 * @property {number} id
 * @property {string} name
 * @property {string?} image
 * @property {string} desc
 * @property {number} weight
 * @property {number} height
 * @property {number} baseExperience
 * @property {{ name: string, value: number }[]} stats
 * @property {string[]} abilities
 */

/**
 * @typedef {CustomPokemon & {
 *   cries?: string
 * }} Pokemon
 */

/**
 * @typedef {'view'|'edit'|'create'} PokemonPanelMode
 */

export {};
