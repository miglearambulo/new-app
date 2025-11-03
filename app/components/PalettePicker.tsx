"use client";

import { useEffect, useRef, useState } from "react";

type Palette = {
  name: string;
  vars: Partial<Record<"--bg" | "--fg" | "--muted" | "--panel" | "--border" | "--accent", string>>;
};

// Curated color palettes with background, text, and accent colors
const PRESETS: Palette[] = [
  { name: "Default Dark", vars: { "--bg":"#0a0a0a","--fg":"#f2f2f2","--muted":"#b8b8b8","--panel":"#161616","--border":"#262626","--accent":"#8b5cf6" } },
  { name: "Arctic White", vars: { "--bg":"#ffffff","--fg":"#111827","--muted":"#6b7280","--panel":"#f9fafb","--border":"#e5e7eb","--accent":"#3b82f6" } },
  { name: "Forest Green", vars: { "--bg":"#0c1f17","--fg":"#ecfdf5","--muted":"#86efac","--panel":"#1a2e22","--border":"#22543d","--accent":"#10b981" } },
  { name: "Sunset Orange", vars: { "--bg":"#1f1611","--fg":"#fefce8","--muted":"#fbbf24","--panel":"#2d1f0e","--border":"#451a03","--accent":"#f59e0b" } },
];

const STORAGE_KEY = "ma-theme";

function applyPalette(p: Palette["vars"]) {
  const root = document.documentElement;
  Object.entries(p).forEach(([k, v]) => {
    root.style.setProperty(k, v as string);
  });
}

export default function PalettePicker() {
  const [open, setOpen] = useState(false);
  const [currentPalette, setCurrentPalette] = useState<string>("Default Dark");
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Load saved palette
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        applyPalette(parsed);
        if (parsed._paletteName) {
          setCurrentPalette(parsed._paletteName);
        }
      } catch {}
    }
  }, []);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  function choosePreset(p: Palette) {
    applyPalette(p.vars);
    setCurrentPalette(p.name);
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...p.vars, _paletteName: p.name }));
  }

  return (
    <div className="palette-picker-fixed" ref={ref}>
      <button
        className="palette-trigger"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen(v => !v)}
        title="Color palette"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="13.5" cy="6.5" r=".5"/>
          <circle cx="17.5" cy="10.5" r=".5"/>
          <circle cx="8.5" cy="7.5" r=".5"/>
          <circle cx="6.5" cy="12.5" r=".5"/>
          <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
        </svg>
      </button>

      {open && (
        <div className="palette-panel" role="menu" aria-label="Color palette">
          <div className="palette-grid">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                className={`palette-swatch ${currentPalette === p.name ? 'active' : ''}`}
                onClick={() => choosePreset(p)}
                aria-label={`Use ${p.name} theme`}
                title={p.name}
              >
                <div 
                  className="swatch-bg" 
                  style={{ backgroundColor: p.vars["--bg"] }}
                />
                <div 
                  className="swatch-accent" 
                  style={{ backgroundColor: p.vars["--accent"] }}
                />
                <span className="swatch-name">{p.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
