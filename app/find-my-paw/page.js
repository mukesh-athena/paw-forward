"use client";

import { useState, useEffect, useRef } from "react";
import confetti from "canvas-confetti";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AdoptModal from "../components/AdoptModal";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { quizQuestions, findBestMatch } from "../data/quiz";

export default function FindMyPaw() {
  const [stage, setStage] = useState("intro"); // intro | landing | quiz | loading | result | nomatch
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [matchedAnimal, setMatchedAnimal] = useState(null);
  const [showAdoptModal, setShowAdoptModal] = useState(false);
  const [animals, setAnimals] = useState([]);
  const [animalsLoading, setAnimalsLoading] = useState(true);
  const [animalsError, setAnimalsError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    async function fetchAnimals() {
      try {
        const [yodaSnap, wsdSnap] = await Promise.all([
          getDocs(collection(db, "dogs_yoda")),
          getDocs(collection(db, "dogs_wsd")),
        ]);
        if (cancelled) return;
        const yodaAnimals = yodaSnap.docs.map((d) => ({ id: d.id, shelterId: "yoda", shelterName: "YODA", ...d.data() }));
        const wsdAnimals  = wsdSnap.docs.map((d) => ({ id: d.id, shelterId: "wsd",  shelterName: "WSD",  ...d.data() }));
        const usable = [...yodaAnimals, ...wsdAnimals].filter((a) => a.tags && a.tags.type);
        setAnimals(usable);
      } catch (err) {
        console.error("Failed to load animals for quiz:", err);
        if (!cancelled) setAnimalsError("Couldn't load the quiz. Please refresh.");
      } finally {
        if (!cancelled) setAnimalsLoading(false);
      }
    }
    fetchAnimals();
    return () => { cancelled = true; };
  }, []);

  const startQuiz = () => {
    setAnswers({});
    setQuestionIndex(0);
    setStage("quiz");
  };

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    if (questionIndex < quizQuestions.length - 1) {
      setQuestionIndex(questionIndex + 1);
    } else {
      setStage("loading");
      setTimeout(() => {
        const best = findBestMatch(newAnswers, animals);
        if (best) {
          setMatchedAnimal(best);
          setStage("result");
          const duration = 2000;
          const end = Date.now() + duration;
          (function frame() {
            confetti({ particleCount: 4, angle: 60,  spread: 55, origin: { x: 0 }, colors: ["#6B1A1A", "#E8A84C", "#F3BEBE"] });
            confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: ["#6B1A1A", "#E8A84C", "#F3BEBE"] });
            if (Date.now() < end) requestAnimationFrame(frame);
          })();
        } else {
          setStage("nomatch");
        }
      }, 2500);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setQuestionIndex(0);
    setMatchedAnimal(null);
    setStage("intro");
  };

  return (
    <main
      className="min-h-screen relative flex flex-col"
      style={{
        backgroundColor: "#F3BEBE",
        backgroundImage: "url('/images/paw-pattern.jpg')",
        backgroundRepeat: "repeat",
        backgroundSize: "300px",
      }}
    >
      <div className="absolute inset-0 bg-[#F3BEBE]/85 pointer-events-none" />
      <div className="relative flex flex-col flex-1">
        <Header />

        {/* ── ANIMATED INTRO ── */}
        {stage === "intro" && (
          <PawIntro onComplete={startQuiz} />
        )}

        {/* ── QUIZ / RESULTS ── */}
        {stage !== "intro" && (
          <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-6 flex-1 flex items-center">
            <div className="max-w-3xl mx-auto w-full">
              {animalsLoading && <Loading text="Loading the pets..." />}
              {!animalsLoading && animalsError && (
                <div className="text-center py-20">
                  <p className="text-[#6B1A1A] text-lg" style={{ fontFamily: "var(--font-montserrat)" }}>{animalsError}</p>
                </div>
              )}
              {stage === "quiz" && (
                <Question
                  question={quizQuestions[questionIndex]}
                  questionIndex={questionIndex}
                  total={quizQuestions.length}
                  onAnswer={handleAnswer}
                />
              )}
              {stage === "loading" && <Loading text="Sniffing out your perfect match..." />}
              {stage === "result" && matchedAnimal && (
                <Result animal={matchedAnimal} onAdopt={() => setShowAdoptModal(true)} onTryAgain={resetQuiz} />
              )}
              {stage === "nomatch" && <NoMatch onTryAgain={resetQuiz} />}
            </div>
          </section>
        )}

        <Footer />
      </div>

      {showAdoptModal && matchedAnimal && (
        <AdoptModal
          dog={{ id: matchedAnimal.id, name: matchedAnimal.name, image: matchedAnimal.image || "/images/paw-logo.png" }}
          shelterId={matchedAnimal.shelterId}
          shelterName={matchedAnimal.shelterName}
          onClose={() => setShowAdoptModal(false)}
        />
      )}
    </main>
  );
}

/* ─────────────────────────────────────────────────────────────
   PAW INTRO — auto-timed animation sequence
   
   Timeline:
   0.0s  — paw outline starts drawing (CSS animation on strokeDashoffset)
   1.5s  — "Your perfect match is out there" fades in
   2.8s  — paw fill fades in
   3.5s  — "Every paw tells a story" fades in
   4.5s  — "Let's find yours" fades in  
   5.2s  — "Find My Paw →" button appears
   
   User can also click "Skip" at any time to go straight to quiz.
───────────────────────────────────────────────────────────── */
function PawIntro({ onComplete }) {
  const [tick, setTick] = useState(0); // ms elapsed

  useEffect(() => {
    const start = Date.now();
    const interval = setInterval(() => {
      setTick(Date.now() - start);
    }, 16); // ~60fps
    return () => clearInterval(interval);
  }, []);

  const t = tick / 1000; // seconds elapsed

  // Paw draw: 0→1 over 0s–2.2s
const pawDraw = Math.min(1, t / 1.2);
const fillOpacity = Math.min(0.18, Math.max(0, (t - 1.4) / 0.4) * 0.18);
const text1 = Math.min(1, Math.max(0, (t - 0.8) / 0.3));
const text2 = Math.min(1, Math.max(0, (t - 1.8) / 0.3));
const text3 = Math.min(1, Math.max(0, (t - 2.4) / 0.3));
const ctaVis = Math.min(1, Math.max(0, (t - 2.9) / 0.4));

  // Paw paths
  const pads = [
    // Main pad
    { d: "M 200,310 C 155,310 120,280 120,245 C 120,200 155,168 200,168 C 245,168 280,200 280,245 C 280,280 245,310 200,310 Z", len: 520, delay: 0 },
    // Toe top-left
    { d: "M 118,148 C 100,148 86,136 86,122 C 86,106 100,94 118,94 C 136,94 150,106 150,122 C 150,136 136,148 118,148 Z", len: 240, delay: 0.22 },
    // Toe top-center-left
    { d: "M 170,112 C 155,112 143,100 143,86 C 143,71 155,60 170,60 C 185,60 197,71 197,86 C 197,100 185,112 170,112 Z", len: 220, delay: 0.38 },
    // Toe top-center-right
    { d: "M 230,112 C 215,112 203,100 203,86 C 203,71 215,60 230,60 C 245,60 257,71 257,86 C 257,100 245,112 230,112 Z", len: 220, delay: 0.54 },
    // Toe top-right
    { d: "M 282,148 C 264,148 250,136 250,122 C 250,106 264,94 282,94 C 300,94 314,106 314,122 C 314,136 300,148 282,148 Z", len: 240, delay: 0.70 },
  ];

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center"
      style={{
        backgroundColor: "#F3BEBE",
        backgroundImage: "url('/images/paw-pattern.jpg')",
        backgroundRepeat: "repeat",
        backgroundSize: "300px",
      }}
    >
      <div className="absolute inset-0 bg-[#F3BEBE]/85 pointer-events-none" />

      {/* Skip button */}
      <button
        onClick={onComplete}
        className="absolute top-24 right-6 z-50 text-xs tracking-[0.2em] uppercase text-[#6B1A1A]/50 hover:text-[#6B1A1A] transition-colors cursor-pointer"
        style={{ fontFamily: "var(--font-spartan)" }}
      >
        Skip →
      </button>

      {/* Expanding bg glow */}
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width:  `${200 + pawDraw * 400}px`,
          height: `${200 + pawDraw * 400}px`,
          background: "radial-gradient(circle, rgba(107,26,26,0.07) 0%, transparent 70%)",
          left: "50%", top: "50%",
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Text 1 — top */}
      <p
        className="absolute text-sm md:text-lg tracking-[0.3em] uppercase text-[#6B1A1A]"
        style={{
          fontFamily: "var(--font-spartan)",
          top: "20%",
          opacity: text1,
          transform: `translateY(${(1 - text1) * 14}px)`,
        }}
      >
        Your perfect match is out there
      </p>

      {/* Paw SVG */}
      <div style={{ transform: `scale(${0.85 + pawDraw * 0.15})` }}>
        <svg viewBox="0 0 400 370" width="320" height="296" fill="none" xmlns="http://www.w3.org/2000/svg">
          {pads.map((pad, i) => {
            // Each pad draws in after its delay, duration = 0.8s each
            const padProgress = Math.min(1, Math.max(0, (t - pad.delay) / 0.45));
            const offset = pad.len * (1 - padProgress);
            return (
              <g key={i}>
                {/* Fill */}
                <path d={pad.d} fill="#6B1A1A" opacity={fillOpacity} />
                {/* Stroke — draws in */}
                <path
                  d={pad.d}
                  stroke="#6B1A1A"
                  strokeWidth={i === 0 ? "4" : "3"}
                  strokeLinecap="round"
                  fill="none"
                  strokeDasharray={pad.len}
                  strokeDashoffset={offset}
                />
              </g>
            );
          })}
        </svg>
      </div>

      {/* Text 2 */}
      <p
        className="absolute text-sm md:text-base tracking-[0.25em] uppercase text-[#6B1A1A]/90"
        style={{
          fontFamily: "var(--font-spartan)",
          bottom: "28%",
          opacity: text2,
          transform: `translateY(${(1 - text2) * 10}px)`,
        }}
      >
        Every paw tells a story
      </p>

      {/* Text 3 */}
      <p
        className="absolute text-sm md:text-base tracking-[0.25em] uppercase text-[#6B1A1A]/90"
        style={{
          fontFamily: "var(--font-spartan)",
          bottom: "21%",
          opacity: text3,
          transform: `translateY(${(1 - text3) * 10}px)`,
        }}
      >
        Let&apos;s find yours
      </p>

      {/* CTA */}
      <div
        className="absolute"
        style={{
          bottom: "8%",
          opacity: ctaVis,
          transform: `translateY(${(1 - ctaVis) * 16}px)`,
          pointerEvents: ctaVis > 0.5 ? "auto" : "none",
        }}
      >
        <button
          onClick={onComplete}
          className="group relative overflow-hidden px-12 py-4 bg-[#6B1A1A] text-white tracking-wider text-sm uppercase rounded-full hover:bg-[#8a2424] hover:scale-105 transition-all duration-300 cursor-pointer"
          style={{ fontFamily: "var(--font-spartan)" }}
        >
          <span className="relative z-10">Find My Paw →</span>
          <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-[#E8A84C]/70 to-transparent skew-x-[-20deg] -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000 ease-out" />
        </button>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   All original components — unchanged
───────────────────────────────────────────────────────────── */

function Question({ question, questionIndex, total, onAnswer }) {
  const progress = ((questionIndex + 1) / total) * 100;
  return (
    <div className="space-y-10 animate-fade-in" key={question.id}>
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-[#6B1A1A]/70 tracking-wider">
          <span style={{ fontFamily: "var(--font-spartan)" }}>Question {questionIndex + 1} of {total}</span>
        </div>
        <div className="w-full h-1.5 bg-[#6B1A1A]/20 rounded-full overflow-hidden">
          <div className="h-full bg-[#6B1A1A] transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <h2 className="text-3xl md:text-4xl lg:text-5xl text-[#6B1A1A] text-center leading-tight" style={{ fontFamily: "var(--font-spartan)" }}>
        {question.question}
      </h2>
      <div className="space-y-4 max-w-md mx-auto">
        {question.options.map((option) => (
          <button
            key={option.value}
            onClick={() => onAnswer(question.id, option.value)}
            className="w-full px-6 py-4 bg-[#6B1A1A] text-white rounded-full hover:bg-[#8a2424] hover:scale-[1.02] transition-all duration-200 cursor-pointer"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Loading({ text }) {
  return (
    <div className="text-center space-y-6 py-20">
      <div className="text-7xl animate-bounce-slow inline-block">🐾</div>
      <p className="text-2xl md:text-3xl text-[#6B1A1A] animate-pulse" style={{ fontFamily: "var(--font-spartan)" }}>{text}</p>
    </div>
  );
}

function NoMatch({ onTryAgain }) {
  return (
    <div className="text-center space-y-6 animate-fade-in py-12">
      <div className="text-7xl">🐾</div>
      <h2 className="text-3xl md:text-4xl text-[#6B1A1A]" style={{ fontFamily: "var(--font-spartan)" }}>No matching pets right now</h2>
      <p className="text-base md:text-lg text-[#6B1A1A]/85 max-w-lg mx-auto leading-relaxed" style={{ fontFamily: "var(--font-montserrat)" }}>
        We don&apos;t have a pet that fits your preferences at the moment. Check back soon — new friends arrive often!
      </p>
      <button onClick={onTryAgain} className="mt-4 px-10 py-4 border-2 border-[#6B1A1A] text-[#6B1A1A] tracking-wider text-sm uppercase rounded-full hover:bg-[#6B1A1A] hover:text-white transition-all duration-300 cursor-pointer" style={{ fontFamily: "var(--font-spartan)" }}>
        Try Again
      </button>
    </div>
  );
}

function Result({ animal, onAdopt, onTryAgain }) {
  return (
    <div className="text-center space-y-6 animate-fade-in">
      <p className="text-sm tracking-[0.3em] text-[#6B1A1A]/70 uppercase" style={{ fontFamily: "var(--font-spartan)" }}>Meet Your Match</p>
      <div className="w-48 h-48 md:w-56 md:h-56 mx-auto rounded-full bg-[#FAF6EF] border-4 border-[#6B1A1A] flex items-center justify-center overflow-hidden animate-pop-in">
        {animal.image ? (
          <img src={animal.image} alt={animal.name} className="w-full h-full object-cover object-top" />
        ) : (
          <span className="text-8xl">🐾</span>
        )}
      </div>
      <h2 className="text-5xl md:text-6xl text-[#6B1A1A]" style={{ fontFamily: "var(--font-spartan)" }}>{animal.name}</h2>
      {(animal.breed || animal.age || animal.gender) && (
        <p className="text-base md:text-lg text-[#6B1A1A]/80" style={{ fontFamily: "var(--font-montserrat)" }}>
          {[animal.breed, animal.age, animal.gender].filter(Boolean).join(" · ")}
        </p>
      )}
      {animal.tags && (
        <div className="flex flex-wrap justify-center gap-2">
          {[animal.tags.energy, animal.tags.size, animal.tags.type].filter(Boolean).map((tag) => (
            <span key={tag} className="px-4 py-1.5 bg-[#6B1A1A]/10 text-[#6B1A1A] rounded-full text-xs tracking-wider uppercase" style={{ fontFamily: "var(--font-spartan)" }}>
              {tag.replace("-", " ")}
            </span>
          ))}
        </div>
      )}
      {animal.description && (
        <p className="text-base md:text-lg text-[#6B1A1A]/85 max-w-lg mx-auto leading-relaxed pt-2" style={{ fontFamily: "var(--font-montserrat)" }}>{animal.description}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <button onClick={onAdopt} className="group relative overflow-hidden px-10 py-4 bg-[#6B1A1A] text-white tracking-wider text-sm uppercase rounded-full hover:bg-[#8a2424] hover:scale-105 transition-all duration-300 cursor-pointer" style={{ fontFamily: "var(--font-spartan)" }}>
          <span className="relative z-10">Adopt Me!</span>
          <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-[#E8A84C]/70 to-transparent skew-x-[-20deg] -translate-x-full group-hover:translate-x-[400%] transition-transform duration-1000 ease-out" aria-hidden="true" />
        </button>
        <button onClick={onTryAgain} className="px-10 py-4 border-2 border-[#6B1A1A] text-[#6B1A1A] tracking-wider text-sm uppercase rounded-full hover:bg-[#6B1A1A] hover:text-white transition-all duration-300 cursor-pointer" style={{ fontFamily: "var(--font-spartan)" }}>
          Try Again
        </button>
      </div>
    </div>
  );
}