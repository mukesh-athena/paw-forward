"use client";

import { useState, useEffect } from "react";
import Header from "../components/Header";
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
        const wsdQuery = query(collection(db, "dogs_wsd"), orderBy("addedAt", "desc"));

        const [yodaSnap, wsdSnap] = await Promise.all([
          getDocs(yodaQuery),
          getDocs(wsdQuery),
        ]);

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
      <Header />

      {/* Page hero — repeating dog-mouth pattern background */}
      <section
        className="relative pt-40 pb-32 md:pt-56 md:pb-44 px-6 overflow-hidden"
        style={{
          backgroundColor: "#F3BEBE",
          backgroundImage: "url('/images/dog-mouth-pattern.jpeg')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 75%",
          backgroundPosition: "left center",
        }}
      >
        <div className="absolute inset-0 bg-[#F3BEBE]/70" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <h1
            className="text-5xl md:text-7xl lg:text-8xl text-[#6B1A1A] leading-tight animate-hero-rise"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Meet Mumbai&apos;s Bravest Hearts
          </h1>
          <p
            className="text-base md:text-lg text-[#6B1A1A]/85 leading-relaxed max-w-2xl mx-auto animate-fade-in"
            style={{ fontFamily: "var(--font-montserrat)", animationDelay: "0.4s", animationFillMode: "both" }}
          >
            These are the pets currently looking for homes through our partner
            shelters. Find one who feels like family, and the shelter takes it
            from there.
          </p>
        </div>
      </section>

      {/* Wrapper for everything below the hero — single cream background with paw pattern */}
      <div
        className="relative"
        style={{
          backgroundColor: "#FAF6EF",
          backgroundImage: "url('/images/paw-pattern.jpg')",
          backgroundRepeat: "repeat",
          backgroundSize: "300px",
        }}
      >
        <div className="absolute inset-0 bg-[#FAF6EF]/88 pointer-events-none" />

        <div className="relative">
          <ShelterSection
            shelterId="yoda"
            shelterName="YODA"
            shelterTagline="Youth Organisation in Defence of Animals"
            pets={yodaPets}
            loading={loading}
            error={error}
            onAdopt={(pet) =>
              setSelected({ dog: pet, shelterId: "yoda", shelterName: "YODA" })
            }
          />

          <ShelterSection
            shelterId="wsd"
            shelterName="WSD"
            shelterTagline="Welfare of Stray Dogs"
            pets={wsdPets}
            loading={loading}
            error={error}
            onAdopt={(pet) =>
              setSelected({ dog: pet, shelterId: "wsd", shelterName: "WSD" })
            }
          />
        </div>
      </div>

      <Footer />

      {selected && (
        <AdoptModal
          dog={selected.dog}
          shelterId={selected.shelterId}
          shelterName={selected.shelterName}
          onClose={() => setSelected(null)}
        />
      )}
    </main>
  );
}

function ShelterSection({ shelterId, shelterName, shelterTagline, pets, loading, error, onAdopt }) {
  return (
    <section className="py-20 md:py-28 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Heading: name + tagline */}
        <div className="text-center mb-14 space-y-2">
          <h2
            className="text-4xl md:text-5xl lg:text-6xl text-[#6B1A1A] leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {shelterName}
          </h2>
          <p
            className="text-xs md:text-sm tracking-[0.2em] text-[#6B1A1A]/70 uppercase"
            style={{ fontFamily: "var(--font-spartan)" }}
          >
            {shelterTagline}
          </p>
        </div>

        {/* Loading skeletons */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {[1, 2, 3].map((i) => (
              <PetCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error state */}
        {!loading && error && (
          <p
            className="text-center text-[#6B1A1A]/80"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {error}
          </p>
        )}

        {/* Empty state */}
        {!loading && !error && pets.length === 0 && (
          <p
            className="text-center text-[#6B1A1A]/70 italic"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            No pets currently listed from {shelterName}. Check back soon.
          </p>
        )}

        {/* Pet cards */}
        {!loading && !error && pets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-10">
            {pets.map((pet) => (
              <article
                key={pet.id}
                className="group rounded-sm overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 bg-white"
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-[#FAF6EF]">
                 <img
  src={pet.image}
  alt={`${pet.name} — adoptable pet at ${shelterName}`}
  className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
/>
                </div>
                <div className="p-6 space-y-4">
                  <h3
                    className="text-3xl text-[#6B1A1A] text-center"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {pet.name}
                  </h3>
                  <button
                    onClick={() => onAdopt(pet)}
                    className="w-full py-3 bg-[#6B1A1A] text-white tracking-wider text-sm uppercase rounded-full hover:bg-[#8a2424] hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                    style={{ fontFamily: "var(--font-spartan)" }}
                  >
                    Adopt Me!
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function PetCardSkeleton() {
  return (
    <div className="rounded-sm overflow-hidden shadow-sm bg-white animate-pulse">
      <div className="aspect-[4/5] bg-[#6B1A1A]/10" />
      <div className="p-6 space-y-4">
        <div className="h-8 bg-[#6B1A1A]/10 rounded w-2/3 mx-auto" />
        <div className="h-12 bg-[#6B1A1A]/10 rounded-full" />
      </div>
    </div>
  );
}