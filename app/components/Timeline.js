"use client";

import { useEffect, useRef, useState } from "react";

const milestones = [
  {
    year: "2019",
    title: "The Beginning",
    description:
      "Built an awareness campaign in Grade 5 on how to help stray animals during COVID-19, a time when strays were being left without food or care. Created a website and presented it to over 40 people, making the case that ordinary people could do something, even from home.",
    images: [{ src: "/images/timeline-2019.png", aspect: "1300 / 600" }],
  },

  {
    year: "2021–2022",
    title: "YODA",
    description:
      "Volunteered at YODA Animal Shelter alongside two friends in Grade 8. Raised over ₹10,000 by selling our own paintings and donated all proceeds to the shelter. Helped 3 dogs find their forever homes. Organised a donation drive collecting over 20kg of newspapers, food, clothes, and animal supplies.",
    images: [
      { src: "/images/timeline-2021-photo.jpeg", aspect: "768 / 1024" },
      { src: "/images/timeline-2021-certificate.jpeg", aspect: "659 / 469" },
    ],
  },

  {
    year: "2024–2025",
    title: "WSD",
    description:
      "Volunteered at WSD Animal Shelter in Grade 10 and 11, walking, bathing, and feeding the dogs in their care. As part of IB CAS, created awareness posters and reels for World Rabies Day and the Adopt Don't Shop campaign to reach wider audiences online.",
    images: [{ src: "/images/timeline-2024.jpeg", aspect: "960 / 1280" }],
  },

  {
    year: "2026",
    title: "Paw Forward",
    description:
      "Founded Paw Forward, a city-wide adoption and sterilisation campaign for Mumbai's animals. Partnered with YODA, WSD, and the Brihanmumbai Municipal Corporation (BMC) to build something that goes beyond individual acts of care into real, systemic change.",
    images: [{ src: "/images/timeline-2026.jpeg", aspect: "1 / 1" }],
  },
];

function Milestone({ milestone, index }) {
  const itemRef = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = itemRef.current;
    if (!node) return;

    if (typeof IntersectionObserver === "undefined") {
      queueMicrotask(() => setVisible(true));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      {
        threshold: 0.15,
        rootMargin: "0px 0px -10% 0px",
      }
    );

    observer.observe(node);

    return () => observer.disconnect();
  }, []);

  const sectionColors = [
    "#FAF6EF",
    "#FDF1EE",
    "#F8EFE3",
    "#FFF6ED",
  ];

  return (
    <div
      ref={itemRef}
      className={`timeline-item rounded-[2.5rem] px-8 py-10 md:px-14 md:py-16 shadow-[0_10px_40px_rgba(0,0,0,0.04)] grid md:grid-cols-2 gap-12 md:gap-20 items-center transition-all duration-1000 ${
        index % 2 === 1 ? "md:[&>*:first-child]:order-2" : ""
      } ${visible ? "animate-in" : ""}`}
      style={{
        backgroundColor: sectionColors[index],
      }}
    >
      <div className="space-y-5">
        <p
          className="text-2xl md:text-3xl text-[#E8A84C]"
          style={{ fontFamily: "var(--font-spartan)" }}
        >
          {milestone.year}
        </p>

        <h3
          className="text-4xl md:text-5xl lg:text-6xl text-[#6B1A1A] leading-tight"
          style={{ fontFamily: "var(--font-spartan)" }}
        >
          {milestone.title}
        </h3>

        <p
          className="text-lg md:text-xl text-[#6B1A1A]/85 leading-[1.9]"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          {milestone.description}
        </p>
      </div>

      <div
        className={`grid gap-5 ${
          milestone.images.length === 2 ? "grid-cols-2" : "grid-cols-1"
        }`}
      >
        {milestone.images.map((image, imageIndex) => (
          <div
            key={imageIndex}
            className="overflow-hidden rounded-[2rem] shadow-xl group"
          >
            <img
              src={image.src}
              alt={milestone.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              style={{ aspectRatio: image.aspect }}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Timeline() {
  return (
    <section className="py-24 md:py-32 bg-[#FAF6EF]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-4xl mx-auto mb-20">
          <p
            className="uppercase tracking-[0.35em] text-[#E8A84C] text-sm mb-5"
            style={{ fontFamily: "var(--font-spartan)" }}
          >
            The Journey
          </p>

          <h2
            className="text-5xl md:text-7xl text-[#6B1A1A] leading-tight"
            style={{ fontFamily: "var(--font-spartan)" }}
          >
            How Paw Forward Came to Life
          </h2>
        </div>

        <div className="space-y-16">
          {milestones.map((milestone, index) => (
            <Milestone
              key={milestone.year}
              milestone={milestone}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}