"use client";

import { useState } from "react";
import Header from "../components/Header";
import Closer from "../components/Closer";
import Footer from "../components/Footer";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function ReportStrays() {
  const [formData, setFormData] = useState({
    numStrays: "",
    location: "",
    description: "",
    name: "",
    email: "",
    phone: "",
  });

  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!formData.numStrays || Number(formData.numStrays) < 1)
      return "Please enter the approximate number of strays.";

    if (!formData.location.trim())
      return "Please paste a Google or Apple Maps link.";

    if (!/^https?:\/\/.+/i.test(formData.location.trim()))
      return "Please enter a valid maps link.";

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    )
      return "Please enter a valid email address.";

    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const err = validate();

    if (err) {
      setErrorMsg(err);
      setStatus("error");
      return;
    }

    setStatus("submitting");
    setErrorMsg("");

    try {
      await addDoc(collection(db, "stray_reports"), {
        ...formData,
        numStrays: Number(formData.numStrays),
        submittedAt: serverTimestamp(),
      });

      setStatus("success");
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong.");
      setStatus("error");
    }
  };

  const pageBg = {
    backgroundColor: "#FAF6EF",
    backgroundImage: "url('/images/paw-pattern.jpg')",
    backgroundRepeat: "repeat",
    backgroundSize: "280px",
  };

  if (status === "success") {
    return (
      <main className="min-h-screen relative overflow-hidden" style={pageBg}>
        <div className="absolute inset-0 bg-[#FAF6EF]/88" />

        <div className="relative z-10">
          <Header />

          <section className="pt-40 pb-32 px-6">
            <div className="max-w-3xl mx-auto text-center">
              <div className="text-7xl mb-6 animate-bounce-slow">🐾</div>

              <h1
                className="text-5xl md:text-6xl text-[#6B1A1A] mb-6"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Report Submitted
              </h1>

              <p
                className="text-lg text-[#6B1A1A]/80 leading-relaxed"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Thank you for helping Mumbai&apos;s strays.
                Our shelter partners will review this report shortly.
              </p>

              <button
                onClick={() => {
                  setFormData({
                    numStrays: "",
                    location: "",
                    description: "",
                    name: "",
                    email: "",
                    phone: "",
                  });

                  setStatus("idle");
                }}
                className="mt-10 px-10 py-4 rounded-full bg-[#6B1A1A] text-white hover:bg-[#8B2323] hover:scale-[1.03] transition-all duration-300 cursor-pointer"
                style={{ fontFamily: "var(--font-spartan)" }}
              >
                Submit Another Report
              </button>
            </div>
          </section>

          <Closer />
          <Footer />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative overflow-hidden" style={pageBg}>
      <div className="absolute inset-0 bg-gradient-to-b from-[#FAF6EF]/95 via-[#FAF6EF]/88 to-[#FAF6EF]/95" />

      <div className="relative z-10">
        <Header />

        {/* HERO */}
        <section className="pt-32 md:pt-40 pb-20 px-6">
          <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-5">
                <p
                  className="text-sm tracking-[0.3em] uppercase text-[#6B1A1A]/60"
                  style={{ fontFamily: "var(--font-spartan)" }}
                >
                  Reporting Unsterilised Strays
                </p>

                <h1
                  className="text-5xl md:text-7xl leading-[0.95] text-[#6B1A1A]"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Help Protect
                  <br />
                  Mumbai&apos;s
                  <br />
                  Street Dogs
                </h1>

                <p
                  className="text-lg md:text-xl text-[#6B1A1A]/75 leading-relaxed max-w-xl"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  Report unsterilised strays so rescue partners can respond
                  faster and help control the population humanely.
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4 pt-4">
                <InfoCard
                  emoji="🐾"
                  title="Humane"
                  text="Focused on safe sterilisation support."
                />

                <InfoCard
                  emoji="📍"
                  title="Mumbai Wide"
                  text="Reports across the city are reviewed."
                />

                <InfoCard
                  emoji="⚡"
                  title="Faster Response"
                  text="Detailed reports help rescuers quicker."
                />
              </div>
            </div>

            {/* IMAGE */}
            <div className="relative">
              <div className="absolute -top-6 -left-6 w-40 h-40 bg-[#E8A84C]/20 blur-3xl rounded-full" />

              <div className="relative overflow-hidden rounded-[2rem] shadow-2xl border border-white/50">
                <img
                  src="/images/street-dog.avif"
                  alt="Street dog"
                  className="w-full h-[650px] object-cover hover:scale-105 transition-transform duration-[2500ms]"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* FORM SECTION */}
        <section className="pb-24 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="mb-10">
              <p
                className="text-sm md:text-base text-[#6B1A1A]/70 mb-4"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Help Mumbai&apos;s street animals safely.
              </p>

              <div className="flex items-center gap-5 mb-5">
                <div className="w-16 h-[2px] bg-[#E8A84C]" />

                <h2
                  className="text-4xl md:text-5xl text-[#6B1A1A]"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  Submit a Report
                </h2>
              </div>

              <p
                className="text-base text-[#6B1A1A]/70 leading-relaxed max-w-2xl"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                The more details you share, the easier it becomes for rescuers
                and shelter partners to identify and help these strays.
              </p>
            </div>

            {/* FLOATING GLASS FORM */}
            <div className="relative">
              <div className="absolute inset-0 bg-white/40 blur-3xl rounded-[3rem]" />

              <form
                onSubmit={handleSubmit}
                className="relative grid lg:grid-cols-2 gap-10 bg-white/75 backdrop-blur-xl border border-white/60 rounded-[2.5rem] p-8 md:p-12 shadow-[0_20px_80px_rgba(107,26,26,0.08)]"
              >
                {/* LEFT */}
                <div className="space-y-7">
                  <Field
                    label="Approximate number of strays *"
                    name="numStrays"
                    type="number"
                    value={formData.numStrays}
                    onChange={handleChange}
                    placeholder="e.g. 3"
                    required
                  />

                  <Field
                    label="Google / Apple Maps Link *"
                    name="location"
                    type="url"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Paste maps location"
                    required
                  />

                  <TextareaField
                    label="Description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Colour, condition, behaviour..."
                  />
                </div>

                {/* RIGHT */}
                <div className="space-y-7 flex flex-col">
                  <div className="space-y-7">
                    <Field
                      label="Your Name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Your name"
                    />

                    <Field
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                    />

                    <Field
                      label="Phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91..."
                    />
                  </div>

                  <div className="mt-auto bg-[#FAF6EF] border border-[#6B1A1A]/10 rounded-[2rem] p-6">
                    <h3
                      className="text-xl text-[#6B1A1A] mb-3"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      Why detailed reports matter
                    </h3>

                    <p
                      className="text-sm text-[#6B1A1A]/75 leading-relaxed"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      Accurate locations and descriptions help rescue teams
                      identify strays faster and organise sterilisation safely.
                    </p>
                  </div>
                </div>

                {status === "error" && errorMsg && (
                  <div className="lg:col-span-2">
                    <div className="bg-[#F3BEBE] text-[#6B1A1A] px-5 py-4 rounded-2xl text-sm">
                      {errorMsg}
                    </div>
                  </div>
                )}

                <div className="lg:col-span-2">
                  <button
                    type="submit"
                    disabled={status === "submitting"}
                    className="group relative overflow-hidden w-full py-5 rounded-full bg-[#6B1A1A] text-white text-sm uppercase tracking-[0.25em] hover:scale-[1.01] hover:bg-[#842020] transition-all duration-500 cursor-pointer"
                    style={{ fontFamily: "var(--font-spartan)" }}
                  >
                    <span className="relative z-10">
                      {status === "submitting"
                        ? "Submitting..."
                        : "Submit Report"}
                    </span>

                    <span className="absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-[#E8A84C]/60 to-transparent skew-x-[-20deg] group-hover:translate-x-[450%] transition-transform duration-1000 ease-out" />
                  </button>

                  <p
                    className="text-center text-sm text-[#6B1A1A]/60 pt-5"
                    style={{ fontFamily: "var(--font-montserrat)" }}
                  >
                    Every report helps create a safer life for Mumbai&apos;s
                    strays.
                  </p>
                </div>
              </form>
            </div>
          </div>
        </section>

        <Closer />
        <Footer />
      </div>
    </main>
  );
}

function InfoCard({ emoji, title, text }) {
  return (
    <div className="bg-white/65 backdrop-blur-md border border-white/60 rounded-3xl p-5 shadow-sm hover:-translate-y-2 transition-all duration-500">
      <div className="text-3xl mb-4">{emoji}</div>

      <h3
        className="text-xl text-[#6B1A1A] mb-2"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {title}
      </h3>

      <p
        className="text-sm text-[#6B1A1A]/75 leading-relaxed"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {text}
      </p>
    </div>
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required = false,
}) {
  return (
    <label className="block">
      <span
        className="block text-xs uppercase tracking-[0.25em] text-[#6B1A1A]/65 mb-3"
        style={{ fontFamily: "var(--font-spartan)" }}
      >
        {label}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        placeholder={placeholder}
        className="w-full px-6 py-4 rounded-2xl bg-white/80 border border-[#6B1A1A]/10 text-[#6B1A1A] placeholder:text-[#6B1A1A]/35 focus:outline-none focus:border-[#E8A84C] focus:shadow-[0_0_0_4px_rgba(232,168,76,0.15)] transition-all duration-300"
        style={{ fontFamily: "var(--font-montserrat)" }}
      />
    </label>
  );
}

function TextareaField({
  label,
  name,
  value,
  onChange,
  placeholder,
}) {
  return (
    <label className="block">
      <span
        className="block text-xs uppercase tracking-[0.25em] text-[#6B1A1A]/65 mb-3"
        style={{ fontFamily: "var(--font-spartan)" }}
      >
        {label}
      </span>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={7}
        placeholder={placeholder}
        className="w-full px-6 py-5 rounded-[2rem] bg-white/80 border border-[#6B1A1A]/10 text-[#6B1A1A] placeholder:text-[#6B1A1A]/35 focus:outline-none focus:border-[#E8A84C] focus:shadow-[0_0_0_4px_rgba(232,168,76,0.15)] transition-all duration-300 resize-none"
        style={{ fontFamily: "var(--font-montserrat)" }}
      />
    </label>
  );
}