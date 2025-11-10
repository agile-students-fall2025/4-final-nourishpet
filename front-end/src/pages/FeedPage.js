// FeedPage.js
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import "../css/FeedPage.css";
import Footer from "../components/Footer";

/** Uses your Mockaroo endpoint directly; fetch only on Search click */
const MOCKAROO_URL =
  "https://api.mockaroo.com/api/e721fed0?count=7&key=9f802050";

const fmt = (n) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  return v.toFixed(1).replace(/\.0$/, ".0");
};

// Parse one day's record (matches your sample JSON keys)
function parseDailyRecord(rec) {
  const foods = Array.isArray(rec?.["Food List"]) ? rec["Food List"] : [];
  const grams = Array.isArray(rec?.["Gram List"]) ? rec["Gram List"] : [];
  const prots = Array.isArray(rec?.["Protein List"]) ? rec["Protein List"] : [];
  const fats = Array.isArray(rec?.["Fat List"]) ? rec["Fat List"] : [];
  const carbs = Array.isArray(rec?.["Carbs List"]) ? rec["Carbs List"] : [];

  const len = Math.max(
    foods.length,
    grams.length,
    prots.length,
    fats.length,
    carbs.length
  );
  const rows = [];
  for (let i = 0; i < len; i++) {
    rows.push({
      food: foods[i] ?? "Unknown",
      grams: grams[i] ?? 0,
      protein: prots[i] ?? 0,
      fat: fats[i] ?? 0,
      carbs: carbs[i] ?? 0,
    });
  }
  return rows;
}

function FeedPage() {
  const [query, setQuery] = useState("");
  const [didSearch, setDidSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [grams, setGrams] = useState("150");
  const [showConfirm, setShowConfirm] = useState(false);

  const oneResult = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    const filtered = q
      ? rows.filter((r) => String(r.food).toLowerCase().includes(q))
      : rows;
    return filtered[0] || null;
  }, [rows, query]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setDidSearch(true);
    setError("");
    setLoading(true);
    try {
      const res = await fetch(MOCKAROO_URL, {
        credentials: "omit",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const flat = (Array.isArray(data) ? data : []).flatMap(parseDailyRecord);
      setRows(flat);
    } catch (err) {
      setError(`Failed to load Mockaroo data (${err.message}).`);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <main className="page">
        {/* Removed FeedHeader */}

        <FeedSearchSection
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          grams={grams}
          setGrams={setGrams}
        />

        <FeedOneResult
          show={didSearch}
          loading={loading}
          error={error}
          item={oneResult}
          grams={grams}
          onAdd={() => setShowConfirm(true)}
        />

        <div className="floating-btn">
          <Link to="/archives/histrecord/1">
            <button className="btn">Intake</button>
          </Link>
        </div>
      </main>

      {/* Footer sits below main content */}
      <Footer />

      {/* Confirmation popup */}
      {showConfirm && (
        <div
          className="popup-overlay"
          role="dialog"
          aria-modal="true"
          aria-label="Item added"
        >
          <div className="popup-card">
            <button
              className="btn close-btn"
              onClick={() => setShowConfirm(false)}
              aria-label="Close"
            >
              ×
            </button>
            <h2>Successfully Added!</h2>
            <p>You can check your ingredients in Intake!</p>
          </div>
        </div>
      )}
    </div>
  );
}

/* ===== child components ===== */

function FeedSearchSection({ query, setQuery, onSearch, grams, setGrams }) {
  return (
    <section className="sheet">
      <h1>Search Ingredients</h1>

      <form onSubmit={onSearch}>
        {/* Search row */}
        <div className="field">
          <input
            className="input"
            id="q"
            placeholder="e.g., Banana"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button className="btn" type="submit">
            Search
          </button>
        </div>

        {/* Grams row */}
        <div className="field">
          <input
            className="input small"
            id="grams"
            type="number"
            min="1"
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
          />
          <span className="unit">Gram</span>
        </div>
      </form>
    </section>
  );
}

function FeedOneResult({ show, loading, error, item, grams, onAdd }) {
  if (!show) return null;

  const g = Math.max(1, parseFloat(grams || "0"));
  const factor = g / 100;

  const scaled = item
    ? {
        carbs: item.carbs * factor,
        protein: item.protein * factor,
        fat: item.fat * factor,
      }
    : null;

  return (
    <section className="sheet">
      <h2>Nutrition facts</h2>

      {loading && <div className="loading">Loading…</div>}
      {!loading && error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div className="list">
          {!item && <div className="muted">No results.</div>}

          {item && (
            <div className="card">
              <div className="meta">
                <div className="food-name">{item.food}</div>
                <div className="nutri">
                  Per 100 g — Carbs: {fmt(item.carbs)} g · Protein:{" "}
                  {fmt(item.protein)} g · Fat: {fmt(item.fat)} g
                </div>
                <div className="nutri">
                  For {fmt(g)} g — Carbs: {fmt(scaled.carbs)} g · Protein:{" "}
                  {fmt(scaled.protein)} g · Fat: {fmt(scaled.fat)} g
                </div>
              </div>

              <button className="btn" type="button" onClick={onAdd}>
                Add
              </button>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default FeedPage;
