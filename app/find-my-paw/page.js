"use client";

import { useState } from "react";
import confetti from "canvas-confetti";
import Header from "../components/Header";
import Footer from "../components/Footer";
import AdoptModal from "../components/AdoptModal";
import { animals } from "../data/animals";
import { quizQuestions, findBestMatch } from "../data/quiz";

export default function FindMyPaw() {
  const [stage, setStage] = useState("landing"); // landing | quiz | loading | result
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [matchedAnimal, setMatchedAnimal] = useState(null);
  const [showAdoptModal, setShowAdoptModal] = useState(false);

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
      // last question answered — go to loading then match
      setStage("loading");
      setTimeout(() => {
        const best = findBestMatch(newAnswers, animals);
        setMatchedAnimal(best);
        setStage("result");
        // confetti burst
        const duration = 2000;
        const end = Date.now() + duration;
        (function frame() {
          confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ["#6B1A1A", "#E8A84C", "#F3BEBE"],
          });
          confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ["#6B1A1A", "#E8A84C", "#F3BEBE"],
          });
          if (Date.now() < end) requestAnimationFrame(frame);
        })();
      }, 2500);
    }
  };

  const resetQuiz = () => {
    setAnswers({});
    setQuestionIndex(0);
    setMatchedAnimal(null);
    setStage("landing");
  };

  return (
    <main
      className="min-h-screen relative"
      style={{
        backgroundColor: "#E8A84C",
        backgroundImage: "url('/images/paw-pattern.jpg')",
        backgroundRepeat: "repeat",
        backgroundSize: "300px",
      }}
    >
      {/* Gold wash so pattern stays subtle and text readable */}
      <div className="absolute inset-0 bg-[#E8A84C]/88 pointer-events-none" />

      <div className="relative">
        <Header />

        <section className="pt-32 pb-20 md:pt-40 md:pb-28 px-6">
          <div className="max-w-3xl mx-auto">
            {stage === "landing" && <Landing onStart={startQuiz} />}
            {stage === "quiz" && (
              <Question
                question={quizQuestions[questionIndex]}
                questionIndex={questionIndex}
                total={quizQuestions.length}
                onAnswer={handleAnswer}
              />
            )}
            {stage === "loading" && <Loading />}
            {stage === "result" && matchedAnimal && (
              <Result
                animal={matchedAnimal}
                onAdopt={() => setShowAdoptModal(true)}
                onTryAgain={resetQuiz}
              />
            )}
          </div>
        </section>

        <Footer />
      </div>

      {showAdoptModal && matchedAnimal && (
        <AdoptModal
          dog={{
            id: matchedAnimal.id,
            name: matchedAnimal.name,
            image: matchedAnimal.image || "/images/paw-logo.png",
          }}
          shelterId={matchedAnimal.shelterId}
          shelterName={matchedAnimal.shelterName}
          onClose={() => setShowAdoptModal(false)}
        />
      )}
    </main>
  );
}

function Landing({ onStart }) {
  return (
    <div className="text-center space-y-8 animate-fade-in">
      <div className="text-7xl md:text-8xl animate-bounce-slow">🐾</div>
      <h1
        className="text-5xl md:text-6xl lg:text-7xl text-white leading-tight animate-zoom-in"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Find Your Perfect Match
      </h1>
      <p
        className="text-base md:text-lg text-white/90 max-w-xl mx-auto leading-relaxed"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        Answer 10 quick questions and we&apos;ll find the furry companion who fits
        right into your life.
      </p>
      <button
        onClick={onStart}
        className="mt-4 px-12 py-4 bg-[#6B1A1A] text-white tracking-wider text-sm uppercase rounded-full hover:bg-[#8a2424] hover:scale-105 transition-all duration-300 cursor-pointer"
        style={{ fontFamily: "var(--font-spartan)" }}
      >
        Start Your Quiz
      </button>
    </div>
  );
}

function Question({ question, questionIndex, total, onAnswer }) {
  const progress = ((questionIndex + 1) / total) * 100;

  return (
    <div className="space-y-10 animate-fade-in" key={question.id}>
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-white/80 tracking-wider">
          <span style={{ fontFamily: "var(--font-spartan)" }}>
            Question {questionIndex + 1} of {total}
          </span>
        </div>
        <div className="w-full h-1.5 bg-white/30 rounded-full overflow-hidden">
          <div
            className="h-full bg-[#6B1A1A] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <h2
        className="text-3xl md:text-4xl lg:text-5xl text-[#6B1A1A] text-center leading-tight"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
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

function Loading() {
  return (
    <div className="text-center space-y-6 py-20">
      <div className="text-7xl animate-bounce-slow inline-block">🐾</div>
      <p
        className="text-2xl md:text-3xl text-[#6B1A1A] animate-pulse"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        Sniffing out your perfect match...
      </p>
    </div>
  );
}

function Result({ animal, onAdopt, onTryAgain }) {
  return (
    <div className="text-center space-y-6 animate-fade-in">
      <p
        className="text-sm tracking-[0.3em] text-white/80 uppercase"
        style={{ fontFamily: "var(--font-spartan)" }}
      >
        Meet Your Match
      </p>

      {/* Animal portrait */}
      <div className="w-48 h-48 md:w-56 md:h-56 mx-auto rounded-full bg-[#FAF6EF] border-4 border-[#6B1A1A] flex items-center justify-center overflow-hidden animate-pop-in">
        {animal.image ? (
          <img src={animal.image} alt={animal.name} className="w-full h-full object-cover" />
        ) : (
          <span className="text-8xl">{animal.emoji}</span>
        )}
      </div>

      <h2
        className="text-5xl md:text-6xl text-[#6B1A1A]"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {animal.name}
      </h2>
      <p
        className="text-base md:text-lg text-[#6B1A1A]/80"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {animal.breed} · {animal.age} · {animal.gender}
      </p>

      {/* Tag pills */}
      <div className="flex flex-wrap justify-center gap-2">
        {[animal.tags.energy, animal.tags.size, animal.tags.type].map((tag) => (
          <span
            key={tag}
            className="px-4 py-1.5 bg-[#6B1A1A]/10 text-[#6B1A1A] rounded-full text-xs tracking-wider uppercase"
            style={{ fontFamily: "var(--font-spartan)" }}
          >
            {tag.replace("-", " ")}
          </span>
        ))}
      </div>

      <p
        className="text-base md:text-lg text-[#6B1A1A]/85 max-w-lg mx-auto leading-relaxed pt-2"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {animal.description}
      </p>

      <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
        <button
          onClick={onAdopt}
          className="px-10 py-4 bg-[#6B1A1A] text-white tracking-wider text-sm uppercase rounded-full hover:bg-[#8a2424] hover:scale-105 transition-all duration-300 cursor-pointer"
          style={{ fontFamily: "var(--font-spartan)" }}
        >
          Adopt Me!
        </button>
        <button
          onClick={onTryAgain}
          className="px-10 py-4 border-2 border-[#6B1A1A] text-[#6B1A1A] tracking-wider text-sm uppercase rounded-full hover:bg-[#6B1A1A] hover:text-white transition-all duration-300 cursor-pointer"
          style={{ fontFamily: "var(--font-spartan)" }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
}