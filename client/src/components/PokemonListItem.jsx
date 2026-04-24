import properCase from '../utils/properCase';

/**
 * @param {Object} props
 * @param {React.MouseEventHandler<HTMLButtonElement>} props.onClick
 * @param {string} props.name
 * @param {string|null} props.image
 * @returns
 */
export default function PokemonListItem({ onClick, name, image }) {
  return (
    <button
      className="flex flex-col items-center hover:cursor-pointer hover:scale-105 transition-transform active:scale-95"
      onClick={onClick}
    >
      <h1>{properCase(name)}</h1>
      {image && <img src={image} alt={name} />}
    </button>
  );
}
