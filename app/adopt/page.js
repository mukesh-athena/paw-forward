"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
import Closer from "../components/Closer";
import Footer from "../components/Footer";
import AdoptModal from "../components/AdoptModal";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";

export default function AdoptAPaw() {
  const [selected, setSelected] = useState(null);
  const [yodaPets, setYodaPets] = useState([]);
  const [wsdPets, setWsdPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchPets() {
      try {
        const yodaQuery = query(collection(db, "dogs_yoda"), orderBy("addedAt", "desc"));
        const wsdQuery  = query(collection(db, "dogs_wsd"),  orderBy("addedAt", "desc"));
        const [yodaSnap, wsdSnap] = await Promise.all([getDocs(yodaQuery), getDocs(wsdQuery)]);
        if (cancelled) return;
        setYodaPets(yodaSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
        setWsdPets(wsdSnap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to load pets:", err);
        if (!cancelled) setError("Couldn't load adoptable pets. Please refresh.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchPets();
    return () => { cancelled = true; };
  }, []);

  return (
    <main>
      {/* z-50 ensures header always sits above the blob hero section */}
      <div className="relative z-50">
        <Header />
      </div>

      <FindAFriendHero />

      <div
        id="shelters"
        className="relative"
        style={{
          backgroundColor: "#FAF6EF",
          backgroundImage: "url('/images/paw-pattern.jpg')",
          backgroundRepeat: "repeat",
          backgroundSize: "280px",
        }}
      >
        <div className="absolute inset-0 bg-[#FAF6EF]/90 pointer-events-none" />
        <div className="relative">
          <ShelterSection
            shelterId="yoda" shelterName="YODA"
            shelterTagline="Youth Organisation in Defence of Animals"
            pets={yodaPets} loading={loading} error={error}
            onAdopt={(pet) => setSelected({ dog: pet, shelterId: "yoda", shelterName: "YODA" })}
          />
          <ShelterSection
            shelterId="wsd" shelterName="WSD"
            shelterTagline="Welfare of Stray Dogs"
            pets={wsdPets} loading={loading} error={error}
            onAdopt={(pet) => setSelected({ dog: pet, shelterId: "wsd", shelterName: "WSD" })}
          />
        </div>
      </div>

      <Closer />
      <Footer />

      {selected && (
        <AdoptModal
          dog={selected.dog} shelterId={selected.shelterId}
          shelterName={selected.shelterName} onClose={() => setSelected(null)}
        />
      )}
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────
   FIND A FRIEND HERO
   Mobile changes:
   • paddingTop reduced to 88px on mobile (header is shorter)
   • Top row: only dog1 + dog3 shown on mobile (dog2 hidden)
   • Bottom row: only dog4 shown on mobile (dog5+6 hidden)
   • Blob sizes scale down on mobile
   • Center text marginTop/Bottom adjusted for mobile
───────────────────────────────────────────────────────────── */
function FindAFriendHero() {
  const scrollToShelters = () =>
    document.getElementById("shelters")?.scrollIntoView({ behavior: "smooth" });

  return (
    <section style={{ backgroundColor: "#FBE8E8", position: "relative" }}>
      <style>{`
        @keyframes blobFloat {
          0%,100% { transform: translateY(0px);   }
          50%      { transform: translateY(-11px); }
        }
        .pf-b1 { animation: blobFloat 3.8s ease-in-out infinite 0.0s; }
        .pf-b2 { animation: blobFloat 4.3s ease-in-out infinite 0.7s; }
        .pf-b3 { animation: blobFloat 3.5s ease-in-out infinite 1.2s; }
        .pf-b4 { animation: blobFloat 4.6s ease-in-out infinite 0.4s; }
        .pf-b5 { animation: blobFloat 3.9s ease-in-out infinite 1.0s; }
        .pf-b6 { animation: blobFloat 4.1s ease-in-out infinite 1.6s; }
      `}</style>

      {/* ORGANIC LOOP SVG */}
      <svg
        aria-hidden="true"
        viewBox="0 0 1380 895"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
        style={{
          position: "absolute", inset: 0,
          width: "100%", height: "100%",
          pointerEvents: "none", zIndex: 1,
        }}
      >
        <path d="M 318,328 C 258,300 138,295 62,330 C 14,352 4,408 4,462 C 4,516 24,568 82,600 C 148,630 295,640 518,636 C 718,632 938,624 1088,632 C 1228,638 1308,622 1340,592 C 1370,562 1372,510 1370,458 C 1368,406 1350,352 1302,326 C 1252,298 1158,292 1068,322 C 948,350 726,356 318,328 Z"
          fill="none" stroke="#C4724A" strokeWidth="2" opacity="0.32" />
        <path d="M 332,316 C 272,286 148,280 68,316 C 16,340 6,398 6,454 C 6,512 28,566 90,600 C 158,632 308,644 535,640 C 738,636 955,628 1102,636 C 1244,644 1326,626 1356,594 C 1382,562 1382,508 1380,452 C 1378,396 1358,340 1308,312 C 1256,282 1162,276 1072,308 C 950,338 738,344 332,316 Z"
          fill="none" stroke="#C4724A" strokeWidth="1.7" opacity="0.20" />
        <path d="M 308,340 C 248,312 124,308 50,342 C 2,366 -6,422 -4,478 C -2,534 20,586 80,618 C 148,648 298,658 522,654 C 724,650 942,642 1092,650 C 1234,656 1316,640 1346,610 C 1374,580 1374,526 1372,472 C 1370,418 1352,362 1302,334 C 1250,304 1155,298 1065,330 C 944,360 730,366 308,340 Z"
          fill="none" stroke="#C4724A" strokeWidth="1.5" opacity="0.15" />
      </svg>

      <div
        className="max-w-[1380px] mx-auto px-4 md:px-6"
        style={{ paddingTop: "100px", position: "relative", zIndex: 2 }}
      >

        {/* ── TOP ROW ── */}
        <div className="flex items-end justify-between">

          {/* Dog 1 — always visible, smaller on mobile */}
          <div className="pf-b1" style={{ marginBottom: "0px" }}>
            <Blob img="/images/friend-dog-1.png" alt="Dog 1"
              color="#F0E6D3"
              wMobile={120} hMobile={112}
              wDesktop={200} hDesktop={186}
              shape="42% 58% 54% 46% / 46% 40% 60% 54%" />
          </div>

          {/* Dog 2 — hidden on mobile */}
          <div className="pf-b2 hidden md:block" style={{ marginBottom: "70px" }}>
            <Blob img="/images/friend-dog-2.png" alt="Dog 2"
              color="#F0E6D3"
              wMobile={228} hMobile={210}
              wDesktop={228} hDesktop={210}
              shape="52% 48% 42% 58% / 40% 56% 44% 60%" />
          </div>

          {/* Dog 3 — always visible, smaller on mobile */}
          <div className="pf-b3" style={{ marginBottom: "15px" }}>
            <Blob img="/images/friend-dog-3.png" alt="Dog 3"
              color="#F0E6D3"
              wMobile={120} hMobile={110}
              wDesktop={215} hDesktop={195}
              shape="56% 44% 40% 60% / 52% 46% 54% 48%" />
          </div>
        </div>

        {/* ── CENTER TEXT ── */}
        <div
          className="flex flex-col items-center text-center"
          style={{ marginTop: "-40px", marginBottom: "-10px", padding: "20px 20px 20px" }}
        >
          <h1
            className="text-[#6B1A1A] leading-none"
            style={{
              fontFamily: "var(--font-spartan)",
              fontSize: "clamp(42px, 7.8vw, 108px)",
              marginBottom: "16px",
            }}
          >
            Find a Friend
          </h1>

          <p
            className="text-[#6B1A1A]/70 leading-relaxed"
            style={{
              fontFamily: "var(--font-montserrat)",
              fontSize: "clamp(12px, 0.95vw, 14px)",
              maxWidth: "260px",
              marginBottom: "14px",
            }}
          >
            Every rescued paw here is waiting for warmth, care,
            and a family to finally call their own.
          </p>

          <button
            onClick={scrollToShelters}
            className="group relative overflow-hidden px-9 py-3 bg-[#6B1A1A] text-white text-xs tracking-[0.22em] uppercase rounded-full hover:bg-[#8E2323] hover:scale-[1.03] transition-all duration-300 cursor-pointer"
            style={{ fontFamily: "var(--font-spartan)" }}
          >
            <span className="relative z-10">Meet Them All</span>
            <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-[#E8A84C]/70 to-transparent skew-x-[-20deg] -translate-x-full group-hover:translate-x-[420%] group-active:translate-x-[420%] transition-transform duration-1000 ease-out" />
          </button>
        </div>

        {/* ── BOTTOM ROW ── */}
        <div className="flex items-start justify-between pb-10 md:pb-12"
          style={{ paddingLeft: "0px", paddingRight: "0px" }}>

          {/* Dog 4 — always visible, smaller on mobile */}
          <div className="pf-b4" style={{ marginTop: "20px" }}>
            <Blob img="/images/friend-dog-4.png" alt="Dog 4"
              color="#F0E6D3"
              wMobile={130} hMobile={108}
              wDesktop={238} hDesktop={198}
              shape="58% 42% 46% 54% / 50% 60% 40% 50%" />
          </div>

          {/* Dog 5 — hidden on mobile */}
          <div className="pf-b5 hidden md:block" style={{ marginTop: "0px" }}>
            <Blob img="/images/friend-dog-5.png" alt="Dog 5"
              color="#F0E6D3"
              wMobile={218} hMobile={204}
              wDesktop={218} hDesktop={204}
              shape="48% 52% 56% 44% / 42% 50% 50% 58%" />
          </div>

          {/* Dog 6 — always visible on mobile, smaller */}
          <div className="pf-b6" style={{ marginTop: "35px" }}>
            <Blob img="/images/friend-dog-6.png" alt="Dog 6"
              color="#F0E6D3"
              wMobile={118} hMobile={140}
              wDesktop={180} hDesktop={214}
              shape="44% 56% 52% 48% / 56% 44% 52% 48%" />
          </div>
        </div>

      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────
   BLOB — responsive sizes via wMobile/wDesktop props
   Uses CSS custom properties + media query via inline style trick
───────────────────────────────────────────────────────────── */
function Blob({ img, alt, color, wMobile, hMobile, wDesktop, hDesktop, shape }) {
  return (
    <>
      {/* Mobile blob */}
      <div
        className="md:hidden"
        style={{
          width: `${wMobile}px`, height: `${hMobile}px`,
          backgroundColor: color,
          borderRadius: shape,
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <img src={img} alt={alt} style={{
          position: "absolute", inset: "6px",
          width: "calc(100% - 12px)", height: "calc(100% - 12px)",
          objectFit: "contain",
        }} />
      </div>

      {/* Desktop blob */}
      <div
        className="hidden md:block"
        style={{
          width: `${wDesktop}px`, height: `${hDesktop}px`,
          backgroundColor: color,
          borderRadius: shape,
          overflow: "hidden",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <img src={img} alt={alt} style={{
          position: "absolute", inset: "8px",
          width: "calc(100% - 16px)", height: "calc(100% - 16px)",
          objectFit: "contain",
        }} />
      </div>
    </>
  );
}

/* ─────────────────────────────────────────────────────────────
   SHELTER SECTION
   Mobile: 1 card at a time (w-full, transform moves 100% per step)
   Desktop: 4 cards at a time (w-[calc(25%-24px)], moves 25% per step)
───────────────────────────────────────────────────────────── */
function ShelterSection({ shelterName, shelterTagline, pets, loading, error, onAdopt }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const visibleCards = isMobile ? 1 : 4;
  const maxIndex = Math.max(0, pets.length - visibleCards);
  const safeIndex = Math.min(currentIndex, maxIndex);

  // Reset index when switching between mobile/desktop


const translateAmount = isMobile
  ? `translateX(calc(-${safeIndex * 100}% - ${safeIndex * 32}px))`
  : `translateX(calc(-${safeIndex * 25}% - ${safeIndex * 8}px))`;

  return (
    <section className="py-24 md:py-32 px-6 overflow-hidden">
      <div className="max-w-[1700px] mx-auto">

        <div className="text-center mb-16 space-y-3">
          <h2 className="text-5xl md:text-6xl lg:text-7xl text-[#6B1A1A]"
            style={{ fontFamily: "var(--font-spartan)" }}>{shelterName}</h2>
          <p className="text-xs md:text-sm tracking-[0.25em] uppercase text-[#6B1A1A]/70"
            style={{ fontFamily: "var(--font-spartan)" }}>{shelterTagline}</p>
        </div>

        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1,2,3,4].map((i) => <PetCardSkeleton key={i} />)}
          </div>
        )}
        {!loading && error && (
          <p className="text-center text-[#6B1A1A]/80"
            style={{ fontFamily: "var(--font-montserrat)" }}>{error}</p>
        )}
        {!loading && !error && pets.length === 0 && (
          <p className="text-center italic text-[#6B1A1A]/70"
            style={{ fontFamily: "var(--font-montserrat)" }}>
            No pets currently listed from {shelterName}.
          </p>
        )}

        {!loading && !error && pets.length > 0 && (
          <div className="relative">

            {currentIndex > 0 && (
              <button
                onClick={() => setCurrentIndex(i => i - 1)}
                className="absolute left-[-22px] top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white shadow-xl border border-[#6B1A1A]/10 flex items-center justify-center hover:scale-110 hover:bg-[#6B1A1A] hover:text-white transition-all duration-300 cursor-pointer"
              >
                <span className="text-2xl">‹</span>
              </button>
            )}

            {currentIndex < maxIndex && (
              <button
                onClick={() => setCurrentIndex(i => i + 1)}
                className="absolute right-[-22px] top-1/2 -translate-y-1/2 z-20 w-14 h-14 rounded-full bg-white shadow-xl border border-[#6B1A1A]/10 flex items-center justify-center hover:scale-110 hover:bg-[#6B1A1A] hover:text-white transition-all duration-300 cursor-pointer"
              >
                <span className="text-2xl">›</span>
              </button>
            )}

            <div className="overflow-hidden">
              <div
                className="flex gap-8 transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{ transform: translateAmount }}
              >
                {pets.map((pet) => (
                  <article
                    key={pet.id}
                    className="flex-shrink-0 w-full md:w-[calc(25%-24px)] bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:-translate-y-3 hover:shadow-[0_25px_60px_rgba(107,26,26,0.18)] transition-all duration-500 cursor-pointer"
                    onClick={() => onAdopt(pet)}
                  >
                    <div className="relative h-[320px] md:h-[380px] overflow-hidden bg-[#FAF6EF]">
                      <img src={pet.image} alt={pet.name}
                        className="absolute inset-0 w-full h-full object-cover object-top hover:scale-110 transition-transform duration-700 ease-out" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#6B1A1A]/70 via-[#6B1A1A]/20 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500" />
                    </div>
                    <div className="p-7 space-y-5">
                      <h3 className="text-4xl text-[#6B1A1A] text-center"
                        style={{ fontFamily: "var(--font-spartan)" }}>{pet.name}</h3>
                      <button
                        className="group relative overflow-hidden w-full py-3.5 bg-[#6B1A1A] text-white tracking-[0.18em] text-sm uppercase rounded-full hover:bg-[#8E2323] hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                        style={{ fontFamily: "var(--font-spartan)" }}
                      >
                        <span className="relative z-10">Adopt Me!</span>
                        <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-[#E8A84C]/70 to-transparent skew-x-[-20deg] -translate-x-full group-hover:translate-x-[420%] group-active:translate-x-[420%] transition-transform duration-1000 ease-out" />
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </div>

            {pets.length > visibleCards && (
              <div className="flex justify-center mt-10 gap-3">
                {Array.from({ length: maxIndex + 1 }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      safeIndex === i ? "w-10 bg-[#6B1A1A]" : "w-2.5 bg-[#6B1A1A]/20"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

function PetCardSkeleton() {
  return (
    <div className="bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] animate-pulse">
      <div className="h-[320px] md:h-[380px] bg-[#6B1A1A]/10" />
      <div className="p-7 space-y-5">
        <div className="h-8 bg-[#6B1A1A]/10 rounded-full w-2/3 mx-auto" />
        <div className="h-12 bg-[#6B1A1A]/10 rounded-full" />
      </div>
    </div>
  );
}