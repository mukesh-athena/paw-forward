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

// All personality tag options — must match quiz.js values exactly
const TAG_OPTIONS = {
  activity: {
    label: "Activity level",
    multi: true,
    options: [
      { value: "couch", label: "Couch potato" },
      { value: "walks", label: "Walks" },
      { value: "runner", label: "Runner" },
    ],
  },
  home: {
    label: "Home suited for",
    multi: true,
    options: [
      { value: "apartment", label: "Apartment" },
      { value: "garden", label: "House with garden" },
      { value: "large-house", label: "Large house" },
    ],
  },
  size: {
    label: "Size",
    multi: false,
    options: [
      { value: "small", label: "Small" },
      { value: "medium", label: "Medium" },
      { value: "large", label: "Large" },
    ],
  },
  energy: {
    label: "Energy",
    multi: false,
    options: [
      { value: "calm", label: "Calm" },
      { value: "playful", label: "Playful" },
      { value: "high-energy", label: "High energy" },
    ],
  },
  experience: {
    label: "Experience needed",
    multi: true,
    options: [
      { value: "first-timer", label: "First timer" },
      { value: "experienced", label: "Some experience" },
      { value: "expert", label: "Expert" },
    ],
  },
  household: {
    label: "Good with",
    multi: true,
    options: [
      { value: "children", label: "Children" },
      { value: "other-pets", label: "Other pets" },
      { value: "both", label: "Both" },
      { value: "neither", label: "Neither" },
    ],
  },
  hours: {
    label: "Hours of attention",
    multi: true,
    options: [
      { value: "most-day", label: "Most of day" },
      { value: "few-hours", label: "A few hours" },
      { value: "evening", label: "Often away, home by evening" },
    ],
  },
  grooming: {
    label: "Grooming",
    multi: true,
    options: [
      { value: "love-it", label: "Loves it" },
      { value: "occasional", label: "Occasional" },
      { value: "low-maintenance", label: "Low-maintenance" },
    ],
  },
  priority: {
    label: "Personality fits people who want",
    multi: true,
    options: [
      { value: "loyalty", label: "Loyalty" },
      { value: "playfulness", label: "Playfulness" },
      { value: "affection", label: "Affection" },
      { value: "independence", label: "Independence" },
    ],
  },
};

const emptyForm = {
  name: "",
  image: "",
  type: "",
  breed: "",
  age: "",
  gender: "",
  description: "",
  tags: {
    activity: [],
    home: [],
    size: "",
    energy: "",
    experience: [],
    household: [],
    hours: [],
    grooming: [],
    priority: [],
  },
};

export default function ManageDogs() {
  const [activeShelter, setActiveShelter] = useState("yoda");
  const [dogs, setDogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [deletingId, setDeletingId] = useState(null);

  const collectionName = `dogs_${activeShelter}`;

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

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (dog) => {
    setEditingId(dog.id);
    setFormData({
      name: dog.name || "",
      image: dog.image || "",
      type: dog.type || "",
      breed: dog.breed || "",
      age: dog.age || "",
      gender: dog.gender || "",
      description: dog.description || "",
      tags: {
        activity: dog.tags?.activity || [],
        home: dog.tags?.home || [],
        size: dog.tags?.size || "",
        energy: dog.tags?.energy || "",
        experience: dog.tags?.experience || [],
        household: dog.tags?.household || [],
        hours: dog.tags?.hours || [],
        grooming: dog.tags?.grooming || [],
        priority: dog.tags?.priority || [],
      },
    });
    setFormError("");
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setFormError("");
  };

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateTagSingle = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      tags: { ...prev.tags, [key]: prev.tags[key] === value ? "" : value },
    }));
  };

  const toggleTagMulti = (key, value) => {
    setFormData((prev) => {
      const current = prev.tags[key] || [];
      const next = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      return { ...prev, tags: { ...prev.tags, [key]: next } };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setFormError("Please enter the pet's name.");
      return;
    }
    if (!formData.image.trim()) {
      setFormError("Please enter an image URL.");
      return;
    }
    if (!formData.type) {
      setFormError("Please pick whether this pet is a dog or cat.");
      return;
    }

    setSubmitting(true);
    setFormError("");

    const docData = {
      name: formData.name.trim(),
      image: formData.image.trim(),
      type: formData.type,
      breed: formData.breed.trim(),
      age: formData.age.trim(),
      gender: formData.gender,
      description: formData.description.trim(),
      tags: {
        type: formData.type,
        activity: formData.tags.activity,
        home: formData.tags.home,
        size: formData.tags.size,
        energy: formData.tags.energy,
        experience: formData.tags.experience,
        household: formData.tags.household,
        hours: formData.tags.hours,
        grooming: formData.tags.grooming,
        priority: formData.tags.priority,
      },
    };

    try {
      if (editingId) {
        await updateDoc(doc(db, collectionName, editingId), docData);
        setDogs((prev) =>
          prev.map((d) => (d.id === editingId ? { ...d, ...docData } : d))
        );
      } else {
        const docRef = await addDoc(collection(db, collectionName), {
          ...docData,
          addedAt: serverTimestamp(),
        });
        setDogs((prev) => [
          { id: docRef.id, ...docData, addedAt: new Date() },
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
          + Add Pet
        </button>
      </div>

      <div className="bg-white rounded-2xl p-6 md:p-8 min-h-[300px]">
        {loading && (
          <p className="text-center text-[#6B1A1A]/60 py-12" style={{ fontFamily: "var(--font-montserrat)" }}>
            Loading pets...
          </p>
        )}

        {!loading && error && (
          <p className="text-center text-[#6B1A1A]/80 py-12" style={{ fontFamily: "var(--font-montserrat)" }}>
            {error}
          </p>
        )}

        {!loading && !error && dogs.length === 0 && (
          <p className="text-center text-[#6B1A1A]/60 italic py-12" style={{ fontFamily: "var(--font-montserrat)" }}>
            No pets yet. Click &quot;+ Add Pet&quot; to add one.
          </p>
        )}

        {!loading && !error && dogs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dogs.map((dog) => (
              <div key={dog.id} className="bg-[#FAF6EF] rounded-2xl overflow-hidden border border-[#6B1A1A]/10">
                <div className="aspect-[4/3] bg-[#6B1A1A]/5 overflow-hidden">
                  <img
                    src={dog.image}
                    alt={dog.name}
                    className="w-full h-full object-cover object-top"
                    onError={(e) => { e.currentTarget.style.opacity = "0.3"; }}
                  />
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="text-xl text-[#6B1A1A]" style={{ fontFamily: "var(--font-spartan)" }}>
                      {dog.name}
                    </h3>
                    {dog.type && (
                      <p className="text-xs text-[#6B1A1A]/60 uppercase tracking-wider mt-0.5"
                         style={{ fontFamily: "var(--font-spartan)" }}>
                        {dog.type}{dog.breed ? ` · ${dog.breed}` : ""}
                      </p>
                    )}
                  </div>
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

      {/* Add/Edit Modal */}
      {showForm && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeForm}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-[#FAF6EF] rounded-2xl shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeForm}
              className="absolute top-4 right-4 z-10 w-9 h-9 flex items-center justify-center text-[#6B1A1A] hover:bg-[#6B1A1A]/10 rounded-full transition-colors cursor-pointer"
              aria-label="Close"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className="p-8 md:p-10">
              <h3 className="text-2xl md:text-3xl text-[#6B1A1A] mb-2" style={{ fontFamily: "var(--font-spartan)" }}>
                {editingId ? "Edit Pet" : "Add a New Pet"}
              </h3>
              <p className="text-sm text-[#6B1A1A]/70 mb-6" style={{ fontFamily: "var(--font-montserrat)" }}>
                Adding to <strong>{activeShelter.toUpperCase()}</strong>
              </p>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* ─── BASICS ────────────────────────────── */}
                <Section title="Basics">
                  <Field
                    label="Pet Name *"
                    value={formData.name}
                    onChange={(v) => updateField("name", v)}
                    placeholder="e.g. Rocky"
                  />
                  <RadioGroup
                    label="Type *"
                    value={formData.type}
                    options={[
                      { value: "dog", label: "Dog" },
                      { value: "cat", label: "Cat" },
                    ]}
                    onChange={(v) => updateField("type", v)}
                  />
                  <Field
                    label="Image URL *"
                    value={formData.image}
                    onChange={(v) => updateField("image", v)}
                    placeholder="https://i.postimg.cc/.../yourpet.jpg"
                  />
                  <p className="text-xs text-[#6B1A1A]/60 italic leading-relaxed -mt-2">
                    Tip: Upload your photo to{" "}
                    <a href="https://postimages.org" target="_blank" rel="noopener noreferrer" className="underline">
                      postimages.org
                    </a>{" "}
                    (free, no signup). After upload, copy the &quot;Direct link&quot; URL.
                  </p>
                  {formData.image && (
                    <div className="rounded-xl overflow-hidden bg-white border border-[#6B1A1A]/10 aspect-[4/3]">
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover object-top"
                        onError={(e) => { e.currentTarget.style.opacity = "0.3"; }}
                      />
                    </div>
                  )}
                </Section>

                {/* ─── DETAILS ───────────────────────────── */}
                <Section title="Details (optional)">
                  <Field
                    label="Breed"
                    value={formData.breed}
                    onChange={(v) => updateField("breed", v)}
                    placeholder="e.g. Indian Indie"
                  />
                  <Field
                    label="Age"
                    value={formData.age}
                    onChange={(v) => updateField("age", v)}
                    placeholder="e.g. 2 months, Adult"
                  />
                  <RadioGroup
                    label="Gender"
                    value={formData.gender}
                    options={[
                      { value: "Male", label: "Male" },
                      { value: "Female", label: "Female" },
                    ]}
                    onChange={(v) => updateField("gender", v)}
                    optional
                  />
                  <TextareaField
                    label="Description"
                    value={formData.description}
                    onChange={(v) => updateField("description", v)}
                    placeholder="Tell adopters what makes this pet special..."
                  />
                </Section>

                {/* ─── PERSONALITY ──────────────────────── */}
                <Section title="Personality (for the matching quiz)">
                  <p className="text-xs text-[#6B1A1A]/70 italic -mt-3 mb-4">
                    Pick what fits this pet. Pets with no personality data won&apos;t appear in the quiz.
                  </p>

                  {Object.entries(TAG_OPTIONS).map(([key, config]) => (
                    <TagPicker
                      key={key}
                      label={config.label}
                      options={config.options}
                      value={formData.tags[key]}
                      multi={config.multi}
                      onToggle={(v) =>
                        config.multi
                          ? toggleTagMulti(key, v)
                          : updateTagSingle(key, v)
                      }
                    />
                  ))}
                </Section>

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
                    {submitting ? "Saving..." : editingId ? "Save Changes" : "Add Pet"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirmation */}
      {deletingId && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={() => setDeletingId(null)}
        >
          <div
            className="relative w-full max-w-md bg-[#FAF6EF] rounded-2xl shadow-2xl p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-2xl text-[#6B1A1A] mb-3" style={{ fontFamily: "var(--font-spartan)" }}>
              Delete this pet?
            </h3>
            <p className="text-sm text-[#6B1A1A]/75 mb-6" style={{ fontFamily: "var(--font-montserrat)" }}>
              This will remove the pet from the live website. This can&apos;t be undone.
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

// ─── Helper components ───────────────────────────────────

function Section({ title, children }) {
  return (
    <div className="space-y-4">
      <h4
        className="text-xs tracking-[0.25em] text-[#6B1A1A]/70 uppercase border-b border-[#6B1A1A]/15 pb-2"
        style={{ fontFamily: "var(--font-spartan)" }}
      >
        {title}
      </h4>
      {children}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = "text" }) {
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
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full px-5 py-3 bg-white border border-[#6B1A1A]/20 rounded-full text-[#6B1A1A] placeholder:text-[#6B1A1A]/40 focus:outline-none focus:border-[#6B1A1A] transition-colors"
        style={{ fontFamily: "var(--font-montserrat)" }}
      />
    </label>
  );
}

function TextareaField({ label, value, onChange, placeholder }) {
  return (
    <label className="block">
      <span
        className="block text-xs tracking-[0.2em] text-[#6B1A1A]/70 uppercase mb-2"
        style={{ fontFamily: "var(--font-spartan)" }}
      >
        {label}
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={4}
        placeholder={placeholder}
        className="w-full px-5 py-3 bg-white border border-[#6B1A1A]/20 rounded-2xl text-[#6B1A1A] placeholder:text-[#6B1A1A]/40 focus:outline-none focus:border-[#6B1A1A] transition-colors resize-none"
        style={{ fontFamily: "var(--font-montserrat)" }}
      />
    </label>
  );
}

function RadioGroup({ label, value, options, onChange, optional = false }) {
  return (
    <div>
      <p
        className="text-xs tracking-[0.2em] text-[#6B1A1A]/70 uppercase mb-2"
        style={{ fontFamily: "var(--font-spartan)" }}
      >
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onChange(optional && value === o.value ? "" : o.value)}
            className={`px-5 py-2 text-sm tracking-wider rounded-full transition-colors cursor-pointer ${
              value === o.value
                ? "bg-[#6B1A1A] text-white"
                : "bg-white border border-[#6B1A1A]/20 text-[#6B1A1A] hover:bg-[#6B1A1A]/5"
            }`}
            style={{ fontFamily: "var(--font-montserrat)" }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function TagPicker({ label, options, value, multi, onToggle }) {
  const isSelected = (v) => (multi ? (value || []).includes(v) : value === v);

  return (
    <div>
      <p
        className="text-xs tracking-[0.2em] text-[#6B1A1A]/70 uppercase mb-2"
        style={{ fontFamily: "var(--font-spartan)" }}
      >
        {label}
      </p>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <button
            key={o.value}
            type="button"
            onClick={() => onToggle(o.value)}
            className={`px-4 py-1.5 text-xs tracking-wider rounded-full transition-colors cursor-pointer ${
              isSelected(o.value)
                ? "bg-[#6B1A1A] text-white"
                : "bg-white border border-[#6B1A1A]/20 text-[#6B1A1A] hover:bg-[#6B1A1A]/5"
            }`}
            style={{ fontFamily: "var(--font-spartan)", letterSpacing: "0.05em" }}
          >
            {o.label}
          </button>
        ))}
      </div>
    </div>
  );
}