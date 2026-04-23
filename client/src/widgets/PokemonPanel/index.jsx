import EditPokemonEntry from './EditPokemonEntry.jsx';
import ViewPokemonEntry from './ViewPokemonEntry.jsx';

/**
 * @typedef {'view'|'edit'|'create'} PokemonPanelMode
 */

/**
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {CustomPokemon} props.pokemon
 * @param {PokemonPanelMode} props.mode
 * @param {() => void} props.onClose
 * @param {(Pokemon) => void} props.onDelete
 * @param {(Pokemon) => void} props.onStartEdit
 * @param {(CustomPokemon) => void} props.onFinishEdit
 * @param {(CustomPokemon) => void} props.onFinishCreate
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
  // TODO: Handle edit of Pokemon BUT don't modify the original (let parent
  // handle the actual update), just pass on what is being edited via finish edit

  // TODO: Handle creation of Custom Pokemon (cannot add cries) BUT don't modify
  // the original list (let parent handle the actual creation), just pass on what is to be added via finish create
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
      {pokemon && mode === 'edit' && <EditPokemonEntry pokemon={pokemon} />}
      {mode === 'create' && <p>creating new pokemon</p>}

      <div>
        {mode === 'create' && (
          <button className="hover:cursor-pointer" onClick={onFinishCreate}>
            Create Entry
          </button>
        )}
      </div>
    </aside>
  );
}
