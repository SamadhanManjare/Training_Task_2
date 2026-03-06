import { useEffect, useState } from "react";

const colorMap = {
  indigo: "border-indigo-500 text-indigo-400",
  emerald: "border-emerald-500 text-emerald-400",
  amber: "border-amber-500 text-amber-400",
  rose: "border-rose-500 text-rose-400",
};

export default function StatCard({ label, value, icon, color, prefix = "" }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!value) return;
    let cur = 0;
    const step = Math.ceil(value / 60);
    const t = setInterval(() => {
      cur += step;
      if (cur >= value) { setCount(value); clearInterval(t); }
      else setCount(cur);
    }, 16);
    return () => clearInterval(t);
  }, [value]);

  return (
    <div className={`bg-slate-900 border border-slate-800 border-l-4 ${colorMap[color]} rounded-2xl p-5`}>
      <div className="text-2xl mb-2">{icon}</div>
      <p className="text-xs text-slate-500 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-bold text-white">
        {value == null ? "—" : `${prefix}${count.toLocaleString()}`}
      </p>
    </div>
  );
}