"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Closer section — looping video + emotional tagline.
 * Used on cream-background pages (My Story, Adopt, Report Strays) where it
 * harmonizes with the video's warm tones. NOT used on Find My Paw (gold)
 * or Contact (pink) — those have their own colored bg as personality.
 *
 * Tagline reveals letter-by-letter once the section scrolls into view.
 *
 * Video source: Pixabay (free for commercial use, no attribution required).
 */
export default function Closer() {
  // TODO: Vipanshi to confirm final tagline
  const tagline = "Every paw deserves a home";

  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setVisible(true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden bg-black"
      style={{ aspectRatio: "16 / 9", maxHeight: "70vh" }}
    >
      <video
        src="/videos/closer.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 h-full w-full object-cover object-top"
      />
      {/* Dark overlay for tagline legibility */}
      <div className="absolute inset-0 bg-black/40" />

      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <h2
          className="text-center text-4xl md:text-6xl lg:text-7xl text-white drop-shadow-lg max-w-4xl leading-tight"
          style={{ fontFamily: "var(--font-playfair)" }}
          aria-label={tagline}
        >
          {tagline.split("").map((char, i) => (
            <span
              key={i}
              aria-hidden="true"
              className="inline-block"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ease-out, transform 0.5s ease-out`,
                transitionDelay: visible ? `${i * 60}ms` : "0ms",
                whiteSpace: char === " " ? "pre" : "normal",
              }}
            >
              {char}
            </span>
          ))}
        </h2>
      </div>
    </section>
  );
}