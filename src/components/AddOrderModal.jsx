import { useState } from "react";

export default function AddOrderModal({ onClose, onSubmit }) {
  const [form, setForm] = useState({ customer: "", product: "", amount: "", status: "pending" });

  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));
  const handleSubmit = () => {
    if (!form.customer || !form.product || !form.amount) return;
    onSubmit({ ...form, amount: Number(form.amount) });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
        <h2 className="text-lg font-bold text-white mb-5">➕ Add New Order to Elasticsearch</h2>
        <div className="space-y-4">
          {[
            { name: "customer", label: "Customer Name",  placeholder: "e.g. John Doe" },
            { name: "product",  label: "Product",        placeholder: "e.g. MacBook Air" },
            { name: "amount",   label: "Amount (USD)",   placeholder: "e.g. 1299", type: "number" },
          ].map(f => (
            <div key={f.name}>
              <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">{f.label}</label>
              <input
                type={f.type || "text"}
                name={f.name}
                value={form[f.name]}
                onChange={handleChange}
                placeholder={f.placeholder}
                className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-600"
              />
            </div>
          ))}
          <div>
            <label className="block text-xs text-slate-400 mb-1.5 uppercase tracking-wider">Status</label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="pending">Pending</option>
              <option value="shipped">Shipped</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={handleSubmit}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold py-2.5 rounded-lg transition-colors">
            Index to Elasticsearch
          </button>
          <button onClick={onClose}
            className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-medium py-2.5 rounded-lg border border-slate-700 transition-colors">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}