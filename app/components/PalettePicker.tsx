"use client";

import { useEffect, useRef, useState } from "react";

type Palette = {
  name: string;
  vars: Partial<Record<"--bg" | "--fg" | "--muted" | "--panel" | "--border" | "--accent", string>>;
};

// A few tasteful presets (you can add more)
const PRESETS: Palette[] = [
  { name: "Night Violet", vars: { "--bg":"#0a0a0a","--fg":"#f5f5f5","--muted":"#b8b8b8","--panel":"#161616","--border":"#262626","--accent":"#8b5cf6" } },
  { name: "Ink & Cream", vars: { "--bg":"#0b0b0b","--fg":"#fffaf0","--muted":"#c9c3b8","--panel":"#141414","--border":"#2a2a2a","--accent":"#ffd166" } },
  { name: "Slate Mint", vars: { "--bg":"#0e141b","--fg":"#eaf1f1","--muted":"#9fb1b3","--panel":"#141b22","--border":"#22303b","--accent":"#34d399" } },
  { name: "Carbon Rose", vars: { "--bg":"#0b0b0c","--fg":"#f7f7fb","--muted":"#b9b9c8","--panel":"#151517","--border":"#292933","--accent":"#f472b6" } },
  { name: "Deep Ocean", vars: { "--bg":"#0a0f14","--fg":"#e8eff6","--muted":"#a8b6c2","--panel":"#10161d","--border":"#1f2933","--accent":"#60a5fa" } },
  { name: "Graphite Lime", vars: { "--bg":"#0d0d0d","--fg":"#f3f7f0","--muted":"#b7c4b2","--panel":"#151515","--border":"#2b2b2b","--accent":"#a3e635" } },
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
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Load saved palette
    const raw = typeof window !== "undefined" ? localStorage.getItem(STORAGE_KEY) : null;
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        applyPalette(parsed);
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
    localStorage.setItem(STORAGE_KEY, JSON.stringify(p.vars));
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
          <div className="palette-row">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                className="swatch"
                style={{ background: p.vars["--accent"], boxShadow: "inset 0 0 0 1000px rgba(255,255,255,0.05)" }}
                title={p.name}
                onClick={() => choosePreset(p)}
                aria-label={`Use ${p.name} theme`}
              />
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
