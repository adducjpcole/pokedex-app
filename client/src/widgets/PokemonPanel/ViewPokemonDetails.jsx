import properCase from '@/utils/properCase.js';

/**
 * @param {Object} param
 * @param {CustomPokemon} param.pokemon
 */
export default function ViewPokemonDetails({ pokemon }) {
  return (
    <>
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

      <div>
        cries
        <audio controls>
          <source src={pokemon.cries} type="audio/mpeg" />
          Your browser does not support the audio tag.
        </audio>
      </div>
    </>
  );
}
