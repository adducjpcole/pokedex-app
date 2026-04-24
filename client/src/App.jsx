import { useEffect, useState } from 'react';
import PokemonListItem from './components/PokemonListItem.jsx';
import PokemonPanel from './widgets/PokemonPanel/index.jsx';
import { Loader } from 'lucide-react';

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

  const selectedPokemonId = pokemon?.id ?? null;

  /**
   * @param {import('./globals.d.js').Pokemon} pokemon
   */
  function openPokemonPanel(pokemon) {
    if (panelMode === 'view' && selectedPokemonId === pokemon.id) {
      setPanelOpen((prev) => !prev);
      if (!isPanelOpen) setPanelMode('view');
      return;
    }

    const openWithPokemon = () => {
      setPokemon(pokemon);
      setPanelMode('view');
      setPanelOpen(true);
    };

    if (isPanelOpen) {
      setPanelOpen(false);
      setTimeout(openWithPokemon, 150);
    } else {
      openWithPokemon();
    }
  }

  return (
    <div className="flex flex-col justify-center min-h-screen text-slate-900 bg-slate-50">
      <main className="flex flex-col mx-auto rounded-4xl border border-slate-200 bg-white/85 p-5 shadow-black/50 shadow-xl min-h-[calc(100vh-3rem)] w-full max-w-3/4 space-y-6">
        <header className="flex gap-4 flex-row items-center justify-between">
          <div>
            <h1 className="font-black tracking-tight text-4xl">Pokédex App</h1>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-rose-500">
              Pokémon + Index
            </p>
          </div>

          <div className="flex gap-3 flex-row items-center">
            <button
              className="inline-flex items-center justify-center rounded-2xl border border-rose-200 bg-rose-500 px-5 py-3 font-semibold text-white shadow-lg shadow-rose-200/50 transition hover:-translate-y-px hover:shadow-xl hover:shadow-rose-200/60 active:translate-y-0"
              onClick={() => {
                if (isPanelOpen) {
                  setPanelOpen(false);
                  setTimeout(() => {
                    setPanelMode('create');
                    setPanelOpen(true);
                  }, 150);
                  return;
                }

                setPanelMode('create');
                setPanelOpen(true);
              }}
            >
              Create Entry
            </button>
          </div>
        </header>

        {pokemonList.length > 0 ? (
          <main className="flex-1 grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-4">
            {pokemonList.map((entry) => (
              <PokemonListItem
                key={entry.id}
                id={entry.id}
                isSelected={
                  selectedPokemonId === entry.id && panelMode !== 'create'
                }
                onClick={() => openPokemonPanel(entry)}
                name={entry.name}
                image={entry.image}
              />
            ))}
          </main>
        ) : (
          <main className="flex-1 flex justify-center items-center px-6 py-8">
            <Loader className="animate-spin size-16" />
          </main>
        )}
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
          if (updatedPokemon !== null) {
            setPokemonList((prev) => {
              const index = prev.findIndex((p) => p.id === updatedPokemon.id);
              if (index === -1) return prev;

              const next = [...prev];
              next[index] = updatedPokemon;
              return next;
            });
            setPokemon(updatedPokemon);
          }

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
