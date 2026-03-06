import StatusBadge from "./statusBadge";

export default function OrdersTable({ orders, loading, onDelete }) {
  if (loading) return (
    <div className="flex items-center justify-center py-20 text-slate-500 text-sm gap-2">
      <span className="animate-spin">⏳</span> Fetching from Elasticsearch…
    </div>
  );

  if (!orders.length) return (
    <div className="py-16 text-center text-slate-600 text-sm">
      No documents found in <code className="text-indigo-400">orders_index</code>
    </div>
  );

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-slate-800 text-xs text-slate-500 uppercase tracking-wider">
            {["Order ID", "Customer", "Product", "Amount", "Date", "Status", "Actions"].map(h => (
              <th key={h} className="text-left px-5 py-3 font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id} className="border-b border-slate-800/50 hover:bg-slate-800/40 transition-colors">
              <td className="px-5 py-3.5 text-indigo-400 font-mono font-semibold text-xs">{o.id?.slice(0,8)}…</td>
              <td className="px-5 py-3.5 text-slate-200">{o.customer}</td>
              <td className="px-5 py-3.5 text-slate-300">{o.product}</td>
              <td className="px-5 py-3.5 text-emerald-400 font-semibold">${o.amount?.toLocaleString()}</td>
              <td className="px-5 py-3.5 text-slate-500">{o.date?.split("T")[0]}</td>
              <td className="px-5 py-3.5"><StatusBadge status={o.status} /></td>
              <td className="px-5 py-3.5">
                <button
                  onClick={() => onDelete(o.id)}
                  className="text-xs text-rose-500 hover:text-rose-400 border border-rose-900 hover:border-rose-700 px-2 py-1 rounded-md transition-colors"
                >Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}