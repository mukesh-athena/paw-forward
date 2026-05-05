"use client";

import { useState } from "react";
import Header from "../components/Header";
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.numStrays || Number(formData.numStrays) < 1)
      return "Please enter the approximate number of strays.";
    if (!formData.location.trim())
      return "Please share the location where you saw the stray(s).";
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
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
      setErrorMsg("Something went wrong. Please try again.");
      setStatus("error");
    }
  };

  // Shared paw-pattern background style for the whole page
  const pageBg = {
    backgroundColor: "#FAF6EF",
    backgroundImage: "url('/images/paw-pattern.jpg')",
    backgroundRepeat: "repeat",
    backgroundSize: "300px",
  };

  // ─── Success screen ──────────────────────────────────────────
  if (status === "success") {
    return (
      <main className="min-h-screen relative" style={pageBg}>
        <div className="absolute inset-0 bg-[#FAF6EF]/88 pointer-events-none" />
        <div className="relative">
          <Header />
          <section className="pt-40 pb-32 md:pt-48 md:pb-40 px-6 animate-fade-in">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="text-7xl animate-bounce-slow inline-block">🐾</div>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl text-[#6B1A1A] leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Thank you.
              </h1>
              <p
                className="text-base md:text-lg text-[#6B1A1A]/85 leading-relaxed max-w-lg mx-auto"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                We&apos;ll get this to our shelter partners right away.
              </p>
              <button
                onClick={() => {
                  setFormData({ numStrays: "", location: "", description: "", name: "", email: "", phone: "" });
                  setStatus("idle");
                }}
                className="mt-6 px-10 py-4 bg-[#6B1A1A] text-white tracking-wider text-sm uppercase rounded-full hover:bg-[#8a2424] hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                style={{ fontFamily: "var(--font-spartan)" }}
              >
                Submit another report
              </button>
            </div>
          </section>
          <Footer />
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen relative" style={pageBg}>
      {/* Cream wash on top so pattern is subtle and text stays readable */}
      <div className="absolute inset-0 bg-[#FAF6EF]/88 pointer-events-none" />

      <div className="relative">
        <Header />

        {/* ─── HERO ────────────────────────────────────────────── */}
        <section className="pt-32 md:pt-40 pb-12 md:pb-20 px-6 animate-fade-in">
          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div className="space-y-6">
              <p
                className="text-sm tracking-[0.3em] text-[#6B1A1A]/70 uppercase"
                style={{ fontFamily: "var(--font-spartan)" }}
              >
                Report Strays
              </p>
              <h1
                className="text-5xl md:text-6xl lg:text-7xl text-[#6B1A1A] leading-tight tracking-wide"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Reporting Unsterilised Strays
              </h1>
              <h2
                className="text-3xl md:text-4xl lg:text-5xl text-[#6B1A1A]/85 leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Protecting the Mumbai street.
              </h2>
              <p
                className="text-base md:text-lg text-[#6B1A1A]/85 leading-relaxed"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Every stray dog deserves a safe home. Join us in reporting
                unsterilised strays so we can help them find one.
              </p>
            </div>
            <div className="relative aspect-[4/5] w-full overflow-hidden rounded-sm">
              <img
                src="/images/street-dog.avif"
                alt="A Mumbai street dog"
                className="absolute inset-0 w-full h-full object-cover"
              />
            </div>
          </div>
        </section>

        {/* ─── REPORTING PROCESS ──────────────────────────────── */}
        <section className="py-20 md:py-28 px-6 animate-fade-in">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16 space-y-4">
              <h2
                className="text-4xl md:text-5xl lg:text-6xl text-[#6B1A1A] leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                The Reporting Process
              </h2>
              <p
                className="text-base md:text-lg text-[#6B1A1A]/80 max-w-xl mx-auto"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                How we turn a sighting into a safe home for a Mumbai street dog.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-12 md:gap-8">
              <ProcessStep
                number="01"
                icon="/images/report-icon1.avif"
                title="Report the Sighting"
                description="Share the location and details of the stray dog with us."
              />
              <ProcessStep
                number="02"
                icon="/images/report-icon2.avif"
                title="Medical Checkup"
                description="Our team conducts a thorough health and safety assessment."
              />
              <ProcessStep
                number="03"
                icon="/images/report-icon3.avif"
                title="Safe Placement"
                description="Find a loving, vet-approved home for your new friend."
              />
            </div>
          </div>
        </section>

        {/* ─── FORM ────────────────────────────────────────────── */}
        <section className="py-20 md:py-28 px-6 animate-fade-in">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-10 space-y-3">
              <h2
                className="text-3xl md:text-4xl text-[#6B1A1A] leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Submit a Report
              </h2>
              <p
                className="text-sm md:text-base text-[#6B1A1A]/75"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                The more detail you share, the faster we can help.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-2xl shadow-sm p-8 md:p-10 space-y-6"
            >
              <Field
                label="Approximate number of unsterilised strays *"
                name="numStrays"
                type="number"
                value={formData.numStrays}
                onChange={handleChange}
                min="1"
                placeholder="e.g. 3"
                required
              />

              <Field
                label="Location *"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Near Bandra station, MG Road"
                required
              />

              <TextareaField
                label="Description (optional)"
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Anything else we should know — colour, condition, behaviour..."
              />

              <div className="pt-2 border-t border-[#6B1A1A]/10">
                <p
                  className="text-xs tracking-[0.2em] text-[#6B1A1A]/60 uppercase mb-4"
                  style={{ fontFamily: "var(--font-spartan)" }}
                >
                  Your details (optional)
                </p>

                <div className="space-y-5">
                  <Field label="Name" name="name" value={formData.name} onChange={handleChange} placeholder="Your name" />
                  <Field label="Email" name="email" type="email" value={formData.email} onChange={handleChange} placeholder="you@example.com" />
                  <Field label="Phone" name="phone" type="tel" value={formData.phone} onChange={handleChange} placeholder="+91 ..." />
                </div>
              </div>

              {status === "error" && errorMsg && (
                <p
                  className="text-sm text-[#6B1A1A] bg-[#F3BEBE] px-4 py-3 rounded-2xl"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                  role="alert"
                >
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full py-4 bg-[#6B1A1A] text-white tracking-wider text-sm uppercase rounded-full hover:bg-[#8a2424] hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                style={{ fontFamily: "var(--font-spartan)" }}
              >
                {status === "submitting" ? "Submitting..." : "Submit Report"}
              </button>
            </form>
          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}

function ProcessStep({ number, icon, title, description }) {
  return (
    <div className="flex flex-col items-center text-center space-y-4">
      <div className="w-24 h-24 rounded-full bg-[#E8A84C] flex items-center justify-center p-5">
        <img src={icon} alt="" className="w-full h-full object-contain" />
      </div>
      <p
        className="text-2xl text-[#6B1A1A]"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {number}
      </p>
      <h3
        className="text-2xl md:text-3xl text-[#6B1A1A]"
        style={{ fontFamily: "var(--font-playfair)" }}
      >
        {title}
      </h3>
      <p
        className="text-sm md:text-base text-[#6B1A1A]/80 leading-relaxed max-w-xs"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {description}
      </p>
    </div>
  );
}

function Field({ label, name, type = "text", value, onChange, required = false, min, placeholder }) {
  return (
    <label className="block">
      <span
        className="block text-xs tracking-[0.2em] text-[#6B1A1A]/70 uppercase mb-2"
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
        min={min}
        placeholder={placeholder}
        className="w-full px-5 py-3 bg-white border border-[#6B1A1A]/20 rounded-full text-[#6B1A1A] placeholder:text-[#6B1A1A]/40 focus:outline-none focus:border-[#6B1A1A] transition-colors"
        style={{ fontFamily: "var(--font-montserrat)" }}
      />
    </label>
  );
}

function TextareaField({ label, name, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span
        className="block text-xs tracking-[0.2em] text-[#6B1A1A]/70 uppercase mb-2"
        style={{ fontFamily: "var(--font-spartan)" }}
      >
        {label}
      </span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={4}
        className="w-full px-5 py-3 bg-white border border-[#6B1A1A]/20 rounded-2xl text-[#6B1A1A] placeholder:text-[#6B1A1A]/40 focus:outline-none focus:border-[#6B1A1A] transition-colors resize-none"
        style={{ fontFamily: "var(--font-montserrat)" }}
      />
    </label>
  );
}