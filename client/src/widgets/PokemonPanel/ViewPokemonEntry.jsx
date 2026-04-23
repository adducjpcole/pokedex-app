import properCase from '@/utils/properCase.js';

/**
 * @param {Object} param
 * @param {Pokemon} param.pokemon
 * @param {(Pokemon) => void} param.onDelete
 * @param {(Pokemon) => void} param.onStartEdit
 */
export default function ViewPokemonEntry({ pokemon, onDelete, onStartEdit }) {
  return (
    <div>
      <h1>{properCase(pokemon.name)}</h1>
      <img src={pokemon.image} />
      <p>{pokemon.desc}</p>
      <p>weight: {pokemon.weight}</p>
      <p>height: {pokemon.height}</p>
      <p>base experience: {pokemon.baseExperience}</p>
      <div>
        stats
        <ul>
          {pokemon.stats.map((v) => (
            <li key={v.name}>
              {v.name}: {v.value}
            </li>
          ))}
        </ul>
      </div>

      <div>
        abilities
        <ul>
          {pokemon.abilities.map((v, i) => (
            <li key={i}>{v}</li>
          ))}
        </ul>
      </div>

      {pokemon.cries !== null && (
        <div>
          cries
          <audio controls key={pokemon.cries}>
            <source src={pokemon.cries} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      )}

      <button className="hover:cursor-pointer" onClick={onStartEdit}>
        Edit
      </button>
      <button className="hover:cursor-pointer" onClick={onDelete}>
        Delete
      </button>
    </div>
  );
}
