"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

export default function AdoptModal({
  dog,
  shelterId,
  shelterName,
  onClose,
}) {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [status, setStatus] = useState("idle");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const validate = () => {
    if (!formData.name.trim())
      return "Please enter your full name.";

    if (!formData.email.trim())
      return "Please enter your email address.";

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      return "Please enter a valid email address.";

    if (!formData.phone.trim())
      return "Please enter your contact number.";

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
      await addDoc(collection(db, `adoptions_${shelterId}`), {
        ...formData,
        dogId: dog.id,
        dogName: dog.name,
        submittedAt: serverTimestamp(),
      });

      setStatus("success");
    } catch (err) {
      console.error(err);

      setErrorMsg("Something went wrong. Please try again.");

      setStatus("error");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#FAF6EF] rounded-[32px] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center text-[#6B1A1A] hover:bg-[#6B1A1A]/10 rounded-full transition-colors cursor-pointer"
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {status === "success" ? (
          <div className="p-10 md:p-14 text-center space-y-4">
            <h3
              className="text-3xl md:text-4xl text-[#6B1A1A]"
              style={{
                fontFamily: "var(--font-spartan)",
              }}
            >
              Request sent!
            </h3>

            <p
              className="text-base text-[#6B1A1A]/85 leading-relaxed max-w-md mx-auto"
              style={{
                fontFamily: "var(--font-montserrat)",
              }}
            >
              Thank you for choosing {dog.name}. The{" "}
              {shelterName} team will reach out to you soon.
            </p>

            <button
              onClick={onClose}
              className="mt-4 px-8 py-3 bg-[#6B1A1A] text-white tracking-wider text-sm uppercase rounded-full hover:bg-[#8a2424] hover:scale-[1.02] transition-all duration-300 cursor-pointer"
              style={{
                fontFamily: "var(--font-spartan)",
              }}
            >
              Close
            </button>
          </div>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="p-8 md:p-10"
          >
            {/* TOP DOG SECTION */}
            <div className="flex items-center gap-5 mb-8 pb-6 border-b border-[#6B1A1A]/10">
              <div className="w-24 h-24 rounded-3xl overflow-hidden flex-shrink-0 shadow-lg">
                <img
                  src={dog.image}
                  alt={dog.name}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <p
                  className="text-xs tracking-[0.2em] text-[#6B1A1A]/60 uppercase mb-2"
                  style={{
                    fontFamily: "var(--font-spartan)",
                  }}
                >
                  Adopting from {shelterName}
                </p>

                <h3
                  className="text-3xl md:text-4xl text-[#6B1A1A]"
                  style={{
                    fontFamily: "var(--font-spartan)",
                  }}
                >
                  {dog.name}
                </h3>
              </div>
            </div>

            {/* DOG DESCRIPTION */}
            {dog.description && (
              <div className="mb-8 bg-white/75 border border-[#6B1A1A]/10 rounded-[28px] p-6 shadow-sm">
                <p
                  className="text-xs tracking-[0.18em] uppercase text-[#6B1A1A]/60 mb-3"
                  style={{
                    fontFamily: "var(--font-spartan)",
                  }}
                >
                  About {dog.name}
                </p>

                <p
                  className="text-[15px] text-[#6B1A1A]/80 leading-relaxed"
                  style={{
                    fontFamily: "var(--font-montserrat)",
                  }}
                >
                  {dog.description}
                </p>
              </div>
            )}

            {/* INTRO TEXT */}
            <p
              className="text-sm text-[#6B1A1A]/75 leading-relaxed mb-6"
              style={{
                fontFamily: "var(--font-montserrat)",
              }}
            >
              Please fill in your details below. The shelter
              will contact you regarding the next adoption steps.
            </p>

            {/* FORM */}
            <div className="space-y-5">
              <Field
                label="Full Name *"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
              />

              <Field
                label="Email Address *"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
              />

              <Field
                label="Contact Number *"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                required
              />

              <TextareaField
                label="Anything you'd like to share?"
                name="message"
                value={formData.message}
                onChange={handleChange}
              />
            </div>

            {/* ERROR */}
            {status === "error" && errorMsg && (
              <p
                className="mt-4 text-sm text-[#6B1A1A] bg-[#F3BEBE] px-4 py-3 rounded-2xl"
                style={{
                  fontFamily: "var(--font-montserrat)",
                }}
                role="alert"
              >
                {errorMsg}
              </p>
            )}

            {/* SUBMIT */}
            <button
  type="submit"
  disabled={status === "submitting"}
  className="group relative overflow-hidden w-full mt-8 py-4 bg-[#6B1A1A] text-white tracking-wider text-sm uppercase rounded-full hover:bg-[#8a2424] hover:scale-[1.02] transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed disabled:pointer-events-none cursor-pointer"
  style={{
    fontFamily: "var(--font-spartan)",
  }}
>
  <span className="relative z-10">
    {status === "submitting"
      ? "Sending..."
      : "Submit Adoption Request"}
  </span>
  <span className="pointer-events-none absolute inset-y-0 -left-1/3 w-1/3 bg-gradient-to-r from-transparent via-[#E8A84C]/70 to-transparent skew-x-[-20deg] -translate-x-full group-hover:translate-x-[420%] transition-transform duration-1000 ease-out" />
</button>
          </form>
        )}
      </div>
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
        className="block text-xs tracking-[0.2em] text-[#6B1A1A]/70 uppercase mb-2"
        style={{
          fontFamily: "var(--font-spartan)",
        }}
      >
        {label}
      </span>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full px-5 py-3 bg-white border border-[#6B1A1A]/20 rounded-full text-[#6B1A1A] focus:outline-none focus:border-[#6B1A1A] transition-colors"
        style={{
          fontFamily: "var(--font-montserrat)",
        }}
      />
    </label>
  );
}

function TextareaField({
  label,
  name,
  value,
  onChange,
}) {
  return (
    <label className="block">
      <span
        className="block text-xs tracking-[0.2em] text-[#6B1A1A]/70 uppercase mb-2"
        style={{
          fontFamily: "var(--font-spartan)",
        }}
      >
        {label}
      </span>

      <textarea
        name={name}
        value={value}
        onChange={onChange}
        rows={4}
        className="w-full px-5 py-3 bg-white border border-[#6B1A1A]/20 rounded-2xl text-[#6B1A1A] focus:outline-none focus:border-[#6B1A1A] transition-colors resize-none"
        style={{
          fontFamily: "var(--font-montserrat)",
        }}
      />
    </label>
  );
}