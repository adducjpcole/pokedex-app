import { useState, useEffect } from 'react';
import PokemonCard from './components/PokemonCard';
import properCase from './utils/properCase';

export default function App() {
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [isAsideOpen, setAsideOpen] = useState(false);
  const [pokemonList, setPokemonList] = useState([]);
  const [isEditing, setEditing] = useState(false);
  const [isDeleting, setDeleting] = useState(false);

  useEffect(() => {
    async function fetchPokemon() {
      try {
        const res = await fetch(`http://localhost:9443/pokemon`);
        const data = await res.json();
        setPokemonList(data);
        console.log(data);
      } catch (err) {
        console.error(err);
      }
    }

    fetchPokemon();
  }, [isEditing]);

  return (
    <div className='px-8 py-4'>
      <header className='flex flex-row'>
        <h1>Pokedex</h1>
        <button
          className="hover:cursor-pointer"
          onClick={() => setDeleting(true)}
        >
          Create Entry
        </button>
      </header>

      <main>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-x-8 gap-y-4">
          {pokemonList && pokemonList.length > 0 ? (
            pokemonList.map((v) => (
              <PokemonCard
                key={v.id}
                onClick={() => {
                  if (selectedPokemon && selectedPokemon.id === v.id) {
                    setAsideOpen((v) => !v);
                    return;
                  }

                  if (isAsideOpen) {
                    setAsideOpen(false);

                    setTimeout(() => {
                      setAsideOpen(true);
                      setSelectedPokemon(v);
                    }, 150);
                    return;
                  }

                  setAsideOpen(true);
                  setSelectedPokemon(v);
                }}
                name={v.name}
                image={v.image}
              ></PokemonCard>
            ))
          ) : (
            <p>Loading...</p>
          )}
        </div>
      </main>

      <aside
        className={`fixed right-0 top-0 w-1/4 z-10 bg-white p-4 ${isAsideOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform`}
      >
        <button
          className="hover:cursor-pointer"
          onClick={() => {
            setAsideOpen(false);
          }}
        >
          Close
        </button>

        {selectedPokemon && (
          <>
            <h1>{properCase(selectedPokemon.name)}</h1>
            <img src={selectedPokemon.image} />
            <p>{selectedPokemon.desc}</p>
            <p>weight: {selectedPokemon.weight}</p>
            <p>height: {selectedPokemon.height}</p>
            <p>base experience: {selectedPokemon.baseExperience}</p>
            <div>
              stats
              <ul>
                {selectedPokemon.stats.map((v) => (
                  <li key={v.name}>
                    {v.name}: {v.value}
                  </li>
                ))}
              </ul>
            </div>

            <div>
              abilities
              <ul>
                {selectedPokemon.abilities.map((v, i) => (
                  <li key={i}>{v}</li>
                ))}
              </ul>
            </div>

            <div>
              cries
              <audio controls>
                <source src={selectedPokemon.cries} type="audio/mpeg" />
                Your browser does not support the audio tag.
              </audio>
            </div>
          </>
        )}

        <div>
          <button
            className="hover:cursor-pointer"
            onClick={() => setEditing(true)}
          >
            Edit
          </button>
          <button
            className="hover:cursor-pointer"
            onClick={() => setDeleting(true)}
          >
            Delete
          </button>
        </div>
      </aside>
    </div>
  );
}
