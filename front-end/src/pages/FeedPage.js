// FeedPage.js
import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/FeedPage.css";
import Footer from "../components/Footer";

const foodDB = "http://localhost:5000/api/fooddata";

const fmt = (n) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  return v.toFixed(1).replace(/\.0$/, ".0");
};

function FeedPage() {
  const [query, setQuery] = useState("");
  const [didSearch, setDidSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [grams, setGrams] = useState("150");
  const [showConfirm, setShowConfirm] = useState(false);

<<<<<<< HEAD
  const [todayLog, setTodayLog] = useState(null); //hold log id
  const [isSaving, setIsSaving] = useState(false);

  // Filter then take just ONE result
=======
>>>>>>> 23abd83d404f467b560922b13a5dc804c239fafd
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
      const res = await fetch(foodDB, {
        credentials: "omit",
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Food DB data is not an array");
      }
      // Your data is already the flat list of foods. Just set it.
      setRows(data);
    } catch (err) {
      setError(`Failed to load foodDB (${err.message}).`);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddFood = async (item, scaledData, grams) => {
    // Check if the item is missing
    if (!item || !scaledData) {
      setError("No food item selected.");
      return;
    }

    setIsSaving(true);
    setError("");

    const newIntake = {
      foodName: item.food,
      grams: parseInt(grams),
      protein: scaledData.protein,
      fat: scaledData.fat,
      carbs: scaledData.carbs,
    };

    try {
      const res = await fetch('http://localhost:5000/api/addfooditem', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newIntake),
      });

      if (!res.ok) {
        throw new Error(`Server error: ${res.statusText}`);
      }

      const result = await res.json();

      setTodayLog(result.updatedLog);
      setShowConfirm(true);

    } catch (err) {
      setError(`Failed to save food: ${err.message}`);
    } finally {
      setIsSaving(false);
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
          onAdd={handleAddFood}
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
              disabled={isSaving}
            >
              {isSaving ? "Adding..." : "x"}
            </button>
            <h2>Successfully Added!</h2>
            <p>You can check your ingredients in Intake!</p>
          </div>
        </div>
      )}
<<<<<<< HEAD


=======
>>>>>>> 23abd83d404f467b560922b13a5dc804c239fafd
    </div>
  );
}

/* ===== child components ===== */

<<<<<<< HEAD
function FeedHeader() {
  return (
    <div className="page-header">
      <h1>Feed Page</h1>
    </div>
  );
}

=======
>>>>>>> 23abd83d404f467b560922b13a5dc804c239fafd
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

              <button 
                className="btn" 
                type="button" 
                onClick={() => onAdd(item, scaled, g)}
              >
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
