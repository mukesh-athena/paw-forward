"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const navLinks = [
  { label: "MY STORY", href: "/" },
  { label: "ADOPT A PAW", href: "/adopt" },
  { label: "FIND MY PAW", href: "/find-my-paw" },
  { label: "REPORT STRAYS", href: "/report-strays" },
  { label: "CONTACT US", href: "/contact" },
];

export default function Header({ transparentOnTop = false }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll while mobile menu is open
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  // Solid styling kicks in when scrolled, OR immediately if no dark hero,
  // OR when mobile menu is open (so toggle stays readable).
  const isSolid = scrolled || !transparentOnTop || menuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSolid
          ? "bg-[#FAF6EF]/95 backdrop-blur-sm shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center" onClick={() => setMenuOpen(false)}>
          <Image
            src="/images/paw-logo.png"
            alt="Paw Forward"
            width={70}
            height={70}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop nav — only on lg+ screens (1024px) so half-screen tablet doesn't break */}
        <ul className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`px-5 py-2 rounded-full text-sm tracking-wider transition-all duration-300 ${
                  isSolid ? "text-[#6B1A1A]" : "text-white"
                } hover:bg-[#6B1A1A] hover:text-white`}
                style={{ fontFamily: "var(--font-playfair)", letterSpacing: "0.1em" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile/tablet hamburger toggle */}
        <button
          className={`lg:hidden w-10 h-10 flex items-center justify-center cursor-pointer ${
            isSolid ? "text-[#6B1A1A]" : "text-white"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          {menuOpen ? (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile/tablet dropdown panel */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <ul className="bg-[#FAF6EF] border-t border-[#6B1A1A]/10 px-6 py-6 space-y-1">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="block px-4 py-3 text-[#6B1A1A] text-base tracking-wider rounded-sm hover:bg-[#6B1A1A] hover:text-white active:bg-[#6B1A1A] active:text-white transition-all duration-150"
                style={{ fontFamily: "var(--font-playfair)", letterSpacing: "0.1em" }}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}