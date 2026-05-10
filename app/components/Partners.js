export default function Partners() {
  const partners = [
    {
      name: "YODA",
      fullName: "Youth Organisation in Defence of Animals",
      logo: "/images/yoda-logo.png",
      description:
        "Paw Forward is partnering with YODA to run an adoption campaign for their shelter animals and organise donation drives to support their operations.",
    },

    {
      name: "WSD",
      fullName: "The Welfare of Stray Dogs",
      logo: "/images/wsd-logo.jpeg",
      description:
        "Paw Forward is partnering with WSD to run an adoption campaign for their shelter animals and coordinate sterilisation drives across local communities.",
    },

    {
      name: "BMC",
      fullName: "Brihanmumbai Municipal Corporation",
      logo: "/images/bmc-logo.jpeg",
      description:
        "Supporting large-scale city welfare, sterilisation awareness, and safer conditions for Mumbai's street animals.",
    },

    {
      name: "Pawdopt",
      fullName: "Pawdopt India",
      logo: "/images/pawdopt-logo.jpeg",
      description:
        "Helping connect rescued animals with caring adopters through modern adoption and awareness initiatives.",
    },
  ];

  return (
    <>
      {/* Banner */}
      <section className="relative w-full">
        <div
          className="relative w-full overflow-hidden bg-[#A6D8D4]"
          style={{ aspectRatio: "1200 / 422" }}
        >
          <img
            src="/images/partners-banner.avif"
            alt="Animals we love"
            className="absolute inset-0 w-full h-full object-contain object-center"
          />
        </div>

        {/* Pink Band */}
        <div className="bg-[#D89B9B] py-12 md:py-20 px-4">
          <h2
            className="text-center text-4xl md:text-6xl lg:text-7xl text-white drop-shadow-md"
            style={{ fontFamily: "var(--font-spartan)" }}
          >
            Partnering with Purpose
          </h2>
        </div>
      </section>

      {/* Partners Section */}
      <section className="bg-[#FAF6EF] py-20 md:py-28 px-6">
        <div className="max-w-[1700px] mx-auto">
          {/* Heading */}
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

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-10">
            {partners.map((partner) => (
              <div
                key={partner.name}
                className="
                  group
                  flex flex-col
                  items-center
                  text-center
                  rounded-[34px]
                  px-8
                  py-10
                  min-h-[620px]
                  bg-white/55
                  backdrop-blur-md
                  border border-white/40
                  shadow-[0_10px_40px_rgba(0,0,0,0.06)]
                  hover:-translate-y-3
                  hover:shadow-[0_25px_70px_rgba(107,26,26,0.12)]
                  transition-all
                  duration-500
                "
              >
                {/* Logo */}
                <div className="h-[180px] flex items-center justify-center mb-8">
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    className="
                      max-h-[140px]
                      max-w-[180px]
                      object-contain
                      transition-transform
                      duration-500
                      group-hover:scale-105
                    "
                  />
                </div>

                {/* Partner Name */}
                <div className="h-[170px] flex items-start justify-center">
                  <h3
                    className={`
                      text-[#6B1A1A]
                      leading-tight
                      ${
                        partner.name === "BMC"
                          ? "text-4xl"
                          : "text-3xl md:text-4xl"
                      }
                    `}
                    style={{ fontFamily: "var(--font-spartan)" }}
                  >
                    {partner.fullName}
                  </h3>
                </div>

                {/* Description */}
                <p
                  className="
                    text-base
                    md:text-lg
                    text-[#6B1A1A]/85
                    leading-relaxed
                    max-w-sm
                  "
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {partner.description}
                </p>

                {/* Bottom Accent */}
                <div className="mt-auto pt-10">
                  <div className="w-16 h-[2px] bg-[#E8A84C] rounded-full opacity-70 group-hover:w-24 transition-all duration-500" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
