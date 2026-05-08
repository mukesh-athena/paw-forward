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

  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!formData.firstName.trim()) {
      return "Please enter your first name.";
    }

    if (!formData.lastName.trim()) {
      return "Please enter your last name.";
    }

    if (!formData.email.trim()) {
      return "Please enter your email address.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      return "Please enter a valid email address.";
    }

    if (!formData.message.trim()) {
      return "Please tell us how we can help.";
    }

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

  const pageBg = {
    backgroundColor: "#E8A84C",
    backgroundImage: "url('/images/paw-pattern.jpg')",
    backgroundRepeat: "repeat",
    backgroundSize: "300px",
  };

  if (status === "success") {
    return (
      <main className="min-h-screen relative" style={pageBg}>
        <div className="absolute inset-0 bg-[#E8A84C]/88 pointer-events-none" />

        <div className="relative">
          <Header />

          <section className="pt-40 pb-32 md:pt-48 md:pb-40 px-6 animate-fade-in">
            <div className="max-w-2xl mx-auto text-center space-y-6">

              <div className="text-7xl animate-bounce-slow inline-block">
                🐾
              </div>

              <h1
                className="text-4xl md:text-5xl lg:text-6xl text-[#6B1A1A] leading-tight"
                style={{ fontFamily: "var(--font-spartan)" }}
              >
                Thanks for reaching out!
              </h1>

              <p
                className="text-base md:text-lg text-[#6B1A1A]/90 leading-relaxed max-w-lg mx-auto"
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
      <div className="absolute inset-0 bg-[#E8A84C]/88 pointer-events-none" />

      <div className="relative">
        <Header />

        <section className="pt-32 md:pt-40 pb-24 md:pb-32 px-6 animate-fade-in">

          <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-24 items-start">

            {/* LEFT SIDE */}
            <div className="space-y-10 md:pt-4">

              <p
                className="text-sm tracking-[0.25em] text-[#6B1A1A]/80 uppercase font-semibold"
                style={{ fontFamily: "var(--font-spartan)" }}
              >
                — Get in Touch
              </p>

              <h1
                className="text-5xl md:text-6xl lg:text-7xl text-[#6B1A1A] leading-[1.05]"
                style={{ fontFamily: "var(--font-spartan)" }}
              >
                Let&apos;s Talk
                <br />
                About the <em className="italic">Animals</em>
              </h1>

              <p
                className="text-base md:text-lg text-[#6B1A1A]/90 leading-relaxed max-w-md"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Whether you want to volunteer, partner with us, or simply learn
                more — we&apos;d love to hear from you.
              </p>

              <div className="space-y-7 pt-2">

                <InfoBlock label="Initiative">
                  Paw Forward, Mumbai
                </InfoBlock>

                <InfoBlock label="Partners">
                  YODA · WSD · BMC
                </InfoBlock>

                <InfoBlock label="Founded">
                  2026 by Vipanshi Agarwal
                </InfoBlock>

              </div>

            </div>

            {/* RIGHT SIDE FORM */}
            <form
              onSubmit={handleSubmit}
              className="
                relative
                overflow-hidden
                bg-white/75
                backdrop-blur-xl
                border
                border-white/60
                rounded-[2.5rem]
                shadow-[0_20px_80px_rgba(107,26,26,0.10)]
                p-8
                md:p-12
                space-y-6
              "
            >

              {/* GLOW EFFECTS */}
              <div className="absolute top-0 right-0 w-40 h-40 bg-[#6B1A1A]/10 blur-3xl rounded-full pointer-events-none" />

              <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#6B1A1A]/10 blur-3xl rounded-full pointer-events-none" />

              <div className="relative z-10 space-y-6">

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
                  className="
                    group
                    relative
                    overflow-hidden
                    w-full
                    py-5
                    mt-2
                    rounded-full
                    bg-[#6B1A1A]
                    text-white
                    text-sm
                    uppercase
                    tracking-[0.25em]
                    hover:bg-[#842020]
                    hover:scale-[1.01]
                    transition-all
                    duration-500
                    disabled:opacity-60
                    disabled:cursor-not-allowed
                    cursor-pointer
                  "
                  style={{ fontFamily: "var(--font-spartan)" }}
                >

                  <span className="relative z-10">
                    {status === "submitting"
                      ? "Sending..."
                      : "Send Message"}
                  </span>

                  <span className="
                    absolute
                    inset-y-0
                    -left-1/3
                    w-1/3
                    bg-gradient-to-r
                    from-transparent
                    via-[#E8A84C]/70
                    to-transparent
                    skew-x-[-20deg]
                    group-hover:translate-x-[420%]
                    transition-transform
                    duration-1000
                    ease-out
                  " />

                </button>

              </div>
            </form>

          </div>
        </section>

        <Footer />
      </div>
    </main>
  );
}

function InfoBlock({ label, children }) {
  return (
    <div>

      <p
        className="text-sm tracking-[0.2em] text-[#6B1A1A] uppercase mb-1.5 font-bold"
        style={{ fontFamily: "var(--font-spartan)" }}
      >
        {label}
      </p>

      <p
        className="text-base md:text-lg text-[#6B1A1A]/95"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {children}
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
  required = false,
}) {
  return (
    <label className="block">

      <span
        className="block text-xs tracking-[0.22em] text-[#6B1A1A]/70 uppercase mb-3 font-semibold"
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
        className="
          w-full
          px-6
          py-4
          rounded-2xl
          bg-white/90
          border
          border-[#6B1A1A]/10
          text-[#6B1A1A]
          placeholder:text-[#6B1A1A]/40
          focus:outline-none
          focus:border-[#6B1A1A]
          focus:shadow-[0_0_0_4px_rgba(107,26,26,0.10)]
          hover:border-[#6B1A1A]/25
          transition-all
          duration-300
        "
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
  required = false,
}) {
  return (
    <label className="block">

      <span
        className="block text-xs tracking-[0.22em] text-[#6B1A1A]/70 uppercase mb-3 font-semibold"
        style={{ fontFamily: "var(--font-spartan)" }}
      >
        {label}
      </span>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={6}
        className="
          w-full
          px-6
          py-5
          rounded-[2rem]
          bg-white/90
          border
          border-[#6B1A1A]/10
          text-[#6B1A1A]
          placeholder:text-[#6B1A1A]/40
          focus:outline-none
          focus:border-[#6B1A1A]
          focus:shadow-[0_0_0_4px_rgba(107,26,26,0.10)]
          hover:border-[#6B1A1A]/25
          transition-all
          duration-300
          resize-none
        "
        style={{ fontFamily: "var(--font-montserrat)" }}
      />

    </label>
  );
}