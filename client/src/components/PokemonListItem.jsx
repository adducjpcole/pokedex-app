/**
 * @param {Object} props
 * @param {React.MouseEventHandler<HTMLButtonElement>} props.onClick
 * @param {string} props.name
 * @param {string|null} props.image
 * @param {number} props.id
 * @param {boolean} props.isSelected
 * @returns
 */
export default function PokemonListItem({
  onClick,
  name,
  image,
  id,
  isSelected,
}) {
  return (
    <button
      className={`group flex h-full flex-col overflow-hidden rounded-3xl border bg-white text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95 ${isSelected ? 'border-rose-300 ring-4 ring-rose-100' : 'border-slate-200 hover:border-rose-200'}`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50 px-4 py-3">
        <span className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400">
          #{String(id).padStart(3, '0')}
        </span>
      </div>

      <div className="flex flex-1 flex-col items-center justify-between gap-4 p-4">
        <div className="flex h-28 w-full items-center justify-center rounded-3xl bg-slate-50 p-3">
          {image ? (
            <img
              src={image}
              className="h-full w-full object-contain transition duration-200 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-slate-200 text-xs uppercase tracking-[0.3em] text-slate-400">
              No Image
            </div>
          )}
        </div>

        <div className="w-full text-center">
          <h3 className="text-base font-bold tracking-tight text-slate-900 capitalize">
            {name}
          </h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-[0.25em] text-slate-400">
            Pokémon Entry
          </p>
        </div>
      </div>
    </button>
  );
}
