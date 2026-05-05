"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  query,
  orderBy,
  serverTimestamp,
} from "firebase/firestore";

const SHELTERS = [
  { id: "yoda", label: "YODA" },
  { id: "wsd", label: "WSD" },
];

export default function ManageDogs() {
  const [activeShelter, setActiveShelter] = useState("yoda");
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Form state (used for both Add and Edit)
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = adding new
  const [formData, setFormData] = useState({ name: "", image: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  // Delete confirmation state
  const [deletingId, setDeletingId] = useState(null);

  const collectionName = `dogs_${activeShelter}`;

  // ─── Fetch dogs whenever shelter tab changes ─────────────
  useEffect(() => {
    let cancelled = false;

    async function fetchDogs() {
      setLoading(true);
      setError(null);
      try {
        const q = query(collection(db, collectionName), orderBy("addedAt", "desc"));
        const snap = await getDocs(q);
        if (cancelled) return;
        setDogs(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to load dogs:", err);
        if (!cancelled) setError("Couldn't load dogs. Please refresh.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchDogs();
    return () => { cancelled = true; };
  }, [collectionName]);

  // ─── Form handlers ───────────────────────────────────────
  const openAddForm = () => {
    setEditingId(null);
    setFormData({ name: "", image: "" });
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (dog) => {
    setEditingId(dog.id);
    setFormData({ name: dog.name, image: dog.image });
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData({ name: "", image: "" });
    setFormError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Please enter the dog's name.");
      return;
    }
    if (!formData.image.trim()) {
      setFormError("Please enter an image URL.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    try {
      if (editingId) {
        // Edit existing
        await updateDoc(doc(db, collectionName, editingId), {
          name: formData.name.trim(),
          image: formData.image.trim(),
        });
        setDogs((prev) =>
          prev.map((d) =>
            d.id === editingId ? { ...d, name: formData.name.trim(), image: formData.image.trim() } : d
          )
        );
      } else {
        // Add new
        const docRef = await addDoc(collection(db, collectionName), {
          name: formData.name.trim(),
          image: formData.image.trim(),
          addedAt: serverTimestamp(),
        });
        // Optimistically add to top of list
        setDogs((prev) => [
          { id: docRef.id, name: formData.name.trim(), image: formData.image.trim(), addedAt: new Date() },
          ...prev,
        ]);
      }
      closeForm();
    } catch (err) {
      console.error(err);
      setFormError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ─── Delete handler ──────────────────────────────────────
  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteDoc(doc(db, collectionName, deletingId));
      setDogs((prev) => prev.filter((d) => d.id !== deletingId));
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete. Please try again.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Shelter switcher */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex gap-2 bg-white p-1 rounded-full">
          {SHELTERS.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveShelter(s.id)}
              className={`px-5 py-2 text-sm tracking-wider rounded-full transition-colors cursor-pointer ${
                activeShelter === s.id
                  ? "bg-[#6B1A1A] text-white"
                  : "text-[#6B1A1A] hover:bg-[#6B1A1A]/10"
              }`}
              style={{ fontFamily: "var(--font-spartan)", letterSpacing: "0.1em" }}
            >
              {s.label}
            </button>
          ))}
        </div>

        <button
          onClick={openAddForm}
          className="px-5 py-2.5 bg-[#6B1A1A] text-white tracking-wider text-sm uppercase rounded-full hover:bg-[#8a2424] transition-colors cursor-pointer"
          style={{ fontFamily: "var(--font-spartan)", letterSpacing: "0.1em" }}
        >
          + Add Dog
        </button>
      </div>

      {/* Dogs list */}
      <div className="bg-white rounded-2xl p-6 md:p-8 min-h-[300px]">
        {loading && (
          <p
            className="text-center text-[#6B1A1A]/60 py-12"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            Loading dogs...
          </p>
        )}

        {!loading && error && (
          <p
            className="text-center text-[#6B1A1A]/80 py-12"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {error}
          </p>
        )}

        {!loading && !error && dogs.length === 0 && (
          <p
            className="text-center text-[#6B1A1A]/60 italic py-12"
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            No dogs yet. Click &quot;+ Add Dog&quot; to add one.
          </p>
        )}

        {!loading && !error && dogs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dogs.map((dog) => (
              <div
                key={dog.id}
                className="bg-[#FAF6EF] rounded-2xl overflow-hidden border border-[#6B1A1A]/10"
              >
                <div className="aspect-[4/3] bg-[#6B1A1A]/5 overflow-hidden">
                  <img
                    src={dog.image}
                    alt={dog.name}
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.opacity = "0.3"; }}
                  />
                </div>
                <div className="p-4 space-y-3">
                  <h3
                    className="text-xl text-[#6B1A1A]"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {dog.name}
                  </h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEditForm(dog)}
                      className="flex-1 py-2 text-xs tracking-wider uppercase border border-[#6B1A1A]/30 text-[#6B1A1A] rounded-full hover:bg-[#6B1A1A] hover:text-white hover:border-[#6B1A1A] transition-colors cursor-pointer"
                      style={{ fontFamily: "var(--font-spartan)" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingId(dog.id)}
                      className="flex-1 py-2 text-xs tracking-wider uppercase border border-[#6B1A1A]/30 text-[#6B1A1A] rounded-full hover:bg-[#6B1A1A] hover:text-white hover:border-[#6B1A1A] transition-colors cursor-pointer"
                      style={{ fontFamily: "var(--font-spartan)" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ─── Add/Edit Modal ────────────────────────────────── */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeForm}
        >
          <div
            className="relative w-full max-w-lg bg-[#FAF6EF] rounded-2xl shadow-2xl p-8 md:p-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeForm}
              className="absolute top-4 right-4 w-9 h-9 flex items-center justify-center text-[#6B1A1A] hover:bg-[#6B1A1A]/10 rounded-full transition-colors cursor-pointer"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <h3
              className="text-2xl md:text-3xl text-[#6B1A1A] mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {editingId ? "Edit Dog" : "Add a New Dog"}
            </h3>
            <p
              className="text-sm text-[#6B1A1A]/70 mb-6"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              Adding to <strong>{activeShelter.toUpperCase()}</strong>
            </p>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  className="block text-xs tracking-[0.2em] text-[#6B1A1A]/70 uppercase mb-2"
                  style={{ fontFamily: "var(--font-spartan)" }}
                >
                  Dog Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rocky"
                  className="w-full px-5 py-3 bg-white border border-[#6B1A1A]/20 rounded-full text-[#6B1A1A] placeholder:text-[#6B1A1A]/40 focus:outline-none focus:border-[#6B1A1A] transition-colors"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                />
              </div>

              <div>
                <label
                  className="block text-xs tracking-[0.2em] text-[#6B1A1A]/70 uppercase mb-2"
                  style={{ fontFamily: "var(--font-spartan)" }}
                >
                  Image URL *
                </label>
                <input
                  type="url"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="https://i.postimg.cc/.../yourdog.jpg"
                  className="w-full px-5 py-3 bg-white border border-[#6B1A1A]/20 rounded-full text-[#6B1A1A] placeholder:text-[#6B1A1A]/40 focus:outline-none focus:border-[#6B1A1A] transition-colors"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                />
                <p
  className="text-xs text-[#6B1A1A]/60 italic mt-2 leading-relaxed"
  style={{ fontFamily: "var(--font-montserrat)" }}
>
  Tip: Upload your photo to <a href="https://postimages.org" target="_blank" rel="noopener noreferrer" className="underline">postimages.org</a> (free, no signup). After upload, copy the &quot;Direct link&quot; URL — that&apos;s what you paste here.
</p>
              </div>

              {/* Image preview */}
              {formData.image && (
                <div className="rounded-xl overflow-hidden bg-white border border-[#6B1A1A]/10 aspect-[4/3]">
                  <img
                    src={formData.image}
                    alt="Preview"
                    className="w-full h-full object-cover"
                    onError={(e) => { e.currentTarget.style.opacity = "0.3"; }}
                  />
                </div>
              )}

              {formError && (
                <p
                  className="text-sm text-[#6B1A1A] bg-[#F3BEBE] px-4 py-2 rounded-full text-center"
                  style={{ fontFamily: "var(--font-montserrat)" }}
                >
                  {formError}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeForm}
                  className="flex-1 py-3 border border-[#6B1A1A]/30 text-[#6B1A1A] tracking-wider text-sm uppercase rounded-full hover:bg-[#6B1A1A]/5 transition-colors cursor-pointer"
                  style={{ fontFamily: "var(--font-spartan)", letterSpacing: "0.1em" }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-3 bg-[#6B1A1A] text-white tracking-wider text-sm uppercase rounded-full hover:bg-[#8a2424] transition-colors disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer"
                  style={{ fontFamily: "var(--font-spartan)", letterSpacing: "0.1em" }}
                >
                  {submitting ? "Saving..." : editingId ? "Save Changes" : "Add Dog"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ─── Delete Confirmation ─────────────────────────── */}
      {deletingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setDeletingId(null)}
        >
          <div
            className="relative w-full max-w-md bg-[#FAF6EF] rounded-2xl shadow-2xl p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3
              className="text-2xl text-[#6B1A1A] mb-3"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Delete this dog?
            </h3>
            <p
              className="text-sm text-[#6B1A1A]/75 mb-6"
              style={{ fontFamily: "var(--font-montserrat)" }}
            >
              This will remove the dog from the live website. This can&apos;t be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeletingId(null)}
                className="flex-1 py-3 border border-[#6B1A1A]/30 text-[#6B1A1A] tracking-wider text-sm uppercase rounded-full hover:bg-[#6B1A1A]/5 transition-colors cursor-pointer"
                style={{ fontFamily: "var(--font-spartan)", letterSpacing: "0.1em" }}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="flex-1 py-3 bg-[#6B1A1A] text-white tracking-wider text-sm uppercase rounded-full hover:bg-[#8a2424] transition-colors cursor-pointer"
                style={{ fontFamily: "var(--font-spartan)", letterSpacing: "0.1em" }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}