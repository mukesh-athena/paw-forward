"use client";

import { useState } from "react";

const milestones = [
  {
    year: "2019",
    title: "The Beginning",
    description:
      "Built an awareness campaign in Grade 5 on how to help stray animals during COVID-19, a time when strays were being left without food or care. Created a website and presented it to over 40 people, making the case that ordinary people could do something, even from home.",
    images: [{ src: "/images/timeline-2019.png" }],
    bg: "#FBE8E8",
    circleBg: "#F2C8C8",
  },
  {
    year: "2021–2022",
    title: "YODA",
    description:
      "Volunteered at YODA Animal Shelter alongside two friends in Grade 8. Raised over ₹10,000 by selling our own paintings and donated all proceeds to the shelter. Helped 3 dogs find their forever homes. Organised a donation drive collecting over 20kg of newspapers, food, clothes, and animal supplies.",
    images: [
      { src: "/images/timeline-2021-photo.jpeg" },
      { src: "/images/timeline-2021-certificate.jpeg" },
    ],
    bg: "#F9DDD8",
    circleBg: "#EDB8B0",
  },
  {
    year: "2024–2025",
    title: "WSD",
    description:
      "Volunteered at WSD Animal Shelter in Grade 10 and 11, walking, bathing, and feeding the dogs in their care. As part of IB CAS, created awareness posters and reels for World Rabies Day and the Adopt Don't Shop campaign to reach wider audiences online.",
    images: [{ src: "/images/timeline-2024.jpeg" }],
    bg: "#F5D0CC",
    circleBg: "#E8A89E",
  },
  {
    year: "2026",
    title: "Paw Forward",
    description:
      "Founded Paw Forward, a city-wide adoption and sterilisation campaign for Mumbai's animals. Partnered with YODA, WSD, and the Brihanmumbai Municipal Corporation (BMC) to build something that goes beyond individual acts of care into real, systemic change.",
    images: [{ src: "/images/timeline-2026.jpeg" }],
    bg: "#FDEEE8",
    circleBg: "#F2C4A8",
  },
];

export default function Timeline() {
  const [active, setActive] = useState(0);
  const [animating, setAnimating] = useState(false);

  function goTo(i) {
    if (i === active || animating) return;
    setAnimating(true);
    setTimeout(() => {
      setActive(i);
      setAnimating(false);
    }, 380);
  }

  const m = milestones[active];

  return (
    <section
      className="py-24 md:py-32 transition-colors duration-700"
      style={{ backgroundColor: m.bg }}
    >
      <style>{`
        @keyframes circleIn {
          from { opacity: 0; transform: scale(0.88) rotate(-6deg); }
          to   { opacity: 1; transform: scale(1)    rotate(0deg);  }
        }
        @keyframes circleOut {
          from { opacity: 1; transform: scale(1)    rotate(0deg);  }
          to   { opacity: 0; transform: scale(0.88) rotate(6deg);  }
        }
        @keyframes textIn {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0);     }
        }
        @keyframes textOut {
          from { opacity: 1; transform: translateX(0);     }
          to   { opacity: 0; transform: translateX(-14px); }
        }
        .circle-enter { animation: circleIn  0.45s cubic-bezier(0.34,1.4,0.64,1) forwards; }
        .circle-exit  { animation: circleOut 0.30s ease forwards; }
        .text-enter   { animation: textIn    0.40s ease 0.1s forwards; opacity: 0; }
        .text-exit    { animation: textOut   0.25s ease forwards; }
      `}</style>

      <div className="max-w-7xl mx-auto px-6">

        {/* Heading */}
        <div className="text-center mb-16">
          <p
            className="uppercase tracking-[0.35em] text-[#E8A84C] text-sm mb-4"
            style={{ fontFamily: "var(--font-spartan)" }}
          >
            The Journey
          </p>
          <h2
            className="text-4xl md:text-6xl lg:text-7xl text-[#6B1A1A] leading-tight"
            style={{ fontFamily: "var(--font-spartan)" }}
          >
            How Paw Forward Came to Life
          </h2>
        </div>

        {/* Main row: left text + right circle(s) */}
        <div className="flex flex-col md:flex-row items-center gap-12 md:gap-20">

          {/* ── LEFT: text ── */}
          <div className={`flex-1 space-y-6 ${animating ? "text-exit" : "text-enter"}`}>

            {/* Progress dots */}
            <div className="flex gap-2">
              {milestones.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className="rounded-full transition-all duration-500 cursor-pointer"
                  style={{
                    width:  active === i ? "32px" : "10px",
                    height: "10px",
                    backgroundColor: active === i
                      ? "#6B1A1A"
                      : "rgba(107,26,26,0.20)",
                  }}
                />
              ))}
            </div>

            <p
              className="text-2xl md:text-3xl text-[#E8A84C]"
              style={{ fontFamily: "var(--font-spartan)" }}
            >
              {m.year}
            </p>

            <h3
              className="text-4xl md:text-5xl lg:text-6xl text-[#6B1A1A] leading-tight"
              style={{ fontFamily: "var(--font-spartan)" }}
            >
              {m.title}
            </h3>

            <p
              className="text-base md:text-lg text-[#6B1A1A]/80 leading-[1.9]"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              {m.description}
            </p>

            {/* Prev / Next */}
            <div className="flex gap-4 pt-2">
              <button
  onClick={() => goTo(Math.max(0, active - 1))}
  disabled={active === 0 || animating}
  className="group relative overflow-hidden px-6 py-2.5 rounded-full border border-[#6B1A1A]/30 text-[#6B1A1A] text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:bg-[#6B1A1A] hover:text-white disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
  style={{ fontFamily: "var(--font-spartan)" }}
>
  <span className="relative z-10">← Prev</span>
  <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-[#E8A84C]/70 to-transparent skew-x-[-20deg] -translate-x-full group-hover:translate-x-[420%] transition-transform duration-1000 ease-out" />
</button>
              <button
  onClick={() => goTo(Math.min(milestones.length - 1, active + 1))}
  disabled={active === milestones.length - 1 || animating}
  className="group relative overflow-hidden px-6 py-2.5 rounded-full bg-[#6B1A1A] text-white text-sm tracking-[0.15em] uppercase transition-all duration-300 hover:bg-[#8E2323] disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
  style={{ fontFamily: "var(--font-spartan)" }}
>
  <span className="relative z-10">Next →</span>
  <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-[#E8A84C]/70 to-transparent skew-x-[-20deg] -translate-x-full group-hover:translate-x-[420%] transition-transform duration-1000 ease-out" />
</button>
            </div>
          </div>

          {/* ── RIGHT: circle(s) ── */}
          {/*
            Single image → one large circle
            Two images (2021) → two smaller circles side by side
          */}
          <div
            className={`flex-shrink-0 flex items-center justify-center gap-6 ${animating ? "circle-exit" : "circle-enter"}`}
          >
            {m.images.map((img, i) => (
              <div
                key={i}
                className="relative overflow-hidden rounded-full shadow-[0_24px_64px_rgba(107,26,26,0.18)] flex-shrink-0"
                style={{
                  width: m.images.length === 2
                    ? "clamp(170px, 19vw, 260px)"
                    : "clamp(260px, 32vw, 440px)",
                  height: m.images.length === 2
                    ? "clamp(170px, 19vw, 260px)"
                    : "clamp(260px, 32vw, 440px)",
                  backgroundColor: m.circleBg,
                }}
              >
                <img
                  src={img.src}
                  alt={m.title}
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}