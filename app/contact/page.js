"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });
  const [status, setStatus] = useState("idle"); // idle | submitting | success | error
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    if (!formData.firstName.trim()) return "Please enter your first name.";
    if (!formData.lastName.trim()) return "Please enter your last name.";
    if (!formData.email.trim()) return "Please enter your email address.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return "Please enter a valid email address.";
    if (!formData.message.trim()) return "Please tell us how we can help.";
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
      await addDoc(collection(db, "contact_messages"), {
        ...formData,
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
    backgroundColor: "#F3BEBE",
    backgroundImage: "url('/images/paw-pattern.jpg')",
    backgroundRepeat: "repeat",
    backgroundSize: "300px",
  };

  // ─── Success screen ──────────────────────────────────────────
  if (status === "success") {
    return (
      <main className="min-h-screen relative" style={pageBg}>
        <div className="absolute inset-0 bg-[#F3BEBE]/88 pointer-events-none" />
        <div className="relative">
          <Header />
          <section className="pt-40 pb-32 md:pt-48 md:pb-40 px-6 animate-fade-in">
            <div className="max-w-2xl mx-auto text-center space-y-6">
              <div className="text-7xl animate-bounce-slow inline-block">🐾</div>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl text-[#6B1A1A] leading-tight"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Thanks for reaching out!
              </h1>
              <p
                className="text-base md:text-lg text-[#6B1A1A]/85 leading-relaxed max-w-lg mx-auto"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                We&apos;ll get back to you soon.
              </p>
              <button
                onClick={() => {
                  setFormData({
                    firstName: "",
                    lastName: "",
                    email: "",
                    phone: "",
                    message: "",
                  });
                  setStatus("idle");
                }}
                className="mt-6 px-10 py-4 bg-[#6B1A1A] text-white tracking-wider text-sm uppercase rounded-full hover:bg-[#8a2424] hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                style={{ fontFamily: "var(--font-spartan)" }}
              >
                Send another message
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
      {/* Pink wash so pattern stays subtle */}
      <div className="absolute inset-0 bg-[#F3BEBE]/85 pointer-events-none" />

      <div className="relative">
        <Header />

        {/* ─── HERO ────────────────────────────────────────────── */}
        <section className="pt-32 md:pt-40 pb-12 md:pb-16 px-6 animate-fade-in">
          <div className="max-w-3xl mx-auto text-center space-y-5">
            <h1
              className="text-5xl md:text-6xl lg:text-7xl text-[#6B1A1A] leading-tight"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Get in touch with Paw Forward
            </h1>
            <p
              className="text-base md:text-lg text-[#6B1A1A]/85 leading-relaxed max-w-2xl mx-auto"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              We are here to help you find your next best friend or report a stray
              dog in Mumbai.
            </p>
          </div>
        </section>

        {/* ─── FORM ────────────────────────────────────────────── */}
        <section className="pb-24 md:pb-32 px-6 animate-fade-in">
          <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto space-y-5"
          >
            {/* Name row */}
            <div className="grid sm:grid-cols-2 gap-5">
              <Field
                label="First Name *"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Field
                label="Last Name *"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>

            <Field
              label="Email Address *"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Field
              label="Phone Number"
              name="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
            />

            <TextareaField
              label="How can we help? *"
              name="message"
              value={formData.message}
              onChange={handleChange}
              required
            />

            {status === "error" && errorMsg && (
              <p
                className="text-sm text-[#6B1A1A] bg-white/70 px-4 py-3 rounded-sm"
                style={{ fontFamily: "var(--font-montserrat)" }}
                role="alert"
              >
                {errorMsg}
              </p>
            )}

            <button
              type="submit"
              disabled={status === "submitting"}
              className="w-full py-4 mt-2 bg-[#6B1A1A] text-white tracking-wider text-sm uppercase rounded-full hover:bg-[#8a2424] hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
              style={{ fontFamily: "var(--font-spartan)" }}
            >
              {status === "submitting" ? "Sending..." : "Send Message"}
            </button>
          </form>
        </section>

        <Footer />
      </div>
    </main>
  );
}

function Field({ label, name, type = "text", value, onChange, required = false }) {
  return (
    <label className="block">
      <span
        className="block text-xs tracking-[0.2em] text-[#6B1A1A]/80 uppercase mb-2"
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
        className="w-full px-5 py-4 bg-white rounded-full text-[#6B1A1A] placeholder:text-[#6B1A1A]/40 focus:outline-none focus:ring-2 focus:ring-[#6B1A1A]/30 transition-all"
        style={{ fontFamily: "var(--font-montserrat)" }}
      />
    </label>
  );
}

function TextareaField({ label, name, value, onChange, required = false }) {
  return (
    <label className="block">
      <span
        className="block text-xs tracking-[0.2em] text-[#6B1A1A]/80 uppercase mb-2"
        style={{ fontFamily: "var(--font-spartan)" }}
      >
        {label}
      </span>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={5}
        className="w-full px-5 py-4 bg-white rounded-3xl text-[#6B1A1A] placeholder:text-[#6B1A1A]/40 focus:outline-none focus:ring-2 focus:ring-[#6B1A1A]/30 transition-all resize-none"
        style={{ fontFamily: "var(--font-montserrat)" }}
      />
    </label>
  );
}