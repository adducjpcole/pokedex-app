import { useState } from 'react';
import Button from './components/Button.jsx';
import Card from './components/Card.jsx';
import InputField from './components/InputField.jsx';
import InvertedButton from './components/InvertedButton.jsx';
import LabeledField from './components/LabeledField.jsx';
import LabeledInputField from './components/LabeledInputField.jsx';

/**
 * @param {Object} props
 * @param {import('@/globals.d.js').Pokemon} props.pokemon
 * @param {(customPokemon: import('@/globals.d.js').CustomPokemon|null) => void} props.onFinishEdit
 */
export default function EditPokemonEntry({ pokemon, onFinishEdit }) {
  const [errorMessage, setErrorMessage] = useState('');
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
    if (!res.ok) {
      setErrorMessage(data.error || 'Something went wrong (Try again later)');
      return;
    }

    onFinishEdit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5 pb-8">
      <Card>
        <div className="flex gap-5 flex-row items-start">
          <div className="flex shrink-0 items-center justify-center rounded-4xl border border-slate-200 bg-slate-50 p-4 w-1/3 aspect-square">
            {pokemon.image ? (
              <img
                src={pokemon.image}
                className="h-full w-full object-contain"
              />
            ) : (
              <div className="flex items-center justify-center text-center text-sm text-slate-400 uppercase">
                No Image Available
              </div>
            )}
          </div>

          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500">
                #{String(form.id).padStart(3, '0')}
              </p>
              <h1 className="font-black tracking-tight text-slate-900 text-4xl capitalize">
                {form.name}
              </h1>
            </div>

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
          <Button buttonName="Save Changes" type="submit" />
          <InvertedButton
            buttonName="Cancel"
            onClick={() => onFinishEdit(null)}
          />
        </div>
      </div>
    </form>
  );
}
