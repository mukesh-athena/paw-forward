export default function Partners() {
  const partners = [
    {
      name: "YODA",
      fullName: "Youth Organisation in Defence of Animals",
      logo: "/images/yoda-logo.png",
      description:
        "Providing specialized medical oversight and rehabilitation for vulnerable street puppies across Mumbai.",
    },
    {
      name: "WSD",
      fullName: "Welfare of Stray Dogs",
      logo: "/images/wsd-logo.jpeg",
      description:
        "Our primary partner for emergency field rescues and community-driven sterilization programs in the city.",
    },
  ];

  return (
    <>
      {/* Banner with dogs/cats peeking up + pink band */}
      <section className="relative w-full">
        {/* Image area — fixed heights so it stays a strip, doesn't blow up */}
        <div className="relative w-full h-[200px] sm:h-[260px] md:h-[320px] lg:h-[380px] overflow-hidden">
          <img
            src="/images/partners-banner.avif"
            alt="Animals we love"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
        </div>

        {/* Pink band sits BELOW the image, matches Vipanshi's Wix layout */}
        <div className="bg-[#D89B9B] py-12 md:py-20 px-4">
          <h2
            className="text-center text-4xl md:text-6xl lg:text-7xl text-white drop-shadow-md"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Partnering with Purpose
          </h2>
        </div>
      </section>

      {/* Partners detail section */}
      <section className="bg-[#FAF6EF] py-24 md:py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16 space-y-4">
            <p
              className="text-sm tracking-[0.3em] text-[#6B1A1A]/70 uppercase"
              style={{ fontFamily: "var(--font-spartan)" }}
            >
              Together We Rise
            </p>
            <p
              className="text-base md:text-lg text-[#6B1A1A]/85 max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Building a kinder Mumbai with the people doing the real work.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 md:gap-20 max-w-5xl mx-auto">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="group flex flex-col items-center text-center space-y-6 p-8 rounded-lg transition-all duration-500 hover:bg-white/60"
              >
                <div className="relative w-40 h-40 flex items-center justify-center">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="space-y-2">
                  <h3
                    className="text-3xl md:text-4xl text-[#6B1A1A]"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {partner.fullName}
                  </h3>
                </div>
                <p
                  className="text-base md:text-lg text-[#6B1A1A]/85 leading-relaxed max-w-md"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}