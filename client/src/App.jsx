import { useState, useEffect } from 'react';
import PokemonListItem from './components/PokemonListItem.jsx';
import PokemonPanel from './widgets/PokemonPanel/index.jsx';

export default function App() {
  const [pokemonList, setPokemonList] = useState(
    /** @type {import('./globals.d.js').Pokemon[]} */ ([]),
  );
  const [pokemon, setPokemon] = useState(
    /** @type {import('./globals.d.js').Pokemon | null} */ (null),
  );
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState(
    /** @type {import('./globals.d.js').PokemonPanelMode} */ ('view'),
  );

  useEffect(() => {
    async function fetchPokemon() {
      try {
        const res = await fetch(`http://localhost:9443/pokemon`);
        const data = await res.json();
        setPokemonList(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchPokemon();
  }, []);

  return (
    <div className="px-8 py-4">
      <header className="flex flex-row">
        <h1>POKéDEX</h1>
        <button
          className="hover:cursor-pointer"
          onClick={() => {
            if (isPanelOpen) {
              setPanelOpen(false);
              setTimeout(() => {
                setPanelMode('create');
                setPanelOpen(true);
              }, 150);
            } else {
              setPanelMode('create');
              setPanelOpen(true);
            }
          }}
        >
          Create Entry
        </button>
      </header>

      <main>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-x-8 gap-y-4">
          {pokemonList ? (
            pokemonList.map((v) => (
              <PokemonListItem
                key={v.id}
                onClick={() => {
                  if (panelMode === 'view' && pokemon?.id === v.id) {
                    setPanelOpen((prev) => !prev);
                    if (!isPanelOpen) setPanelMode('view');
                    return;
                  }

                  const openWithPokemon = () => {
                    setPokemon(v);
                    setPanelMode('view');
                    setPanelOpen(true);
                  };

                  if (isPanelOpen) {
                    setPanelOpen(false);
                    setTimeout(openWithPokemon, 150);
                  } else {
                    openWithPokemon();
                  }
                }}
                name={v.name}
                image={v.image}
              />
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </main>

      <PokemonPanel
        isOpen={isPanelOpen}
        pokemon={pokemon}
        mode={panelMode}
        onClose={() => setPanelOpen(false)}
        onDelete={(deletedPokemon) => {
          setPanelOpen(false);
          setPokemonList((prev) =>
            prev.filter((p) => p.id !== deletedPokemon.id),
          );

          setTimeout(() => {
            setPokemon(null);
          }, 150);
        }}
        onStartEdit={() => {
          if (isPanelOpen) {
            setPanelOpen(false);
            setTimeout(() => {
              setPanelMode('edit');
              setPanelOpen(true);
            }, 150);
          } else {
            setPanelMode('edit');
            setPanelOpen(true);
          }
        }}
        onFinishEdit={(updatedPokemon) => {
          setPokemonList((prev) => {
            const index = prev.findIndex((p) => p.id === updatedPokemon.id);
            if (index === -1) return prev;

            const next = [...prev];
            next[index] = updatedPokemon;
            return next;
          });
          setPokemon(updatedPokemon);

          setPanelOpen(false);
          setPanelMode('view');
        }}
        onFinishCreate={(createdPokemon) => {
          if (createdPokemon !== null)
            setPokemonList((prev) => [...prev, createdPokemon]);

          setPanelOpen(false);
          setPanelMode('view');
        }}
      />
    </div>
  );
}
