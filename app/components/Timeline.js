"use client";

import { useEffect, useRef } from "react";

const milestones = [
  {
    year: "2019",
    title: "The Beginning",
    description:
      "Built an awareness campaign in Grade 5 on how to help stray animals during COVID-19, a time when strays were being left without food or care. Created a website and presented it to over 40 people, making the case that ordinary people could do something, even from home.",
    image: "/images/placeholder1.avif",
  },
  {
    year: "2021–2022",
    title: "YODA",
    description:
      "Volunteered at YODA Animal Shelter alongside two friends in Grade 8. Raised over ₹10,000 by selling our own paintings and donated all proceeds to the shelter. Helped 3 dogs find their forever homes. Organised a donation drive collecting over 20kg of newspapers, food, clothes, and animal supplies.",
    image: "/images/placeholder2.avif",
  },
  {
    year: "2024–2025",
    title: "WSD",
    description:
      "Volunteered at WSD Animal Shelter in Grade 10 and 11, walking, bathing, and feeding the dogs in their care. As part of IB CAS, created awareness posters and reels for World Rabies Day and the Adopt Don't Shop campaign to reach wider audiences online.",
    image: "/images/placeholder1.avif",
  },
  {
    year: "2026",
    title: "Paw Forward",
    description:
      "Founded Paw Forward, a city-wide adoption and sterilisation campaign for Mumbai's animals. Partnered with YODA, WSD, and the Brihanmumbai Municipal Corporation (BMC) to build something that goes beyond individual acts of care into real, systemic change.",
    image: "/images/placeholder2.avif",
  },
];

export default function Timeline() {
  const sectionRefs = useRef([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate-in");
          }
        });
      },
      { threshold: 0.2 }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <section className="bg-white py-24 md:py-32 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-20 space-y-4">
          <p
            className="text-sm tracking-[0.3em] text-[#6B1A1A]/70 uppercase"
            style={{ fontFamily: "var(--font-spartan)" }}
          >
            The Journey
          </p>
          <h2
            className="text-5xl md:text-6xl lg:text-7xl text-[#6B1A1A] leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            How It All Began
          </h2>
        </div>

        <div className="space-y-32">
          {milestones.map((milestone, index) => (
            <div
              key={milestone.year}
              ref={(el) => (sectionRefs.current[index] = el)}
              className={`timeline-item grid md:grid-cols-2 gap-12 md:gap-20 items-center transition-all duration-1000 ${
                index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
              }`}
            >
              <div className="space-y-4">
                <p
                  className="text-2xl md:text-3xl text-[#E8A84C]"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {milestone.year}
                </p>
                <h3
                  className="text-4xl md:text-5xl lg:text-6xl text-[#6B1A1A] leading-tight"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {milestone.title}
                </h3>
                <p
                  className="text-base md:text-lg text-[#6B1A1A]/85 leading-relaxed"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {milestone.description}
                </p>
              </div>
              <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm">
                <img
                  src={milestone.image}
                  alt={milestone.title}
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}