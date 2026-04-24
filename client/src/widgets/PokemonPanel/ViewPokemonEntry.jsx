import Button from './components/Button.jsx';
import Card from './components/Card.jsx';
import InvertedButton from './components/InvertedButton.jsx';

/**
 * @param {Object} props
 * @param {string} props.fieldName
 * @param {any} props.value
 * @returns
 */
function Field({ fieldName, value }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-slate-400">
        {fieldName}
      </p>
      <p className="mt-1 text-lg font-semibold text-slate-900">{value}</p>
    </div>
  );
}

/**
 * @param {Object} props
 * @param {string} props.statName
 * @param {number} props.value
 * @param {number} props.percent
 */
function StatBar({ statName, value, percent }) {
  return (
    <div key={statName} className="space-y-2">
      <div className="flex items-center justify-between text-sm">
        <span className="font-medium text-slate-700 uppercase">{statName}</span>
        <span className="font-semibold text-slate-900">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full rounded-full bg-linear-to-r from-rose-500 to-amber-400"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

/**
 * @param {Object} props
 * @param {import('../../globals.d.js').Pokemon} props.pokemon
 * @param {(pokemon: import('../../globals.d.js').Pokemon) => void} props.onDelete
 * @param {(pokemon: import('../../globals.d.js').Pokemon) => void} props.onStartEdit
 */
export default function ViewPokemonEntry({ pokemon, onDelete, onStartEdit }) {
  async function handleDelete() {
    const res = await fetch(`http://localhost:9443/pokemon/${pokemon.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();
    if (!res.ok)
      throw new Error(data.error || 'Something went wrong (Try again later)');
  }

  const statPeak = Math.max(...pokemon.stats.map((stat) => stat.value), 1);

  return (
    <div className="space-y-5 pb-8">
      <Card>
        <div className="flex gap-5 flex-row items-start">
          <div className="flex shrink-0 items-center justify-center rounded-4xl border border-slate-200 bg-slate-50 p-4 w-1/3 aspect-square">
            {pokemon.image ? (
              <img
                src={pokemon.image}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center text-center text-sm text-slate-400">
                No Image
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500">
                #{String(pokemon.id).padStart(3, '0')}
              </p>
              <h1 className="font-black tracking-tight text-slate-900 text-4xl capitalize">
                {pokemon.name}
              </h1>
              <p className="max-w-2xl text-sm leading-6 text-slate-600">
                {pokemon.desc}
              </p>
            </div>

            <div className="grid gap-3 grid-cols-3">
              <Field fieldName="Weight" value={pokemon.weight}></Field>
              <Field fieldName="Height" value={pokemon.height}></Field>
              <Field
                fieldName="Base Exp"
                value={pokemon.baseExperience}
              ></Field>
            </div>
          </div>
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 flex items-center justify-between gap-3 text-lg font-bold tracking-tight">
          Stats
        </h2>

        <div className="space-y-4">
          {pokemon.stats.map((stat) => (
            <StatBar
              key={stat.name}
              statName={stat.name}
              value={stat.value}
              percent={Math.max(6, Math.round((stat.value / statPeak) * 100))}
            />
          ))}
        </div>
      </Card>

      <Card>
        <h2 className="mb-4 text-lg font-bold tracking-tight">Abilities</h2>
        <div className="flex flex-wrap gap-2">
          {pokemon.abilities.map((ability, index) => (
            <span
              key={index}
              className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1.5 text-sm font-medium text-rose-700 capitalize"
            >
              {ability}
            </span>
          ))}
        </div>
      </Card>

      {pokemon.cries && (
        <Card>
          <h2 className="mb-4 text-lg font-bold tracking-tight">Cries</h2>
          <audio controls key={pokemon.cries} className="w-full">
            <source src={pokemon.cries} type="audio/mpeg" />
            Your browser does not support the audio tag.
          </audio>
        </Card>
      )}

      <div className="flex flex-wrap gap-3">
        <Button buttonName="Edit Entry" onClick={() => onStartEdit(pokemon)} />
        <InvertedButton
          buttonName="Delete"
          onClick={() => {
            handleDelete();

            onDelete(pokemon);
          }}
        />
      </div>
    </div>
  );
}
