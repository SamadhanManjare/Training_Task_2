export default function TopProducts({ data }) {
  if (!data.length) return (
    <div className="text-slate-600 text-sm text-center py-10">No data yet</div>
  );

  const max = Math.max(...data.map(d => d.revenue?.value || d.doc_count));

  return (
    <div className="space-y-4">
      {data.map((p, i) => {
        const val = p.revenue?.value || p.doc_count;
        const pct = max > 0 ? (val / max) * 100 : 0;
        return (
          <div key={i}>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-slate-300 truncate max-w-full">{p.key}</span>
              <span className="text-slate-500">${val.toLocaleString()}</span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-1.5">
              <div
                className="h-1.5 rounded-full bg-linear-to-r from-indigo-600 to-violet-500 transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}