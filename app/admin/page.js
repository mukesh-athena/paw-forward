"use client";

import { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ManageDogs from "./components/ManageDogs";
import AdoptionRequests from "./components/AdoptionRequests";
import StrayReports from "./components/StrayReports";
import ContactMessages from "./components/ContactMessages";

// Simple shared password. Vipanshi can change this in code later if needed.
const ADMIN_PASSWORD = "pawforward2026";
const SESSION_KEY = "paw_admin_authed";

export default function AdminPage() {
  // Lazy initial state - reads sessionStorage once on first render only.
  // Avoids the linter warning from setting state inside an effect.
  const [authed, setAuthed] = useState(() => {
    if (typeof window === "undefined") return false;
    return sessionStorage.getItem(SESSION_KEY) === "true";
  });
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [activeTab, setActiveTab] = useState("dogs");

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(SESSION_KEY, "true");
      setAuthed(true);
      setPassword("");
      setErrorMsg("");
    } else {
      setErrorMsg("Incorrect password.");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(SESSION_KEY);
    setAuthed(false);
  };

  // ─── LOGIN SCREEN ────────────────────────────────────────
  if (!authed) {
    return (
      <main className="min-h-screen bg-[#FAF6EF]">
        <Header />
        <section className="pt-40 pb-32 px-6">
          <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-8 md:p-10 space-y-6">
            <div className="text-center space-y-2">
              <div className="text-5xl">🔒</div>
              <h1
                className="text-3xl md:text-4xl text-[#6B1A1A]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Admin Access
              </h1>
              <p
                className="text-sm text-[#6B1A1A]/70"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Enter the password to manage Paw Forward.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                autoFocus
                className="w-full px-5 py-3 bg-white border border-[#6B1A1A]/20 rounded-full text-[#6B1A1A] placeholder:text-[#6B1A1A]/40 focus:outline-none focus:border-[#6B1A1A] transition-colors"
                style={{ fontFamily: "var(--font-montserrat)" }}
              />

              {errorMsg && (
                <p
                  className="text-sm text-[#6B1A1A] bg-[#F3BEBE] px-4 py-2 rounded-full text-center"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {errorMsg}
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 bg-[#6B1A1A] text-white tracking-wider text-sm uppercase rounded-full hover:bg-[#8a2424] hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                style={{ fontFamily: "var(--font-spartan)" }}
              >
                Log In
              </button>
            </form>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  // ─── ADMIN DASHBOARD ─────────────────────────────────────
  const tabs = [
    { id: "dogs", label: "Manage Dogs" },
    { id: "adoptions", label: "Adoption Requests" },
    { id: "strays", label: "Stray Reports" },
    { id: "contact", label: "Contact Messages" },
  ];

  return (
    <main className="min-h-screen bg-[#FAF6EF]">
      <Header />

      <section className="pt-32 pb-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <h1
                className="text-4xl md:text-5xl text-[#6B1A1A]"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                Admin Dashboard
              </h1>
              <p
                className="text-sm text-[#6B1A1A]/70 mt-1"
                style={{ fontFamily: "var(--font-montserrat)" }}
              >
                Manage Paw Forward content and submissions.
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="self-start sm:self-auto px-5 py-2 text-sm border border-[#6B1A1A]/30 text-[#6B1A1A] rounded-full hover:bg-[#6B1A1A] hover:text-white transition-all cursor-pointer"
              style={{ fontFamily: "var(--font-spartan)", letterSpacing: "0.1em" }}
            >
              LOG OUT
            </button>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 border-b border-[#6B1A1A]/15 mb-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-5 py-3 text-sm tracking-wider transition-colors cursor-pointer border-b-2 -mb-px ${
                  activeTab === tab.id
                    ? "border-[#6B1A1A] text-[#6B1A1A]"
                    : "border-transparent text-[#6B1A1A]/60 hover:text-[#6B1A1A]"
                }`}
                style={{ fontFamily: "var(--font-spartan)", letterSpacing: "0.1em" }}
              >
                {tab.label.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <div>
            {activeTab === "dogs" && <ManageDogs />}
            {activeTab === "adoptions" && <AdoptionRequests />}
            {activeTab === "strays" && <StrayReports />}
            {activeTab === "contact" && <ContactMessages />}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}