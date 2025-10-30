"use client";

import { useEffect, useRef, useState } from "react";

type Palette = {
  name: string;
  vars: Partial<Record<"--bg" | "--fg" | "--muted" | "--panel" | "--border" | "--accent", string>>;
};

// Curated color palettes with background, text, and accent colors
const PRESETS: Palette[] = [
  { name: "Default Dark", vars: { "--bg":"#0a0a0a","--fg":"#f2f2f2","--muted":"#b8b8b8","--panel":"#161616","--border":"#262626","--accent":"#8b5cf6" } },
  { name: "Midnight Blue", vars: { "--bg":"#0f172a","--fg":"#f1f5f9","--muted":"#94a3b8","--panel":"#1e293b","--border":"#334155","--accent":"#3b82f6" } },
  { name: "Forest Green", vars: { "--bg":"#0c1f17","--fg":"#ecfdf5","--muted":"#86efac","--panel":"#1a2e22","--border":"#22543d","--accent":"#10b981" } },
  { name: "Sunset Orange", vars: { "--bg":"#1f1611","--fg":"#fefce8","--muted":"#fbbf24","--panel":"#2d1f0e","--border":"#451a03","--accent":"#f59e0b" } },
  { name: "Rose Gold", vars: { "--bg":"#1f0f15","--fg":"#fdf2f8","--muted":"#f9a8d4","--panel":"#2d1317","--border":"#4c1d34","--accent":"#ec4899" } },
  { name: "Arctic White", vars: { "--bg":"#ffffff","--fg":"#111827","--muted":"#6b7280","--panel":"#f9fafb","--border":"#e5e7eb","--accent":"#3b82f6" } },
  { name: "Warm Cream", vars: { "--bg":"#fefbf3","--fg":"#1c1917","--muted":"#78716c","--panel":"#f5f5f4","--border":"#d6d3d1","--accent":"#ea580c" } },
  { name: "Purple Haze", vars: { "--bg":"#1e1b4b","--fg":"#f1f5f9","--muted":"#a78bfa","--panel":"#312e81","--border":"#4c1d95","--accent":"#8b5cf6" } },
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
  const [accent, setAccent] = useState<string>("");
  const [accentInput, setAccentInput] = useState<string>("");
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
        if (parsed["--accent"]) {
          setAccent(parsed["--accent"]);
          setAccentInput(parsed["--accent"]);
        }
      } catch {}
    } else {
      // Set current CSS variables as baseline
      const cs = getComputedStyle(document.documentElement);
      const currentAccent = cs.getPropertyValue("--accent").trim();
      setAccent(currentAccent);
      setAccentInput(currentAccent);
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
    if (p.vars["--accent"]) {
      setAccent(p.vars["--accent"]);
      setAccentInput(p.vars["--accent"]);
    }
  }

  function changeAccent(hex: string) {
    setAccent(hex);
    setAccentInput(hex);
    const cs = getComputedStyle(document.documentElement);
    const current = {
      "--bg": cs.getPropertyValue("--bg").trim(),
      "--fg": cs.getPropertyValue("--fg").trim(),
      "--muted": cs.getPropertyValue("--muted").trim(),
      "--panel": cs.getPropertyValue("--panel").trim(),
      "--border": cs.getPropertyValue("--border").trim(),
      "--accent": hex,
    };
    applyPalette(current);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(current));
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

          <div className="sep"></div>

          <div className="inline">
            <label htmlFor="accent">Accent</label>
            <input
              id="accent"
              className="input-color"
              type="color"
              value={accent || "#8b5cf6"}
              onChange={(e) => changeAccent(e.target.value)}
            />
            <input
              className="input-text"
              type="text"
              placeholder="#RRGGBB"
              value={accentInput}
              onChange={(e)=> setAccentInput(e.target.value)}
              onBlur={()=>{
                const v = accentInput.trim();
                if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) changeAccent(v);
                else setAccentInput(accent);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
