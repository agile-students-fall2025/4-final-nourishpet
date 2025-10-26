// FeedPage.js
import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";

/** Uses your Mockaroo endpoint directly; fetch only on Search click */
const MOCKAROO_URL = "https://api.mockaroo.com/api/e721fed0?count=7&key=9f802050"

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
  const fats  = Array.isArray(rec?.["Fat List"]) ? rec["Fat List"] : [];
  const carbs = Array.isArray(rec?.["Carbs List"]) ? rec["Carbs List"] : [];

  const len = Math.max(foods.length, grams.length, prots.length, fats.length, carbs.length);
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
  const [rows, setRows] = useState([]); // flattened rows (no date)
  const [error, setError] = useState("");
  const [grams, setGrams] = useState("150"); // user-entered grams

  // Filter then take just ONE result
  const oneResult = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    const filtered = q
      ? rows.filter((r) => String(r.food).toLowerCase().includes(q))
      : rows;
    return filtered[0] || null; // only the first match
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
    <div>
      <style>{`
        :root{--bg:#f7f7f8;--card:#fff;--ink:#111827;--muted:#6b7280;--ring:#e5e7eb;--accent:#eef2f7;}
        body{margin:0;background:var(--bg);color:var(--ink);font-family:system-ui,sans-serif}
        .app{max-width:960px;margin:0 auto;min-height:100vh;display:flex;flex-direction:column}
        .page{flex:1;padding:20px}
        .sheet{background:var(--card);border:1px solid var(--ring);border-radius:14px;padding:18px}
        h1{font-size:22px;margin:6px 0 12px}
        h2{font-size:18px;margin:18px 0 10px}
        .field{display:flex;gap:10px;align-items:center;margin:8px 0}
        .input{flex:1;background:#f2f4f7;border:1px solid var(--ring);padding:14px 12px;border-radius:10px;font-size:16px}
        .input.small{max-width:240px}
        .suffix{font-size:12px;color:var(--muted);margin-left:8px}
        .btn{border:1px solid var(--ring);background:#f2f4f7;padding:10px 14px;border-radius:10px;font-weight:600;cursor:pointer}
        .btn:disabled{opacity:.5;cursor:not-allowed}
        .list{display:flex;flex-direction:column;gap:12px;margin-top:8px}
        .card{background:var(--accent);border-radius:12px;padding:10px 12px;display:flex;align-items:center;gap:12px;border:1px solid var(--ring)}
        .card .meta{flex:1}
        .nutri{font-size:12px;color:var(--muted)}
        .muted{color:var(--muted)}
      `}</style>

      <div className="app">
        <main className="page">
          <FeedHeader />

          <FeedSearchSection
            query={query}
            setQuery={setQuery}
            onSearch={handleSearch}
            endpoint={MOCKAROO_URL}
            grams={grams}
            setGrams={setGrams}
          />

          <FeedOneResult
            show={didSearch}
            loading={loading}
            error={error}
            item={oneResult}
            grams={grams}
          />

          <nav
            style={{
              position: "fixed",
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              borderTop: "1px solid #ddd",
              background: "#fafafa",
            }}
          >
            <Link to="/" style={{ flex: 1 }}>
              <button className="btn" style={{ width: "100%", padding: 14 }}>
                Logo / Home
              </button>
            </Link>
          </nav>
        </main>
      </div>

      <button className="btn" style={{ margin: 16 }}>
        <Link to="/">Home Page</Link>
      </button>
    </div>
  );
}

/* ===== child components (like UserPage) ===== */

function FeedHeader() {
  return (
    <div className="page-header" style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
      <h1 style={{ margin: 0 }}>Feed Page</h1>
      <Link to="/userpage">
        <button className="btn">User</button>
      </Link>
    </div>
  );
}

function FeedSearchSection({ query, setQuery, onSearch, endpoint, grams, setGrams }) {
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
        <div className="field" style={{ marginTop: 8 }}>
          <input
            className="input small"
            id="grams"
            type="number"
            min="1"
            value={grams}
            onChange={(e) => setGrams(e.target.value)}
          />
          <span className="suffix">Gram</span>
        </div>
      </form>
    </section>
  );
}

function FeedOneResult({ show, loading, error, item, grams }) {
  if (!show) return null;

  // scale assuming item values are per 100 g
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
    <section className="sheet" style={{ marginTop: 16 }}>
      <h2>Nutrition facts</h2>

      {loading && <div>Loading…</div>}
      {!loading && error && <div style={{ color: "crimson" }}>{error}</div>}

      {!loading && !error && (
        <div className="list">
          {!item && <div className="muted">No results.</div>}

          {item && (
            <div className="card">
              <div className="meta">
                <div style={{ fontWeight: 600 }}>{item.food}</div>
                <div className="nutri" style={{ marginBottom: 4 }}>
                  Per 100 g — Carbs: {fmt(item.carbs)} g · Protein: {fmt(item.protein)} g · Fat: {fmt(item.fat)} g
                </div>
                <div className="nutri">
                  For {fmt(g)} g — Carbs: {fmt(scaled.carbs)} g · Protein: {fmt(scaled.protein)} g · Fat: {fmt(scaled.fat)} g
                </div>
              </div>
              <Link to="/petpage">
                <button className="btn" type="button">Add</button>
              </Link>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default FeedPage;
