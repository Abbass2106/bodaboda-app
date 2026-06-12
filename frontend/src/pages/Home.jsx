import { Link } from "react-router-dom";
import { ArrowRight, MapPin, Users, ShieldCheck, Zap } from "lucide-react";

export default function Home() {
  return (
    <div className="relative overflow-hidden">
      {/* Atmospheric background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-accent2/10 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[450px] h-[450px] rounded-full bg-accent/10 blur-[120px]" />
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]" xmlns="http://www.w3.org/2000/svg">
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
          </pattern>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-40 pb-24 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <span className="inline-block text-xs font-bold tracking-[0.3em] uppercase text-accent2 mb-4">
            Dodoma Bodaboda Association
          </span>
          <h1 className="font-display text-5xl md:text-7xl leading-[1.05] tracking-tight text-text mb-6">
            WELCOME TO
            <br />
            <span className="text-accent">BODACONNECT</span>
          </h1>
          <p className="text-muted text-lg leading-relaxed max-w-md mb-8">
            A simple digital platform connecting customers to trusted bodaboda
            riders across Dodoma — request a ride, track your trip, and help
            our riders earn fairly every single day.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link
              to="/request"
              className="inline-flex items-center gap-2 bg-accent text-bg font-bold px-6 py-4 rounded-2xl hover:translate-y-[-2px] hover:shadow-lg hover:shadow-accent/20 transition-all duration-200"
            >
              Request a Ride
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              to="/rider"
              className="inline-flex items-center gap-2 bg-surface border border-line text-text font-bold px-6 py-4 rounded-2xl hover:bg-surface2 hover:translate-y-[-2px] transition-all duration-200"
            >
              Rider Dashboard
            </Link>
          </div>
        </div>

        {/* Signature visual moment: layered "route card" composition */}
        <div className="relative h-[420px] hidden md:block">
          <div className="absolute top-0 right-0 w-72 bg-surface border border-line rounded-3xl p-6 shadow-2xl shadow-black/40 rotate-[4deg] hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center gap-2 text-accent2 text-xs font-bold uppercase tracking-widest mb-4">
              <Zap className="w-4 h-4" /> Live Trip
            </div>
            <div className="flex items-start gap-3 mb-4">
              <div className="flex flex-col items-center pt-1">
                <span className="w-3 h-3 rounded-full bg-accent2" />
                <span className="w-px h-10 bg-line my-1" />
                <span className="w-3 h-3 rounded-full bg-accent" />
              </div>
              <div className="flex flex-col gap-6 text-sm">
                <div>
                  <p className="text-muted text-xs uppercase tracking-wide">Pickup</p>
                  <p className="text-text font-semibold">Nyerere Square</p>
                </div>
                <div>
                  <p className="text-muted text-xs uppercase tracking-wide">Destination</p>
                  <p className="text-text font-semibold">Dodoma Stadium</p>
                </div>
              </div>
            </div>
            <div className="border-t border-line pt-4 flex justify-between items-center text-sm">
              <span className="text-muted">Rider</span>
              <span className="text-text font-bold">Juma M.</span>
            </div>
          </div>

          <div className="absolute bottom-0 left-0 w-64 bg-surface2 border border-line rounded-3xl p-6 shadow-xl shadow-black/30 rotate-[-3deg] hover:rotate-0 transition-transform duration-500">
            <div className="flex items-center gap-2 text-accent text-xs font-bold uppercase tracking-widest mb-3">
              <MapPin className="w-4 h-4" /> Today
            </div>
            <p className="font-display text-4xl text-text mb-1">128</p>
            <p className="text-muted text-sm">Trips completed</p>
          </div>
        </div>
      </section>

      {/* Feature strip */}
      <section className="max-w-6xl mx-auto px-6 pb-32 grid md:grid-cols-3 gap-6">
        <FeatureCard
          icon={<MapPin className="w-6 h-6" />}
          title="Request a Ride"
          desc="Enter your pickup point and destination, and we'll connect you to the nearest available rider."
        />
        <FeatureCard
          icon={<Users className="w-6 h-6" />}
          title="Rider Dashboard"
          desc="Riders see assigned trips in real time and can mark them complete once finished."
        />
        <FeatureCard
          icon={<ShieldCheck className="w-6 h-6" />}
          title="Admin Tracking"
          desc="Association admins track daily trips, payments, and rider performance from one place."
        />
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, desc }) {
  return (
    <div className="bg-surface border border-line rounded-3xl p-7 hover:border-accent2/50 transition-colors duration-300">
      <div className="w-12 h-12 rounded-2xl bg-surface2 flex items-center justify-center text-accent2 mb-5">
        {icon}
      </div>
      <h3 className="font-display text-xl text-text mb-2 tracking-wide">{title}</h3>
      <p className="text-muted text-sm leading-relaxed">{desc}</p>
    </div>
  );
}
