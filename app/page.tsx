"use client";

import { useEffect, useRef, useState } from "react";
import PalettePicker from "@/app/components/PalettePicker";

export default function Home() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  return (
    <main className="page">
      {/* HEADER */}
      <header className="header">
        <a href="#" className="brand">WRK</a>

        <div className="controls">
          {/* Projects dropdown */}
          <div className="menu" ref={menuRef}>
            <button
              className="menu-trigger"
              aria-haspopup="menu"
              aria-expanded={open}
              aria-controls="projects-menu"
              onClick={() => setOpen(v => !v)}
            >
              Projects
              <svg className={`chev ${open ? "rot" : ""}`} width="14" height="14" viewBox="0 0 20 20" aria-hidden="true">
                <path d="M5 7l5 6 5-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>

            {open && (
              <div id="projects-menu" role="menu" className="dropdown">
                <a role="menuitem" href="#" target="_blank" rel="noreferrer">Coinstructive Redesign</a>
                <a role="menuitem" href="#" target="_blank" rel="noreferrer">Chef — Recipe Dev App</a>
                <a role="menuitem" href="#" target="_blank" rel="noreferrer">Pixels & Cursors</a>
                <a role="menuitem" href="#" target="_blank" rel="noreferrer">More…</a>
              </div>
            )}
          </div>

        </div>
      </header>

      {/* Content spacer / hero */}
      <section className="hero" />

      {/* Fixed palette picker in bottom right */}
      <PalettePicker />

      {/* FOOTER */}
      <footer className="footer">
        <a href="mailto:miglearambulo19@gmail.com" className="contact">Contact me</a>
      </footer>
    </main>
  );
}
