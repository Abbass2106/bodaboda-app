import { useState } from "react";
import { MapPin, Navigation, User, CheckCircle2, Loader2 } from "lucide-react";

const API_BASE = import.meta.env.VITE_API_URL || "/api";

export default function RequestRide() {
  const [form, setForm] = useState({ customer_name: "", pickup: "", destination: "" });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.pickup.trim() || !form.destination.trim()) {
      setError("Please fill in both pickup and destination.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(`${API_BASE}/request-ride`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setResult(data.trip);
      setForm({ customer_name: "", pickup: "", destination: "" });
    } catch (err) {
      setError(err.message || "Could not reach the server. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen pt-32 pb-24 px-6">
      <div className="absolute top-0 right-[-10%] w-[400px] h-[400px] rounded-full bg-accent/10 blur-[120px] -z-10" />

      <div className="max-w-xl mx-auto">
        <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-accent2 mb-3">
          Customer
        </span>
        <h1 className="font-display text-4xl md:text-5xl text-text mb-3 tracking-tight">
          REQUEST A RIDE
        </h1>
        <p className="text-muted mb-10 leading-relaxed">
          Tell us where you are and where you're headed — a rider will be
          assigned to your trip shortly.
        </p>

        <form onSubmit={handleSubmit} className="bg-surface border border-line rounded-3xl p-6 md:p-8 space-y-6">
          <Field
            label="Your Name"
            name="customer_name"
            value={form.customer_name}
            onChange={handleChange}
            placeholder="e.g. Asha Mwakimba"
            icon={<User className="w-5 h-5" />}
            required={false}
          />
          <Field
            label="Pickup Location"
            name="pickup"
            value={form.pickup}
            onChange={handleChange}
            placeholder="e.g. Nyerere Square"
            icon={<MapPin className="w-5 h-5" />}
            required
          />
          <Field
            label="Destination"
            name="destination"
            value={form.destination}
            onChange={handleChange}
            placeholder="e.g. Dodoma Stadium"
            icon={<Navigation className="w-5 h-5" />}
            required
          />

          {error && (
            <p className="text-sm font-semibold text-red-400 bg-red-400/10 border border-red-400/30 rounded-xl px-4 py-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 bg-accent text-bg font-bold px-6 py-4 rounded-2xl hover:translate-y-[-2px] hover:shadow-lg hover:shadow-accent/20 transition-all duration-200 disabled:opacity-60 disabled:translate-y-0 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" /> Requesting...
              </>
            ) : (
              "Request Ride"
            )}
          </button>
        </form>

        {result && (
          <div className="mt-6 bg-surface2 border border-accent2/40 rounded-3xl p-6 flex items-start gap-4 animate-[fadeIn_0.3s_ease]">
            <CheckCircle2 className="w-6 h-6 text-accent2 shrink-0 mt-1" />
            <div>
              <p className="font-display text-lg text-text mb-1 tracking-wide">
                RIDE REQUESTED — #{result.id}
              </p>
              <p className="text-muted text-sm leading-relaxed">
                From <span className="text-text font-semibold">{result.pickup}</span> to{" "}
                <span className="text-text font-semibold">{result.destination}</span>.
                Status: <span className="text-accent font-semibold capitalize">{result.status}</span>.
                A rider will pick this up from the dashboard soon.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, placeholder, icon, required }) {
  return (
    <div>
      <label htmlFor={name} className="block text-sm font-semibold text-text mb-2">
        {label} {required && <span className="text-accent">*</span>}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted">{icon}</span>
        <input
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          className="w-full bg-bg border border-line rounded-2xl pl-12 pr-4 py-4 text-text placeholder:text-muted/60 focus:outline-none focus:ring-2 focus:ring-accent2/60 focus:border-accent2 transition-colors duration-200"
        />
      </div>
    </div>
  );
}
