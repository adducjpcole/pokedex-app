/**
 * @param {import("react").PropsWithChildren} props
 * @returns
 */
export default function Card({ children }) {
  return (
    <div className="rounded-4xl border border-slate-200 bg-white p-5 shadow-sm">
      {children}
    </div>
  );
}
