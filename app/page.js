import Header from "./components/Header";
import Timeline from "./components/Timeline";
import Partners from "./components/Partners";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <main>
      <Header transparentOnTop />

      {/* Hero Section */}
      <section className="relative h-screen w-full overflow-hidden">
        <video
          src="/videos/hero-dog.mp4"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
        <div className="relative z-10 flex h-full items-center justify-center px-4">
          <h1
            className="text-center text-5xl md:text-7xl lg:text-8xl text-white drop-shadow-lg"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            From Street to Safety to Home
          </h1>
        </div>
      </section>

      {/* About Section — cream */}
      <section className="bg-[#FAF6EF] py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          <div className="space-y-6">
            <p
              className="text-sm tracking-[0.3em] text-[#6B1A1A]/70 uppercase"
              style={{ fontFamily: "var(--font-spartan)" }}
            >
              About
            </p>
            <h2
              className="text-5xl md:text-6xl lg:text-7xl text-[#6B1A1A] leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Every Stray Has a Story
            </h2>
            <p
              className="text-base md:text-lg text-[#6B1A1A]/85 leading-relaxed"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              I have loved animals for as long as I can remember, long before it became a project or an initiative or something I could put on paper. Growing up with dogs taught me what unconditional love looks like, and seeing strays on the streets of Mumbai taught me what its absence looks like. I am Vipanshi Agarwal, a 17-year-old from Mumbai, and I started Paw Forward because I believe every animal deserves someone who chooses them.
            </p>
            <p
              className="text-base md:text-lg text-[#6B1A1A]/85 leading-relaxed"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              What began in Grade 5 as a small awareness campaign has grown into years of shelter volunteering, fundraising, adoption drives, and now a city-wide initiative to give Mumbai&apos;s strays a real shot at a home. Animals have given me more than I can explain — Paw Forward is my way of giving some of that back.
            </p>
          </div>
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
            <img
              src="/images/vipanshi.jpg"
              alt="Vipanshi Agarwal"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <Timeline />
      <Partners />
      <Footer />
    </main>
  );
}