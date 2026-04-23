import { useState, useEffect } from 'react';
import PokemonListItem from './components/PokemonListItem.jsx';
import PokemonPanel from './widgets/PokemonPanel/index.jsx';

export default function App() {
  const [pokemonList, setPokemonList] = useState([]);
  const [pokemon, setPokemon] = useState(null);
  const [isPanelOpen, setPanelOpen] = useState(false);
  const [panelMode, setPanelMode] = useState('view');

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
  }, [panelMode]);

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
          {pokemonList && pokemonList.length > 0 ? (
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
              ></PokemonListItem>
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
        onFinishEdit={() => setPanelMode('view')}
        onFinishCreate={() => setPanelMode('view')}
      />
    </div>
  );
}
