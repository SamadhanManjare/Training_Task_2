const MONTH_ORDER = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

export default function BarChart({ data }) {
  if (!data.length) return (
    <div className="h-40 flex items-center justify-center text-slate-600 text-sm">No data yet</div>
  );

  const sorted = [...data].sort((a, b) => MONTH_ORDER.indexOf(a.key) - MONTH_ORDER.indexOf(b.key));
  const max = Math.max(...sorted.map(d => d.doc_count));

  return (
    <div className="flex items-end gap-3 h-40">
      {sorted.map((d, i) => {
        const pct = max > 0 ? (d.doc_count / max) * 100 : 0;
        return (
          <div key={i} className="flex-1 flex flex-col items-center gap-1">
            <span className="text-xs text-slate-500">{d.doc_count}</span>
            <div className="w-full rounded-t-md bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all duration-700"
              style={{ height: `${pct}%`, minHeight: "4px" }} />
            <span className="text-xs text-slate-500">{d.key}</span>
          </div>
        );
      })}
    </div>
  );
}