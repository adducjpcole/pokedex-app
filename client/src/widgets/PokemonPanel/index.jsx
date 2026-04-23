import ViewPokemonDetails from './ViewPokemonDetails.jsx';

/**
 * @typedef {'view'|'edit'|'create'} PokemonPanelMode
 */

/**
 * @param {Object} param
 * @param {boolean} param.isOpen
 * @param {CustomPokemon} param.pokemon
 * @param {PokemonPanelMode} param.mode
 * @param {() => void} param.onClose
 * @param {(Pokemon) => void} param.onStartEdit
 * @param {(Pokemon) => void} param.onFinishEdit
 * @param {(Pokemon) => void} param.onDelete
 * @param {(CustomPokemon) => void} param.onFinishCreate
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
      className={`fixed right-0 top-0 w-1/4 z-10 bg-white p-4 ${isOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform`}
    >
      <button
        className="hover:cursor-pointer"
        onClick={() => {
          // TODO: If in edit/create mode, prompt user if they are sure before closing (don't auto save)

          onClose();
        }}
      >
        {mode == 'view' ? 'Close' : 'Cancel'}
      </button>

      {pokemon && mode === 'view' && <ViewPokemonDetails pokemon={pokemon} />}
      {pokemon && mode === 'edit' && <p>editing {pokemon.name}</p>}
      {mode === 'create' && <p>creating new pokemon</p>}

      <div>
        {mode === 'view' && (
          <>
            <button className="hover:cursor-pointer" onClick={onStartEdit}>
              Edit
            </button>
            <button className="hover:cursor-pointer" onClick={onDelete}>
              Delete
            </button>
          </>
        )}
        {mode === 'edit' && (
          <button className="hover:cursor-pointer" onClick={onFinishEdit}>
            Save Edit
          </button>
        )}
        {mode === 'create' && (
          <button className="hover:cursor-pointer" onClick={onFinishCreate}>
            Create Entry
          </button>
        )}
      </div>
    </aside>
  );
}
