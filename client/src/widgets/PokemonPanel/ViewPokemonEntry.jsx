import properCase from '@/utils/properCase.js';

/**
 * @param {Object} props
 * @param {Pokemon} props.pokemon
 * @param {(Pokemon) => void} props.onDelete
 * @param {(Pokemon) => void} props.onStartEdit
 */
export default function ViewPokemonEntry({ pokemon, onDelete, onStartEdit }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold px-2 py-1">
          {properCase(pokemon.name)}
        </h1>
      </div>

      <div className="flex gap-6">
        <div className="w-40 shrink-0">
          <img
            src={pokemon.image}
            alt={pokemon.name}
            className="h-40 w-40 rounded-lg border object-contain p-2"
          />
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-sm font-medium">Description</h2>
            <p className="mt-1 text-sm">{pokemon.desc}</p>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div>
              <span className="block font-medium">Weight</span>
              <span>{pokemon.weight}</span>
            </div>
            <div>
              <span className="block font-medium">Height</span>
              <span>{pokemon.height}</span>
            </div>
            <div>
              <span className="block font-medium">Base Experience</span>
              <span>{pokemon.baseExperience}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-3 text-lg font-semibold">Stats</h2>
        <div className="space-y-2">
          {pokemon.stats.map((stat) => (
            <div key={stat.name} className="flex justify-between text-sm">
              <span className="font-medium">{properCase(stat.name)}</span>
              <span>{stat.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-3 text-lg font-semibold">Abilities</h2>
        <div className="flex flex-wrap gap-2">
          {pokemon.abilities.map((ability, index) => (
            <span key={index} className="rounded-md border px-3 py-1 text-sm">
              {ability}
            </span>
          ))}
        </div>
      </div>

      {pokemon.cries !== null && (
        <div className="rounded-lg border p-4">
          <h2 className="mb-3 text-lg font-semibold">Cries</h2>
          <audio controls key={pokemon.cries} className="w-full">
            <source src={pokemon.cries} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={onStartEdit}
          className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          Edit
        </button>
        <button
          onClick={onDelete}
          className="rounded-md border px-4 py-2 hover:bg-gray-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
