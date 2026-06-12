import { useEffect, useState } from "react";
import { MapPin, Navigation, RefreshCw, CheckCircle2, User, Clock } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export default function RiderDashboard() {
  const [trips, setTrips] = useState([]);
  const [riderName, setRiderName] = useState("");
  const [loading, setLoading] = useState(false);
  const [busyId, setBusyId] = useState(null);

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/trips`);
      const data = await res.json();
      setTrips(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, []);

  const acceptTrip = async (id) => {
    if (!riderName.trim()) {
      alert("Please enter your name first so customers know who's coming.");
      return;
    }
    setBusyId(id);
    try {
      await fetch(`${API_BASE}/trips/${id}/assign`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rider_name: riderName }),
      });
      fetchTrips();
    } finally {
      setBusyId(null);
    }
  };

  const completeTrip = async (id) => {
    const fareInput = prompt("Enter the fare collected (TZS):", "3000");
    if (fareInput === null) return;
    const fare = Number(fareInput) || 0;

    setBusyId(id);
    try {
      await fetch(`${API_BASE}/trips/${id}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fare }),
      });
      fetchTrips();
    } finally {
      setBusyId(null);
    }
  };

  const pending = trips.filter((t) => t.status === "pending");
  const myTrips = trips.filter(
    (t) => t.status === "assigned" && t.rider === riderName && riderName.trim() !== ""
  );

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-6">
      <div className="absolute top-0 left-[-10%] w-[400px] h-[400px] rounded-full bg-accent2/10 blur-[120px] -z-10" />

      <div className="max-w-4xl mx-auto">
        <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-accent2 mb-3">
          Rider
        </span>
        <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
          <h1 className="font-display text-4xl md:text-5xl text-text tracking-tight">
            RIDER DASHBOARD
          </h1>
          <button
            onClick={fetchTrips}
            className="inline-flex items-center gap-2 bg-surface border border-line text-text font-semibold px-4 py-3 rounded-2xl hover:bg-surface2 transition-colors duration-200"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>

        <div className="bg-surface border border-line rounded-3xl p-6 mb-10">
          <label htmlFor="riderName" className="block text-sm font-semibold text-text mb-2">
            Your Name
          </label>
          <div className="relative max-w-sm">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted" />
            <input
              id="riderName"
              value={riderName}
              onChange={(e) => setRiderName(e.target.value)}
              placeholder="e.g. Juma Mwakalindile"
              className="w-full bg-bg border border-line rounded-2xl pl-12 pr-4 py-3 text-text placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent2/60 focus:border-accent2 transition-colors duration-200"
            />
          </div>
          <p className="text-muted text-sm mt-3">
            Enter your name so the system knows who accepts each trip.
          </p>
        </div>

        {/* My active trips */}
        {riderName.trim() && (
          <Section title="My Active Trips" empty={myTrips.length === 0} emptyText="You have no assigned trips right now.">
            {myTrips.map((t) => (
              <TripCard key={t.id} trip={t}>
                <button
                  onClick={() => completeTrip(t.id)}
                  disabled={busyId === t.id}
                  className="inline-flex items-center gap-2 bg-accent2 text-bg font-bold px-4 py-3 rounded-xl hover:translate-y-[-2px] transition-all duration-200 disabled:opacity-60"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Mark Complete
                </button>
              </TripCard>
            ))}
          </Section>
        )}

        {/* Pending requests */}
        <Section title="Incoming Ride Requests" empty={pending.length === 0} emptyText="No pending ride requests right now.">
          {pending.map((t) => (
            <TripCard key={t.id} trip={t}>
              <button
                onClick={() => acceptTrip(t.id)}
                disabled={busyId === t.id}
                className="inline-flex items-center gap-2 bg-accent text-bg font-bold px-4 py-3 rounded-xl hover:translate-y-[-2px] transition-all duration-200 disabled:opacity-60"
              >
                Accept Trip
              </button>
            </TripCard>
          ))}
        </Section>
      </div>
    </div>
  );
}

function Section({ title, empty, emptyText, children }) {
  return (
    <div className="mb-12">
      <h2 className="font-display text-2xl text-text mb-5 tracking-wide">{title}</h2>
      {empty ? (
        <p className="text-muted bg-surface border border-line rounded-2xl px-6 py-8 text-center">
          {emptyText}
        </p>
      ) : (
        <div className="space-y-4">{children}</div>
      )}
    </div>
  );
}

function TripCard({ trip, children }) {
  return (
    <div className="bg-surface border border-line rounded-3xl p-6 flex flex-col md:flex-row md:items-center gap-5 hover:border-accent2/40 transition-colors duration-300">
      <div className="flex-1 grid sm:grid-cols-2 gap-4">
        <div className="flex items-start gap-3">
          <MapPin className="w-5 h-5 text-accent2 mt-0.5 shrink-0" />
          <div>
            <p className="text-muted text-xs uppercase tracking-wide">Pickup</p>
            <p className="text-text font-semibold">{trip.pickup}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Navigation className="w-5 h-5 text-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-muted text-xs uppercase tracking-wide">Destination</p>
            <p className="text-text font-semibold">{trip.destination}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <User className="w-5 h-5 text-muted mt-0.5 shrink-0" />
          <div>
            <p className="text-muted text-xs uppercase tracking-wide">Customer</p>
            <p className="text-text font-semibold">{trip.customer_name || "Anonymous"}</p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <Clock className="w-5 h-5 text-muted mt-0.5 shrink-0" />
          <div>
            <p className="text-muted text-xs uppercase tracking-wide">Requested</p>
            <p className="text-text font-semibold">{trip.created_at}</p>
          </div>
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}
