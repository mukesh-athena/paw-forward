"use client";

import { useState, useEffect } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, deleteDoc, doc, query, orderBy } from "firebase/firestore";

export default function StrayReports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchReports() {
      setLoading(true);
      setError(null);
      try {
        const q = query(collection(db, "stray_reports"), orderBy("submittedAt", "desc"));
        const snap = await getDocs(q);
        if (cancelled) return;
        setReports(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
      } catch (err) {
        console.error("Failed to load stray reports:", err);
        if (!cancelled) setError("Couldn't load stray reports.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchReports();
    return () => { cancelled = true; };
  }, []);

  const confirmDelete = async () => {
    if (!deletingId) return;
    try {
      await deleteDoc(doc(db, "stray_reports", deletingId));
      setReports((prev) => prev.filter((r) => r.id !== deletingId));
      setDeletingId(null);
    } catch (err) {
      console.error(err);
      alert("Failed to delete. Please try again.");
    }
  };

  return (
    <div>
      <div className="bg-white rounded-2xl p-6 md:p-8 min-h-[300px]">
        {loading && <EmptyState text="Loading reports..." />}
        {!loading && error && <EmptyState text={error} />}
        {!loading && !error && reports.length === 0 && (
          <EmptyState text="No stray reports yet." italic />
        )}

        {!loading && !error && reports.length > 0 && (
          <div className="space-y-4">
            <p
              className="text-xs tracking-[0.2em] text-[#6B1A1A]/60 uppercase"
              style={{ fontFamily: "var(--font-spartan)" }}
            >
              {reports.length} report{reports.length !== 1 ? "s" : ""}
            </p>
            {reports.map((rep) => (
              <div
                key={rep.id}
                className="bg-[#FAF6EF] rounded-2xl p-5 md:p-6 border border-[#6B1A1A]/10 space-y-3"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h4
                      className="text-lg text-[#6B1A1A]"
                      style={{ fontFamily: "var(--font-playfair)" }}
                    >
                      {rep.numStrays} stray{rep.numStrays !== 1 ? "s" : ""}
                    </h4>
                    <p
                      className="text-xs text-[#6B1A1A]/60 mt-0.5"
                      style={{ fontFamily: "var(--font-spartan)", letterSpacing: "0.1em" }}
                    >
                      Reported by: <strong>{rep.name || "(anonymous)"}</strong>
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <p
                      className="text-xs text-[#6B1A1A]/60"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {formatDate(rep.submittedAt)}
                    </p>
                    <button
                      onClick={() => setDeletingId(rep.id)}
                      className="px-3 py-1.5 text-xs tracking-wider uppercase border border-[#6B1A1A]/30 text-[#6B1A1A] rounded-full hover:bg-[#6B1A1A] hover:text-white hover:border-[#6B1A1A] transition-colors cursor-pointer"
                      style={{ fontFamily: "var(--font-spartan)" }}
                    >
                      Delete
                    </button>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-x-6 gap-y-2">
                  <DetailRow label="Location" value={rep.location} />
                  <DetailRow label="Email" value={rep.email} />
                  <DetailRow label="Phone" value={rep.phone} />
                </div>

                {rep.description && (
                  <div className="pt-2 border-t border-[#6B1A1A]/10">
                    <p
                      className="text-xs tracking-[0.2em] text-[#6B1A1A]/60 uppercase mb-1"
                      style={{ fontFamily: "var(--font-spartan)" }}
                    >
                      Description
                    </p>
                    <p
                      className="text-sm text-[#6B1A1A]/85 leading-relaxed"
                      style={{ fontFamily: "var(--font-montserrat)" }}
                    >
                      {rep.description}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {deletingId && (
        <DeleteModal
          itemLabel="this stray report"
          onCancel={() => setDeletingId(null)}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}

function EmptyState({ text, italic = false }) {
  return (
    <p
      className={`text-center text-[#6B1A1A]/60 py-12 ${italic ? "italic" : ""}`}
      style={{ fontFamily: "var(--font-montserrat)" }}
    >
      {text}
    </p>
  );
}

function DetailRow({ label, value }) {
  if (!value) return null;
  return (
    <div>
      <p
        className="text-xs tracking-[0.2em] text-[#6B1A1A]/60 uppercase"
        style={{ fontFamily: "var(--font-spartan)" }}
      >
        {label}
      </p>
      <p
        className="text-sm text-[#6B1A1A]/85 break-words"
        style={{ fontFamily: "var(--font-montserrat)" }}
      >
        {value}
      </p>
    </div>
  );
}

function formatDate(ts) {
  if (!ts) return "";
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function DeleteModal({ itemLabel, onCancel, onConfirm }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
      onClick={onCancel}
    >
      <div
        className="relative w-full max-w-md bg-[#FAF6EF] rounded-2xl shadow-2xl p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <h3
          className="text-2xl text-[#6B1A1A] mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Delete {itemLabel}?
        </h3>
        <p
          className="text-sm text-[#6B1A1A]/75 mb-6"
          style={{ fontFamily: "var(--font-montserrat)" }}
        >
          This can&apos;t be undone.
        </p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-3 border border-[#6B1A1A]/30 text-[#6B1A1A] tracking-wider text-sm uppercase rounded-full hover:bg-[#6B1A1A]/5 transition-colors cursor-pointer"
            style={{ fontFamily: "var(--font-spartan)", letterSpacing: "0.1em" }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-3 bg-[#6B1A1A] text-white tracking-wider text-sm uppercase rounded-full hover:bg-[#8a2424] transition-colors cursor-pointer"
            style={{ fontFamily: "var(--font-spartan)", letterSpacing: "0.1em" }}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}