import { useEffect, useState } from "react";
import axios from "axios";
import StatCard from "./components/statCard";
import OrdersTable from "./components/OrderTable";
import BarChart from "./components/Barchart";
import TopProducts from "./components/TopProduct";
import StatusBadge from "./components/statusBadge";
import AddOrderModal from "./components/AddOrderModal";
import {
  createDemoOrder,
  filterDemoOrders,
  getDemoOrders,
  getDemoStats,
  initialDemoOrders,
} from "./demoData";

const API = import.meta.env.VITE_API_URL?.trim();
const HAS_REMOTE_API = Boolean(API);

export default function App() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const [demoOrders, setDemoOrders] = useState(initialDemoOrders);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [esStatus, setEsStatus] = useState(HAS_REMOTE_API ? "checking" : "demo");
  const [showModal, setShowModal] = useState(false);
  const [isDemoMode, setIsDemoMode] = useState(!HAS_REMOTE_API);

  useEffect(() => {
    let active = true;

    const load = async () => {
      if (!HAS_REMOTE_API) {
        if (!active) return;
        const localOrders = getDemoOrders();
        setDemoOrders(localOrders);
        setOrders(localOrders);
        setStats(getDemoStats(localOrders));
        setLoading(false);
        return;
      }

      try {
        const [healthRes, statsRes, ordersRes] = await Promise.all([
          axios.get(`${API}/health`),
          axios.get(`${API}/stats`),
          axios.get(`${API}/orders`),
        ]);

        if (!active) return;
        setEsStatus(healthRes.data?.status ? "connected" : "connected");
        setStats(statsRes.data);
        setOrders(ordersRes.data.orders ?? []);
        setIsDemoMode(false);
      } catch (error) {
        console.error("Falling back to demo data:", error);
        if (!active) return;
        const localOrders = getDemoOrders();
        setEsStatus("demo");
        setDemoOrders(localOrders);
        setStats(getDemoStats(localOrders));
        setOrders(localOrders);
        setIsDemoMode(true);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      active = false;
    };
  }, []);

  const fetchOrders = async (nextQuery = "") => {
    setLoading(true);

    if (isDemoMode) {
      setOrders(filterDemoOrders(nextQuery, demoOrders));
      setLoading(false);
      return;
    }

    try {
      const res = await axios.get(`${API}/orders`, {
        params: nextQuery ? { q: nextQuery } : {},
      });
      setOrders(res.data.orders ?? []);
    } catch (error) {
      console.error("Orders error:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshStats = async () => {
    if (isDemoMode) {
      setStats(getDemoStats(demoOrders));
      return;
    }

    try {
      const res = await axios.get(`${API}/stats`);
      setStats(res.data);
    } catch (error) {
      console.error("Stats error:", error);
    }
  };

  const handleDelete = async (id) => {
    if (isDemoMode) {
      const nextOrders = demoOrders.filter((order) => order.id !== id);
      setDemoOrders(nextOrders);
      setOrders(nextQueryAwareOrders(nextOrders, query));
      setStats(getDemoStats(nextOrders));
      return;
    }

    await axios.delete(`${API}/orders/${id}`);
    await fetchOrders(query);
    await refreshStats();
  };

  const handleAddOrder = async (data) => {
    if (isDemoMode) {
      const nextOrders = [createDemoOrder(data), ...demoOrders];
      setDemoOrders(nextOrders);
      setOrders(nextQueryAwareOrders(nextOrders, query));
      setStats(getDemoStats(nextOrders));
      setShowModal(false);
      return;
    }

    await axios.post(`${API}/orders`, data);
    await fetchOrders(query);
    await refreshStats();
    setShowModal(false);
  };

  const handleSearch = () => {
    fetchOrders(query);
  };

  const handleClear = () => {
    setQuery("");
    fetchOrders("");
  };

  return (
    <div className="min-h-screen w-full bg-slate-950 text-slate-100 font-sans">
      <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-800 bg-slate-900 px-8 py-4">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold text-white">
            <span className="text-indigo-400">Elastic</span>Dashboard
          </h1>
        </div>
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-medium ${
              esStatus === "connected"
                ? "border border-emerald-800 bg-emerald-950 text-emerald-400"
                : esStatus === "demo"
                  ? "border border-amber-800 bg-amber-950 text-amber-300"
                  : "border border-red-800 bg-red-950 text-red-400"
            }`}
          >
            <span
              className={`h-2 w-2 rounded-full ${
                esStatus === "connected"
                  ? "bg-emerald-400 animate-pulse"
                  : esStatus === "demo"
                    ? "bg-amber-300"
                    : "bg-red-400"
              }`}
            />
            {isDemoMode ? "Demo data mode" : `Elasticsearch ${esStatus}`}
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-500"
          >
            + Add Order
          </button>
        </div>
      </header>

      <main className="w-full px-8 py-8">
        

        <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard label="Total Revenue" value={stats?.totalRevenue} prefix="$" icon="$" color="indigo" />
          <StatCard label="Total Orders" value={stats?.totalOrders} icon="O" color="emerald" />
          <StatCard label="Avg Order Value" value={stats?.avgOrder} prefix="$" icon="A" color="amber" />
          <StatCard label="ES Index Docs" value={stats?.totalOrders} icon="D" color="rose" />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-5 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6 lg:col-span-2">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Sales by Month
            </h2>
            <BarChart data={stats?.salesByMonth || []} />
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900 p-6">
            <h2 className="mb-5 text-sm font-semibold uppercase tracking-wider text-slate-400">
              Top Products
            </h2>
            <TopProducts data={stats?.topProducts || []} />
          </div>
        </div>

        {stats?.byStatus && (
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
            {stats.byStatus.map((status) => (
              <div
                key={status.key}
                className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-900 px-5 py-4"
              >
                <StatusBadge status={status.key} />
                <span className="text-2xl font-bold text-white">{status.doc_count}</span>
              </div>
            ))}
          </div>
        )}

        <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-900">
          <div className="flex flex-col gap-4 border-b border-slate-800 px-6 py-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold text-white">Orders Search</h2>
              <p className="mt-0.5 text-xs text-slate-500">
                {isDemoMode ? (
                  <>Static GitHub Pages preview with local demo data</>
                ) : (
                  <>
                    API:
                    <code className="ml-1 text-indigo-400">{API}</code>
                  </>
                )}
              </p>
            </div>
            <div className="flex gap-2 sm:ml-auto">
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && handleSearch()}
                placeholder="Search by name, product, or status"
                className="w-64 rounded-lg border border-slate-700 bg-slate-800 px-4 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                onClick={handleSearch}
                className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-indigo-500"
              >
                Search
              </button>
              <button
                onClick={handleClear}
                className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-sm text-slate-300 transition-colors hover:bg-slate-700"
              >
                Clear
              </button>
            </div>
          </div>
          <OrdersTable orders={orders} loading={loading} onDelete={handleDelete} />
        </div>
      </main>

      {showModal && (
        <AddOrderModal onClose={() => setShowModal(false)} onSubmit={handleAddOrder} />
      )}
    </div>
  );
}

function nextQueryAwareOrders(nextOrders, currentQuery) {
  return currentQuery ? filterDemoOrders(currentQuery, nextOrders) : nextOrders;
}
