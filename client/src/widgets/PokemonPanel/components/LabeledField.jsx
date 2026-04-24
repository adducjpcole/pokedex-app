/**
 * @param {import('react').PropsWithChildren<{
 *   fieldName: string,
 * }>} props
 * @returns
 */
export default function LabeledField({ fieldName, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">
        {fieldName}
      </span>
      {children}
    </label>
  );
}
