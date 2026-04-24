import InvertedButton from '@/widgets/PokemonPanel/components/InvertedButton.jsx';
import CreatePokemonEntry from './CreatePokemonEntry.jsx';
import EditPokemonEntry from './EditPokemonEntry.jsx';
import ViewPokemonEntry from './ViewPokemonEntry.jsx';

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {import('@/globals.d.js').Pokemon|null} props.pokemon
 * @param {import('@/globals.d.js').PokemonPanelMode} props.mode
 * @param {() => void} props.onClose
 * @param {(deletedPokemon: import('@/globals.d.js').Pokemon) => void} props.onDelete
 * @param {(pendingPokemon: import('@/globals.d.js').Pokemon) => void} props.onStartEdit
 * @param {(updatedPokemon: import('@/globals.d.js').CustomPokemon | null) => void} props.onFinishEdit
 * @param {(createdPokemon: import('@/globals.d.js').CustomPokemon | null) => void} props.onFinishCreate
 * @returns
 */
export default function PokemonPanel({
  isOpen,
  pokemon,
  mode,
  onClose,
  onDelete,
  onStartEdit,
  onFinishEdit,
  onFinishCreate,
}) {
  return (
    <div
      className={`fixed inset-0 z-20 transition ${isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
    >
      <button
        type="button"
        onClick={onClose}
        className={`absolute inset-0 bg-slate-950/35 backdrop-blur-xs transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0'}`}
      />

      <aside
        className={`absolute right-0 top-0 flex h-full w-full md:w-3/4 xl:w-1/2 flex-col border-l border-slate-200 slate-50 shadow-2xl shadow-black/50 transition-transform duration-200 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <header className="flex items-center justify-between border-b border-slate-200 bg-white/90 px-5 py-4 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase text-slate-400">
              {mode !== 'create'
                ? mode === 'view'
                  ? 'Viewing'
                  : 'Editing'
                : 'Creating'}
            </p>
            <h2 className="text-base font-semibold text-slate-900 capitalize">
              {pokemon && mode !== 'create' ? pokemon.name : 'Pokémon'}
            </h2>
          </div>

          <InvertedButton buttonName="Close" onClick={onClose} variant="md" />
        </header>

        <section className="flex-1 overflow-y-auto p-5">
          <div className="mx-auto max-w-3xl">
            {pokemon && mode === 'view' && (
              <ViewPokemonEntry
                pokemon={pokemon}
                onDelete={onDelete}
                onStartEdit={onStartEdit}
              />
            )}
            {pokemon && mode === 'edit' && (
              <EditPokemonEntry pokemon={pokemon} onFinishEdit={onFinishEdit} />
            )}
            {mode === 'create' && (
              <CreatePokemonEntry onFinishCreate={onFinishCreate} />
            )}
          </div>
        </section>
      </aside>
    </div>
  );
}
