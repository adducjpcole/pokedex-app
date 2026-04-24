/**
 * @param {Object} props
 * @param {import('react').HTMLInputTypeAttribute} props.fieldType
 * @param {string|number|readonly string[]|undefined} [props.fieldValue]
 * @param {import('react').ChangeEventHandler<HTMLInputElement, HTMLInputElement>} props.onChange
 * @param {string} [props.placeholder]
 */
export default function InputField({
  fieldType,
  fieldValue,
  onChange,
  placeholder,
}) {
  return (
    <input
      type={fieldType}
      value={fieldValue}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-rose-300 focus:ring-4 focus:ring-rose-100"
    />
  );
}
