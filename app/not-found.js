import Link from "next/link";
import Header from "./components/Header";
import Footer from "./components/Footer";

export default function NotFound() {
  return (
    <main
      className="min-h-screen relative flex flex-col"
      style={{
        backgroundColor: "#FAF6EF",
        backgroundImage: "url('/images/paw-pattern.jpg')",
        backgroundRepeat: "repeat",
        backgroundSize: "300px",
      }}
    >
      <div className="absolute inset-0 bg-[#FAF6EF]/88 pointer-events-none" />

      <div className="relative flex flex-col flex-1">
        <Header />

        <section className="flex-1 flex items-center justify-center px-6 py-32">
          <div className="text-center max-w-2xl mx-auto space-y-6 animate-fade-in">
            <div className="text-7xl md:text-8xl animate-bounce-slow inline-block">🐾</div>

            <h1
              className="text-7xl md:text-8xl lg:text-9xl text-[#6B1A1A] leading-none"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              404
            </h1>

            <h2
              className="text-3xl md:text-4xl text-[#6B1A1A] leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              This pup wandered off
            </h2>

            <p
              className="text-base md:text-lg text-[#6B1A1A]/80 leading-relaxed max-w-md mx-auto"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              The page you&apos;re looking for doesn&apos;t exist or has moved.
              Let&apos;s get you back home.
            </p>

            <div className="pt-4">
              <Link
                href="/"
                className="inline-block px-10 py-4 bg-[#6B1A1A] text-white tracking-wider text-sm uppercase rounded-full hover:bg-[#8a2424] hover:scale-[1.02] transition-all duration-300"
                style={{ fontFamily: "var(--font-spartan)" }}
              >
                Take me home
              </Link>
            </div>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}