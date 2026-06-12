import { Link, useLocation } from "react-router-dom";
import { Bike, Menu, X } from "lucide-react";
import { useState } from "react";

const links = [
  { to: "/", label: "Home" },
  { to: "/request", label: "Request a Ride" },
  { to: "/rider", label: "Rider Dashboard" },
  { to: "/admin", label: "Admin" },
];

export default function Navbar() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed top-4 left-4 right-4 z-50">
      <nav className="mx-auto max-w-6xl flex items-center justify-between bg-surface/90 backdrop-blur border border-line rounded-2xl px-5 py-3 shadow-lg shadow-black/30">
        <Link to="/" className="flex items-center gap-2 group" onClick={() => setOpen(false)}>
          <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent text-bg group-hover:rotate-12 transition-transform duration-300">
            <Bike className="w-5 h-5" strokeWidth={2.5} />
          </span>
          <span className="font-display text-lg tracking-wide text-text">
            BODA<span className="text-accent">CONNECT</span>
          </span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-4 py-2 rounded-xl text-sm font-semibold tracking-wide transition-colors duration-200 ${
                location.pathname === l.to
                  ? "bg-accent text-bg"
                  : "text-muted hover:text-text hover:bg-surface2"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>

        <button
          className="md:hidden flex items-center justify-center w-11 h-11 rounded-xl text-text hover:bg-surface2 transition-colors"
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {open && (
        <div className="md:hidden mx-auto max-w-6xl mt-2 bg-surface/95 backdrop-blur border border-line rounded-2xl p-2 flex flex-col gap-1 shadow-lg">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`px-4 py-3 rounded-xl text-sm font-semibold tracking-wide transition-colors ${
                location.pathname === l.to
                  ? "bg-accent text-bg"
                  : "text-muted hover:text-text hover:bg-surface2"
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
