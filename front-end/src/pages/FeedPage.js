import React, { useMemo, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../css/FeedPage.css";
import Footer from "../components/Footer";
import { API } from "../api";

const foodDB = `${API}/api/fooddata`;
const searchAPI = `${API}/api/foods/search`;

const fmt = (n) => {
  const v = Number(n);
  if (!Number.isFinite(v)) return "—";
  return v.toFixed(1).replace(/\.0$/, ".0");
};

function FeedPage() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [didSearch, setDidSearch] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rows, setRows] = useState([]);
  const [error, setError] = useState("");
  const [grams, setGrams] = useState("150");
  const [showConfirm, setShowConfirm] = useState(false);

  const [todayLog, setTodayLog] = useState(null); //hold log id
  const [isSaving, setIsSaving] = useState(false);

  // Debounce search for suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!query.trim()) {
        setSuggestions([]);
        return;
      }

      try {
        const token = localStorage.getItem("token");
        const res = await fetch(`${searchAPI}?q=${encodeURIComponent(query)}`, {
          headers: {
            Accept: "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
        });
        if (res.ok) {
          const data = await res.json();
          setSuggestions(data);
        }
      } catch (err) {
        console.error("Failed to fetch suggestions", err);
      }
    };

    const timerId = setTimeout(() => {
      if (query.length > 0) {
        fetchSuggestions();
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(timerId);
  }, [query]);



  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    setDidSearch(true);
    setError("");
    setLoading(true);
    setShowSuggestions(false); // Hide suggestions on search

    try {
      const token = localStorage.getItem("token");
      // Use the search API instead of fetching all data
      const res = await fetch(`${searchAPI}?q=${encodeURIComponent(query)}`, {
        headers: {
          Accept: "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Food DB data is not an array");
      }
      setRows(data);
    } catch (err) {
      setError(`Failed to load foodDB (${err.message}).`);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion.food);
    setShowSuggestions(false);
    // Optionally trigger search immediately
    // handleSearch(); 
    // But maybe user wants to edit grams first, so let's just populate the field.
    // Actually, let's set the rows directly to this item so it shows up immediately
    setRows([suggestion]);
    setDidSearch(true);
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
      grams: parseFloat(parseFloat(grams).toFixed(1)),
      protein: parseFloat(scaledData.protein.toFixed(1)),
      fat: parseFloat(scaledData.fat.toFixed(1)),
      carbs: parseFloat(scaledData.carbs.toFixed(1)),
    };

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/addfooditem`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token ? `Bearer ${token}` : "",
        },
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
    <div className="feedpage">
      <main className="feedpage-main">
        {/* Removed FeedHeader */}

        <FeedSearchSection
          query={query}
          setQuery={setQuery}
          onSearch={handleSearch}
          grams={grams}
          setGrams={setGrams}
          suggestions={suggestions}
          showSuggestions={showSuggestions}
          setShowSuggestions={setShowSuggestions}
          onSuggestionClick={handleSuggestionClick}
        />

        <FeedResultsList
          show={didSearch}
          loading={loading}
          error={error}
          items={rows}
          grams={grams}
          onAdd={handleAddFood}
        />

        <div className="floating-btn">
          <Link to="/archives/histrecord/today">
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


    </div>
  );
}

/* ===== child components ===== */

function FeedHeader() {
  return (
    <div className="page-header">
      <h1>Feed Page</h1>
    </div>
  );
}

function FeedSearchSection({
  query,
  setQuery,
  onSearch,
  grams,
  setGrams,
  suggestions,
  showSuggestions,
  setShowSuggestions,
  onSuggestionClick
}) {
  return (
    <section className="sheet">
      <h1>Search Ingredients</h1>

      <form onSubmit={onSearch} className="search-form">
        {/* Search row */}
        <div className="field search-field">
          <div className="input-wrapper">
            <input
              className="input"
              id="q"
              placeholder="e.g., Banana"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setShowSuggestions(true);
              }}
              onFocus={() => setShowSuggestions(true)}
              onBlur={() => setTimeout(() => setShowSuggestions(false), 200)} // Delay to allow click
              autoComplete="off"
            />
            {showSuggestions && suggestions.length > 0 && (
              <ul className="suggestions-list">
                {suggestions.map((item) => (
                  <li
                    key={item._id}
                    className="suggestion-item"
                    onClick={() => onSuggestionClick(item)}
                  >
                    {item.food}
                  </li>
                ))}
              </ul>
            )}
          </div>
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
            step="0.1"
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
          />
          <span className="unit">Gram</span>
        </div>
      </form>
    </section>
  );
}

function FeedResultsList({ show, loading, error, items, grams, onAdd }) {
  if (!show) return null;

  const g = Math.max(1, parseFloat(grams || "0"));
  const factor = g / 100;

  return (
    <section className="sheet results-sheet">
      <h2>Nutrition facts</h2>

      {loading && <div className="loading">Loading…</div>}
      {!loading && error && <div className="error">{error}</div>}

      {!loading && !error && (
        <div className="results-list">
          {items.length === 0 && <div className="muted">No results.</div>}

          {items.map((item) => {
            const scaled = {
              carbs: item.carbs * factor,
              protein: item.protein * factor,
              fat: item.fat * factor,
            };

            return (
              <div className="card" key={item._id}>
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
            );
          })}
        </div>
      )}
    </section>
  );
}

export default FeedPage;
