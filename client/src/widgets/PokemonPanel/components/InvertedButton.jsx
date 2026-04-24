/**
 * @param {Object} props
 * @param {string} props.buttonName
 * @param {"button" | "reset" | "submit"} [props.type]
 * @param {import("react").MouseEventHandler<HTMLButtonElement>} [props.onClick]
 * @param {'md'|'lg'} [props.variant]
 * @returns
 */
export default function InvertedButton({ buttonName, type, onClick, variant }) {
  let classNameVariant = 'px-5 py-3 font-semibold shadow-lg';
  if (variant === 'md')
    classNameVariant = 'px-4 py-2 text-sm font-medium shadow-sm';

  return (
    <button
      type={type || 'button'}
      onClick={onClick}
      className={`rounded-2xl border border-slate-200 bg-white text-slate-700 transition hover:border-rose-200 hover:text-rose-600 ${classNameVariant}`}
    >
      {buttonName}
    </button>
  );
}
