import { useEffect, useMemo, useState } from 'react';
import Button from './components/Button.jsx';
import Card from './components/Card.jsx';
import InputField from './components/InputField.jsx';
import InvertedButton from './components/InvertedButton.jsx';
import LabeledField from './components/LabeledField.jsx';
import LabeledInputField from './components/LabeledInputField.jsx';

/**
 * @param {Object} props
 * @param {(createdPokemon: import('@/globals.d.js').CustomPokemon | null) => void} props.onFinishCreate
 */
export default function CreatePokemonEntry({ onFinishCreate }) {
  const [errorMessage, setErrorMessage] = useState('');
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
      setErrorMessage(data.error || 'Something went wrong (Try again later)');
      return;
    }

    onFinishCreate(data);
  }

  const imageFilePreview = useMemo(() => {
    if (!form.imageFile) return '';

    return URL.createObjectURL(form.imageFile);
  }, [form.imageFile]);

  useEffect(() => {
    return () => {
      if (imageFilePreview) {
        URL.revokeObjectURL(imageFilePreview);
      }
    };
  }, [imageFilePreview]);

  const previewImage = imageFilePreview || form.imageUrl.trim();

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Card>
        <div className="flex gap-5 flex-row items-start">
          <div className="space-y-4 w-1/3">
            <div className="flex shrink-0 items-center justify-center rounded-4xl border border-slate-200 bg-slate-50 p-4 aspect-square">
              {previewImage ? (
                <img
                  src={previewImage}
                  className="h-full w-full object-contain"
                />
              ) : (
                <div className="flex items-center justify-center text-center text-sm text-slate-400">
                  Add an image URL or upload an image to preview it here.
                </div>
              )}
            </div>

            <LabeledField fieldName="Image URL">
              <input
                type="url"
                value={form.imageUrl}
                onChange={(ev) =>
                  setForm((prev) => ({
                    ...prev,
                    imageUrl: ev.target.value,
                    imageFile: ev.target.value.trim() ? null : prev.imageFile,
                  }))
                }
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
                placeholder="https://..."
              />
            </LabeledField>

            <LabeledField fieldName="Upload Image">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageFileChange}
                className="block w-full rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600 file:mr-4 file:rounded-xl file:border-0 file:bg-rose-600 file:px-4 file:py-2 file:font-semibold file:text-white hover:border-rose-200"
              />
            </LabeledField>
          </div>

          <div className="flex-1 space-y-4">
            <LabeledInputField
              fieldName="Name"
              fieldType="text"
              fieldValue={form.name}
              onChange={(ev) => updateField('name', ev.target.value)}
            />

            <div className="grid gap-4 grid-cols-3">
              <LabeledInputField
                fieldName="Weight"
                fieldType="number"
                fieldValue={form.weight}
                onChange={(ev) =>
                  updateField('weight', Number(ev.target.value))
                }
              />
              <LabeledInputField
                fieldName="Height"
                fieldType="number"
                fieldValue={form.height}
                onChange={(ev) =>
                  updateField('height', Number(ev.target.value))
                }
              />
              <LabeledInputField
                fieldName="Base Exp"
                fieldType="number"
                fieldValue={form.baseExperience}
                onChange={(ev) =>
                  updateField('baseExperience', Number(ev.target.value))
                }
              />
            </div>

            <LabeledField fieldName="Description">
              <textarea
                value={form.desc}
                onChange={(ev) => updateField('desc', ev.target.value)}
                rows={4}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
              />
            </LabeledField>
          </div>
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold tracking-tight">Stats</h2>
        </div>

        <div className="space-y-3">
          {form.stats.map((stat, index) => (
            <div
              key={stat.name}
              className="grid grid-cols-[1fr_0.25fr] items-center gap-3"
            >
              <div className="px-4 py-3 text-sm font-medium uppercase">
                {stat.name}
              </div>
              <InputField
                fieldType="number"
                fieldValue={stat.value}
                onChange={(ev) => updateStat(index, ev.target.value)}
              />
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="mb-4 flex items-center justify-between gap-3">
          <h2 className="text-lg font-bold tracking-tight">Abilities</h2>
          <InvertedButton
            buttonName="Add Ability"
            onClick={addAbility}
            variant="md"
          />
        </div>

        <div className="space-y-3">
          {form.abilities.map((ability, index) => (
            <div key={index} className="flex items-center gap-3">
              <InputField
                fieldType="text"
                fieldValue={ability}
                onChange={(ev) => updateAbility(index, ev.target.value)}
                placeholder="ability name"
              />
              <InvertedButton
                buttonName="Remove"
                onClick={() => removeAbility(index)}
                variant="md"
              />
            </div>
          ))}
        </div>
      </Card>

      <div className="space-y-3">
        {errorMessage && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {errorMessage}
          </div>
        )}
        <div className="flex flex-wrap gap-3">
          <Button buttonName="Create Pokémon" type="submit" />
          <InvertedButton
            buttonName="Cancel"
            onClick={() => onFinishCreate(null)}
          />
        </div>
      </div>
    </form>
  );
}
