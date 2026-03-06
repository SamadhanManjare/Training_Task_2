


// ─────────────────────────────────────────────────────────────
// src/components/StatusBadge.jsx
// ─────────────────────────────────────────────────────────────
const badgeMap = {
  completed: "bg-emerald-900/60 text-emerald-400 border border-emerald-700",
  pending:   "bg-amber-900/60 text-amber-400 border border-amber-700",
  shipped:   "bg-blue-900/60 text-blue-400 border border-blue-700",
};

export default function StatusBadge({ status }) {
  return (
    <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${badgeMap[status] || "bg-slate-700 text-slate-300"}`}>
      {status}
    </span>
  );
}