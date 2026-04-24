import { useState } from 'react';
import properCase from '@/utils/properCase.js';

/**
 * @param {Object} props
 * @param {import('@/globals.d.js').Pokemon} props.pokemon
 * @param {(customPokemon: import('@/globals.d.js').CustomPokemon) => void} props.onFinishEdit
 */
export default function EditPokemonEntry({ pokemon, onFinishEdit }) {
  const [updatedPokemon, setForm] = useState(pokemon);

  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  function updateStat(index, value) {
    setForm((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, i) =>
        i === index ? { ...stat, value: Number(value) } : stat,
      ),
    }));
  }

  function updateAbility(index, value) {
    setForm((prev) => ({
      ...prev,
      abilities: prev.abilities.map((ability, i) =>
        i === index ? value : ability,
      ),
    }));
  }

  function addAbility() {
    setForm((prev) => ({
      ...prev,
      abilities: [...prev.abilities, ''],
    }));
  }

  function removeAbility(index) {
    setForm((prev) => ({
      ...prev,
      abilities: prev.abilities.filter((_, i) => i !== index),
    }));
  }

  /**
   * @param {import('react').SubmitEvent<HTMLFormElement>} e
   */
  async function handleSubmit(e) {
    e.preventDefault();

    const res = await fetch(
      `http://localhost:9443/pokemon/${updatedPokemon.id}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPokemon),
      },
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data.error);

    onFinishEdit(updatedPokemon);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold inline-block px-2 py-1">
          Editing {properCase(updatedPokemon.name)}
        </h1>
      </div>

      <div className="flex gap-6">
        <div className="w-40 shrink-0">
          {updatedPokemon.image && (
            <img
              src={updatedPokemon.image}
              alt={updatedPokemon.name}
              className="h-40 w-40 rounded-lg border object-contain p-2"
            />
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={updatedPokemon.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={updatedPokemon.desc}
              onChange={(e) => updateField('desc', e.target.value)}
              rows={4}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium">Weight</label>
              <input
                type="number"
                value={updatedPokemon.weight}
                onChange={(e) => updateField('weight', Number(e.target.value))}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Height</label>
              <input
                type="number"
                step="0.1"
                value={updatedPokemon.height}
                onChange={(e) => updateField('height', Number(e.target.value))}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">
                Base Experience
              </label>
              <input
                type="number"
                value={updatedPokemon.baseExperience}
                onChange={(e) =>
                  updateField('baseExperience', Number(e.target.value))
                }
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <h2 className="mb-3 text-lg font-semibold">Stats</h2>
        <div className="space-y-3">
          {updatedPokemon.stats.map((stat, index) => (
            <div key={stat.name} className="flex items-center gap-3">
              <span className="w-40 text-sm font-medium">
                {properCase(stat.name)}
              </span>
              <input
                type="number"
                value={stat.value}
                onChange={(e) => updateStat(index, e.target.value)}
                className="w-full rounded-md border px-3 py-2"
              />
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Abilities</h2>
          <button
            type="button"
            onClick={addAbility}
            className="rounded-md border px-3 py-1 text-sm hover:bg-gray-50"
          >
            Add ability
          </button>
        </div>

        <div className="space-y-3">
          {updatedPokemon.abilities.map((ability, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={ability}
                onChange={(e) => updateAbility(index, e.target.value)}
                className="w-full rounded-md border px-3 py-2"
              />
              <button
                type="button"
                onClick={() => removeAbility(index)}
                className="rounded-md border px-3 py-2 text-sm hover:bg-gray-50"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          className="rounded-md bg-black px-4 py-2 text-white hover:bg-gray-800"
        >
          Save changes
        </button>
        <button
          type="button"
          onClick={() => onFinishEdit(pokemon)}
          className="rounded-md border px-4 py-2 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
