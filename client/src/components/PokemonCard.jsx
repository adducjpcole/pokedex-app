import React from 'react';
import properCase from '../utils/properCase';

/**
 * @param {string} id
 * @param {React.MouseEventHandler<HTMLButtonElement>} onClick
 */
export default function PokemonCard({ onClick, name, image }) {
  return (
    <button
      className="flex flex-col items-center hover:cursor-pointer"
      onClick={onClick}
    >
      <h1>{properCase(name)}</h1>
      <img src={image} alt={name} />
    </button>
  );
}
