import { useEffect, useState } from "react";
import { RefreshCw, TrendingUp, Wallet, ListChecks, Trophy } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [statsRes, tripsRes] = await Promise.all([
        fetch(`${API_BASE}/stats`),
        fetch(`${API_BASE}/trips`),
      ]);
      setStats(await statsRes.json());
      setTrips(await tripsRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-6">
      <div className="absolute top-0 right-[-5%] w-[450px] h-[450px] rounded-full bg-accent/10 blur-[120px] -z-10" />

      <div className="max-w-5xl mx-auto">
        <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-accent2 mb-3">
          Association
        </span>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <h1 className="font-display text-4xl md:text-5xl text-text tracking-tight">
            ADMIN OVERVIEW
          </h1>
          <button
            onClick={fetchAll}
            className="inline-flex items-center gap-2 bg-surface border border-line text-text font-semibold px-4 py-3 rounded-2xl hover:bg-surface2 transition-colors duration-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        {stats && (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            <StatCard icon={<ListChecks className="w-5 h-5" />} label="Total Trips" value={stats.total_trips} />
            <StatCard icon={<TrendingUp className="w-5 h-5" />} label="Completed" value={stats.completed_trips} accent />
            <StatCard icon={<ListChecks className="w-5 h-5" />} label="Pending" value={stats.pending_trips} />
            <StatCard icon={<Wallet className="w-5 h-5" />} label="Revenue (TZS)" value={stats.total_revenue.toLocaleString()} accent />
          </div>
        )}

        {stats && Object.keys(stats.rider_performance).length > 0 && (
          <div className="bg-surface border border-line rounded-3xl p-6 mb-12">
            <h2 className="font-display text-2xl text-text mb-5 tracking-wide flex items-center gap-2">
              <Trophy className="w-5 h-5 text-accent" />
              RIDER PERFORMANCE
            </h2>
            <div className="space-y-3">
              {Object.entries(stats.rider_performance)
                .sort((a, b) => b[1] - a[1])
                .map(([rider, count]) => (
                  <div key={rider} className="flex items-center gap-4">
                    <span className="text-text font-semibold w-40 truncate">{rider}</span>
                    <div className="flex-1 h-2 bg-surface2 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent2 rounded-full transition-all duration-500"
                        style={{ width: `${Math.min(100, (count / stats.completed_trips) * 100)}%` }}
                      />
                    </div>
                    <span className="text-muted text-sm w-20 text-right">{count} trips</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        <h2 className="font-display text-2xl text-text mb-5 tracking-wide">ALL TRIPS</h2>
        <div className="bg-surface border border-line rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-line text-muted text-left uppercase text-xs tracking-wide">
                  <th className="px-5 py-4">#</th>
                  <th className="px-5 py-4">Customer</th>
                  <th className="px-5 py-4">Route</th>
                  <th className="px-5 py-4">Rider</th>
                  <th className="px-5 py-4">Fare</th>
                  <th className="px-5 py-4">Status</th>
                </tr>
              </thead>
              <tbody>
                {trips.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-muted">
                      No trips recorded yet.
                    </td>
                  </tr>
                )}
                {trips.map((t) => (
                  <tr key={t.id} className="border-b border-line/60 last:border-0 hover:bg-surface2 transition-colors">
                    <td className="px-5 py-4 text-muted">{t.id}</td>
                    <td className="px-5 py-4 text-text font-medium">{t.customer_name || "Anonymous"}</td>
                    <td className="px-5 py-4 text-text">
                      {t.pickup} <span className="text-muted">→</span> {t.destination}
                    </td>
                    <td className="px-5 py-4 text-text">{t.rider || "—"}</td>
                    <td className="px-5 py-4 text-text">{t.fare ? t.fare.toLocaleString() : "—"}</td>
                    <td className="px-5 py-4">
                      <StatusBadge status={t.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value, accent }) {
  return (
    <div className="bg-surface border border-line rounded-3xl p-6">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${accent ? "bg-accent text-bg" : "bg-surface2 text-accent2"}`}>
        {icon}
      </div>
      <p className="font-display text-3xl text-text mb-1">{value}</p>
      <p className="text-muted text-sm">{label}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    pending: "bg-accent/15 text-accent",
    assigned: "bg-accent2/15 text-accent2",
    completed: "bg-line text-muted",
  };
  return (
    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${styles[status] || ""}`}>
      {status}
    </span>
  );
}
