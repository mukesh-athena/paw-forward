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
        const yodaQuery = query(
          collection(db, "dogs_yoda"),
          orderBy("addedAt", "desc")
        );

        const wsdQuery = query(
          collection(db, "dogs_wsd"),
          orderBy("addedAt", "desc")
        );

        const [yodaSnap, wsdSnap] = await Promise.all([
          getDocs(yodaQuery),
          getDocs(wsdQuery),
        ]);

        if (cancelled) return;

        setYodaPets(
          yodaSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );

        setWsdPets(
          wsdSnap.docs.map((d) => ({
            id: d.id,
            ...d.data(),
          }))
        );
      } catch (err) {
        console.error("Failed to load pets:", err);

        if (!cancelled) {
          setError("Couldn't load adoptable pets. Please refresh.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchPets();

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <main>
      <Header />

      {/* Hero Section */}
      <section
        className="relative pt-40 pb-32 md:pt-52 md:pb-40 px-6 overflow-hidden"
        style={{
          backgroundColor: "#F3BEBE",
          backgroundImage: "url('/images/dog-mouth-pattern.jpeg')",
          backgroundRepeat: "repeat-x",
          backgroundSize: "auto 75%",
          backgroundPosition: "left center",
        }}
      >
        <div className="absolute inset-0 bg-[#F3BEBE]/70" />

        <div className="relative max-w-5xl mx-auto text-center space-y-8">
          <h1
            className="text-5xl md:text-7xl lg:text-8xl text-[#6B1A1A] leading-tight animate-hero-rise"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Meet Mumbai&apos;s
            <br />
            Bravest Hearts
          </h1>

          <p
            className="text-lg md:text-xl text-[#6B1A1A]/85 leading-relaxed max-w-3xl mx-auto animate-fade-in"
            style={{
              fontFamily: "var(--font-montserrat)",
              animationDelay: "0.4s",
              animationFillMode: "both",
            }}
          >
            Every rescued paw here is waiting for warmth, care,
            and a family to finally call their own.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div
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
            shelterId="yoda"
            shelterName="YODA"
            shelterTagline="Youth Organisation in Defence of Animals"
            pets={yodaPets}
            loading={loading}
            error={error}
            onAdopt={(pet) =>
              setSelected({
                dog: pet,
                shelterId: "yoda",
                shelterName: "YODA",
              })
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
              setSelected({
                dog: pet,
                shelterId: "wsd",
                shelterName: "WSD",
              })
            }
          />
        </div>
      </div>

      <Closer />
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

function ShelterSection({
  shelterName,
  shelterTagline,
  pets,
  loading,
  error,
  onAdopt,
}) {
  return (
    <section className="py-24 md:py-32 px-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Heading */}
        <div className="text-center mb-16 space-y-3">
          <h2
            className="text-5xl md:text-6xl lg:text-7xl text-[#6B1A1A]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {shelterName}
          </h2>

          <p
            className="text-xs md:text-sm tracking-[0.25em] uppercase text-[#6B1A1A]/70"
            style={{ fontFamily: "var(--font-spartan)" }}
          >
            {shelterTagline}
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <PetCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <p
            className="text-center text-[#6B1A1A]/80"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {error}
          </p>
        )}

        {/* Empty */}
        {!loading && !error && pets.length === 0 && (
          <p
            className="text-center italic text-[#6B1A1A]/70"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            No pets currently listed from {shelterName}.
          </p>
        )}

        {/* Cards */}
        {!loading && !error && pets.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {pets.map((pet) => (
              <article
                key={pet.id}
                className="group bg-white rounded-3xl overflow-hidden shadow-[0_10px_40px_rgba(0,0,0,0.08)] hover:-translate-y-3 hover:shadow-[0_25px_60px_rgba(107,26,26,0.18)] transition-all duration-500"
              >
                {/* Image */}
                <div className="relative h-[380px] overflow-hidden bg-[#FAF6EF]">
                  <img
                    src={pet.image}
                    alt={pet.name}
                    className="absolute inset-0 w-full h-full object-cover object-top group-hover:scale-110 transition-transform duration-700 ease-out"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#6B1A1A]/70 via-[#6B1A1A]/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>

                {/* Content */}
                <div className="p-7 space-y-5">
                  <h3
                    className="text-4xl text-[#6B1A1A] text-center"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {pet.name}
                  </h3>

                  <button
                    onClick={() => onAdopt(pet)}
                    className="relative overflow-hidden w-full py-3.5 bg-[#6B1A1A] text-white tracking-[0.18em] text-sm uppercase rounded-full hover:bg-[#8E2323] hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                    style={{ fontFamily: "var(--font-spartan)" }}
                  >
                    <span className="relative z-10">Adopt Me!</span>

                    {/* Gold Sweep */}
                    <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-[#E8A84C]/70 to-transparent skew-x-[-20deg] -translate-x-full group-hover:translate-x-[420%] transition-transform duration-1000 ease-out" />
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
    <div className="bg-white rounded-3xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] animate-pulse">
      <div className="h-[380px] bg-[#6B1A1A]/10" />

      <div className="p-7 space-y-5">
        <div className="h-8 bg-[#6B1A1A]/10 rounded-full w-2/3 mx-auto" />

        <div className="h-12 bg-[#6B1A1A]/10 rounded-full" />
      </div>
    </div>
  );
}