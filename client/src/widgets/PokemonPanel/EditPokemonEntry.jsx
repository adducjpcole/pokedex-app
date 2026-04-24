import { useState } from 'react';
import properCase from '@/utils/properCase.js';

/**
 * @param {Object} props
 * @param {import('@/globals.d.js').Pokemon} props.pokemon
 * @param {(customPokemon: import('@/globals.d.js').CustomPokemon) => void} props.onFinishEdit
 */
export default function EditPokemonEntry({ pokemon, onFinishEdit }) {
  const [form, setForm] = useState(pokemon);

  /**
   * @template {keyof import('@/globals.d.js').CustomPokemon} T
   * @param {T} field
   * @param {import('@/globals.d.js').CustomPokemon[T]} value
   */
  function updateField(field, value) {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  }

  /**
   * @param {number} idx
   * @param {string} val
   */
  function updateAbility(idx, val) {
    setForm((prev) => ({
      ...prev,
      abilities: prev.abilities.map((ability, i) =>
        i === idx ? val : ability,
      ),
    }));
  }

  function addAbility() {
    setForm((prev) => ({
      ...prev,
      abilities: [...prev.abilities, ''],
    }));
  }

  /**
   * @param {number} idx
   */
  function removeAbility(idx) {
    setForm((prev) => ({
      ...prev,
      abilities: prev.abilities.filter((_, i) => i !== idx),
    }));
  }

  /**
   * @param {import('react').SubmitEvent<HTMLFormElement>} ev
   */
  async function handleSubmit(ev) {
    ev.preventDefault();

    const res = await fetch(`http://localhost:9443/pokemon/${form.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to update Pokemon');

    onFinishEdit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold inline-block px-2 py-1">
          Editing {properCase(form.name)}
        </h1>
      </div>

      <div className="flex gap-6">
        <div className="w-40 shrink-0">
          {form.image && (
            <img
              src={form.image}
              alt={form.name}
              className="h-40 w-40 rounded-lg border object-contain p-2"
            />
          )}
        </div>

        <div className="flex-1 space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <textarea
              value={form.desc}
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
                value={form.weight}
                onChange={(e) => updateField('weight', Number(e.target.value))}
                className="mt-1 w-full rounded-md border px-3 py-2"
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Height</label>
              <input
                type="number"
                step="0.1"
                value={form.height}
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
                value={form.baseExperience}
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
          {form.abilities.map((ability, index) => (
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
