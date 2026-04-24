import { useState } from 'react';

/**
 * @param {Object} props
 * @param {(createdPokemon: import('@/globals.d.js').CustomPokemon | null) => void} props.onFinishCreate
 */
export default function CreatePokemonEntry({ onFinishCreate }) {
  const [form, setForm] = useState({
    name: '',
    desc: '',
    weight: 0,
    height: 0,
    baseExperience: 0,
    abilities: [''],
    stats: [
      { name: 'hp', value: 67 },
      { name: 'attack', value: 76 },
      { name: 'defense', value: 420 },
      { name: 'special-attack', value: 24 },
      { name: 'special-defense', value: 14 },
      { name: 'speed', value: 41 },
    ],
    imageUrl: '',
    imageFile: /** @type {File | null} */ (null),
  });

  /**
   * @template {keyof typeof form} T
   * @param {T} field
   * @param {(typeof form)[T]} value
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
   * @param {number} idx
   * @param {string} val
   */
  function updateStat(idx, val) {
    setForm((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, i) =>
        i === idx ? { ...stat, value: Number(val) } : stat,
      ),
    }));
  }

  /**
   * @param {import('react').ChangeEvent<HTMLInputElement>} ev
   */
  function handleImageFileChange(ev) {
    const file = ev.target.files?.[0] ?? null;
    setForm((prev) => ({
      ...prev,
      imageFile: file,
      imageUrl: file ? '' : prev.imageUrl,
    }));
  }

  /**
   * @param {import('react').SubmitEvent<HTMLFormElement>} ev
   */
  async function handleSubmit(ev) {
    ev.preventDefault();

    const abilities = form.abilities
      .map((ability) => ability.trim())
      .filter(Boolean);

    const stats = form.stats
      .map((stat) => ({
        name: stat.name.trim(),
        value: Number(stat.value),
      }))
      .filter((stat) => stat.name !== '' && !Number.isNaN(stat.value));

    const formData = new FormData();
    formData.append('name', form.name.trim());
    formData.append('desc', form.desc.trim());
    formData.append('weight', String(Number(form.weight)));
    formData.append('height', String(Number(form.height)));
    formData.append('baseExperience', String(Number(form.baseExperience)));
    formData.append('abilities', JSON.stringify(abilities));
    formData.append('stats', JSON.stringify(stats));

    if (form.imageFile) {
      formData.append('image', form.imageFile);
    } else if (form.imageUrl.trim() !== '') {
      formData.append('image', form.imageUrl.trim());
    }

    const res = await fetch('http://localhost:9443/pokemon', {
      method: 'POST',
      body: formData,
    });

    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      if (typeof data.error === 'string') {
        // TODO: Show to user what should be done to fix (Use modal or something)
      }

      throw new Error(data.error || 'Failed to create Pokemon');
    }

    onFinishCreate(data);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold inline-block px-2 py-1">
          Create Pokémon
        </h1>
      </div>

      <div className="flex gap-6">
        <div className="w-40 shrink-0">
          <div className="flex h-40 w-40 items-center justify-center rounded-lg border p-2">
            {form.imageFile ? (
              <img
                src={URL.createObjectURL(form.imageFile)}
                alt="Preview"
                className="h-full w-full object-contain"
              />
            ) : form.imageUrl.trim() ? (
              <img
                src={form.imageUrl}
                alt="Preview"
                className="h-full w-full object-contain"
              />
            ) : (
              <span className="text-sm text-gray-500">No image selected</span>
            )}
          </div>
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

          <div>
            <label className="block text-sm font-medium">Image URL</label>
            <input
              type="url"
              value={form.imageUrl}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  imageUrl: e.target.value,
                  imageFile: e.target.value.trim() ? null : prev.imageFile,
                }))
              }
              className="mt-1 w-full rounded-md border px-3 py-2"
              placeholder="https://..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageFileChange}
              className="mt-1 w-full rounded-md border px-3 py-2"
            />
          </div>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Stats</h2>
        </div>

        <div className="space-y-3">
          {form.stats.map((stat, index) => (
            <div key={stat.name} className="grid grid-cols-[1fr_140px] gap-3">
              <div className="rounded-md px-3 py-2">{stat.name}</div>
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
          {form.abilities.map((ability, index) => (
            <div key={index} className="flex items-center gap-3">
              <input
                type="text"
                value={ability}
                onChange={(e) => updateAbility(index, e.target.value)}
                className="w-full rounded-md border px-3 py-2"
                placeholder="Ability name"
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
          Create Pokémon
        </button>
        <button
          type="button"
          onClick={() => onFinishCreate(null)}
          className="rounded-md border px-4 py-2 hover:bg-gray-50"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
