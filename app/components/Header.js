"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "MY STORY", href: "/" },
  { label: "ADOPT A PAW", href: "/adopt" },
  { label: "FIND MY PAW", href: "/find-my-paw" },
  { label: "REPORT STRAYS", href: "/report-strays" },
  { label: "CONTACT US", href: "/contact" },
];

export default function Header({ transparentOnTop = false }) {
  const pathname = usePathname();

  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  const isSolid = scrolled || !transparentOnTop || menuOpen;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isSolid
          ? "bg-[#FAF6EF]/95 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-5"
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center"
          onClick={() => setMenuOpen(false)}
        >
          <Image
            src="/images/paw-logo.png"
            alt="Paw Forward"
            width={72}
            height={72}
            className="object-contain"
            priority
          />
        </Link>

        {/* Desktop Navigation */}
        <ul className="hidden lg:flex items-center gap-2">
          {navLinks.map((link) => {
            const active = pathname === link.href;

            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`px-5 py-2 rounded-full text-sm tracking-[0.15em] transition-all duration-300 border ${
                    active
                      ? "bg-[#6B1A1A] text-white border-[#6B1A1A]"
                      : isSolid
                      ? "text-[#6B1A1A] border-transparent hover:bg-[#6B1A1A] hover:text-white"
                      : "text-white border-transparent hover:bg-white hover:text-[#6B1A1A]"
                  }`}
                  style={{
                    fontFamily: "var(--font-playfair)",
                  }}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className={`lg:hidden w-11 h-11 flex items-center justify-center rounded-full transition-all duration-300 ${
            isSolid
              ? "text-[#6B1A1A] bg-[#6B1A1A]/5"
              : "text-white bg-white/10 backdrop-blur-sm"
          }`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close Menu" : "Open Menu"}
        >
          {menuOpen ? (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          )}
        </button>
      </nav>

      {/* Mobile Navigation */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ${
          menuOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="bg-[#FAF6EF] border-t border-[#6B1A1A]/10 px-6 py-6">
          <ul className="space-y-2">
            {navLinks.map((link) => {
              const active = pathname === link.href;

              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMenuOpen(false)}
                    className={`block px-4 py-3 rounded-xl text-base tracking-[0.12em] transition-all duration-300 ${
                      active
                        ? "bg-[#6B1A1A] text-white"
                        : "text-[#6B1A1A] hover:bg-[#6B1A1A] hover:text-white"
                    }`}
                    style={{
                      fontFamily: "var(--font-playfair)",
                    }}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </header>
  );
}