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
 * @param {(updatedPokemon: import('@/globals.d.js').CustomPokemon) => void} props.onFinishEdit
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
    <aside
      className={`fixed right-0 top-0 w-fit z-10 bg-white shadow-2xl p-4 ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform max-h-screen overflow-y-auto`}
    >
      <button
        className="hover:cursor-pointer"
        onClick={() => {
          onClose();
        }}
      >
        Close
      </button>

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
    </aside>
  );
}
