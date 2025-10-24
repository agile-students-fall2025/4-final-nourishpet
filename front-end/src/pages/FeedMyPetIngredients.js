import React, { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

/* ---- helpers ---- */
function useQueryParam(name) {
  const { search } = useLocation();
  return useMemo(() => new URLSearchParams(search).get(name) || "", [search, name]);
}

// Build Mockaroo URLs from env (no hardcoding)
const MOCKAROO_ENDPOINT = (process.env.REACT_APP_MOCKAROO_ENDPOINT || "").replace(/\/$/, "");
const MOCKAROO_KEY = process.env.REACT_APP_MOCKAROO_KEY || "";

// tiny CSV parser (handles quotes, simple cases)
function parseCsv(text) {
  const rows = [];
  let cell = "", row = [], inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i], n = text[i + 1];
    if (c === '"' && inQuotes && n === '"') { cell += '"'; i++; continue; }
    if (c === '"') { inQuotes = !inQuotes; continue; }
    if (!inQuotes && (c === ",")) { row.push(cell); cell = ""; continue; }
    if (!inQuotes && (c === "\n" || c === "\r")) {
      if (cell !== "" || row.length) { row.push(cell); rows.push(row); row = []; cell = ""; }
      continue;
    }
    cell += c;
  }
  if (cell !== "" || row.length) { row.push(cell); rows.push(row); }
  if (!rows.length) return [];
  const header = rows[0].map(h => h.trim());
  return rows.slice(1).filter(r => r.length === header.length).map(r => {
    const obj = {};
    header.forEach((h, i) => { obj[h] = r[i]; });
    return obj;
  });
}

async function fetchMockaroo() {
  if (!MOCKAROO_ENDPOINT || !MOCKAROO_KEY) {
    throw new Error(
      "Missing REACT_APP_MOCKAROO_ENDPOINT or REACT_APP_MOCKAROO_KEY. " +
      "Use my.api.mockaroo.com/<schema> and your API key."
    );
  }

  // Prefer JSON
  const jsonUrl = `${MOCKAROO_ENDPOINT}.json?key=${encodeURIComponent(MOCKAROO_KEY)}&count=200`;
  const csvUrl  = `${MOCKAROO_ENDPOINT}.csv?key=${encodeURIComponent(MOCKAROO_KEY)}&count=200`;

  // try JSON
  try {
    const res = await fetch(jsonUrl, { credentials: "omit" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    if (Array.isArray(data) && data.length) return data;
  } catch (err) {
    // fall through to CSV
  }

  // try CSV
  const res = await fetch(csvUrl, { credentials: "omit" });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const text = await res.text();
  return parseCsv(text);
}

// normalize arbitrary Mockaroo columns to the ones we need
function normalizeRecord(r) {
  const entries = Object.entries(r);
  const findKey = (patterns) => {
    const e = entries.find(([k]) => patterns.some(p => k.toLowerCase().includes(p)));
    return e ? e[0] : null;
  };
  const nameKey = findKey(["ingredient", "name", "food", "item", "title"]);
  const carbKey = findKey(["carb"]);
  const protKey = findKey(["protein", "prot"]);
  const fatKey  = findKey(["fat", "lipid"]);

  const toG = (v) => {
    if (v == null) return "";
    const s = String(v).replace(/[^\d.\-]/g, "");
    if (s === "") return "";
    const num = Number(s);
    return Number.isFinite(num) ? `${num} g` : "";
    };

  return {
    name: (nameKey ? r[nameKey] : "") || "Unknown",
    carbs: toG(carbKey ? r[carbKey] : ""),
    protein: toG(protKey ? r[protKey] : ""),
    fat: toG(fatKey ? r[fatKey] : ""),
    _raw: r
  };
}

/* ---- component ---- */
function FeedMyPetIngredients() {
  const initialQ = useQueryParam("q");
  const [query, setQuery] = useState(initialQ);
  const [weight, setWeight] = useState("150");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [items, setItems] = useState([]);
  const navigate = useNavigate();

  useEffect(() => setQuery(initialQ), [initialQ]);

  useEffect(() => {
    let alive = true;
    (async () => {
      setLoading(true);
      setError("");
      try {
        const raw = await fetchMockaroo();
        const normalized = raw.map(normalizeRecord);
        if (alive) setItems(normalized);
      } catch (e) {
        if (alive) setError(
          `Could not load ingredients from Mockaroo (${e.message}). ` +
          `Ensure REACT_APP_MOCKAROO_ENDPOINT and REACT_APP_MOCKAROO_KEY are set.`
        );
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/feed-ingredients?q=${encodeURIComponent(query.trim())}`);
  };

  const filtered = useMemo(() => {
    const q = (query || "").toLowerCase();
    if (!q) return items.slice(0, 25);
    return items.filter(x => String(x.name).toLowerCase().includes(q)).slice(0, 50);
  }, [items, query]);

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Feed My Pet — Ingredients</h2>
        <Link to="/userpage"><button>User</button></Link>
      </div>

      <form onSubmit={handleSearch} style={{ maxWidth: 520 }}>
        <label htmlFor="search" style={{ display: "block", marginBottom: 8 }}>Search Ingredients</label>
        <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
          <input
            id="search"
            type="text"
            placeholder="Banana"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: "10px 12px" }}
          />
          <button type="submit">Search</button>
        </div>

        <label htmlFor="weight" style={{ display: "block", marginBottom: 8 }}>Enter the weight</label>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24 }}>
          <input
            id="weight"
            type="number"
            min="0"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            style={{ width: 120, padding: "10px 12px" }}
          />
          <span>Gram</span>
        </div>
      </form>

      <section style={{ maxWidth: 520 }}>
        <h4 style={{ margin: "0 0 12px" }}>Nutrition facts (per 100 g)</h4>

        {loading && <div>Loading ingredients…</div>}
        {!loading && error && <div style={{ color: "crimson" }}>{error}</div>}

        {!loading && !error && (
          <div style={{ display: "grid", gap: 10 }}>
            {filtered.map((r, idx) => (
              <div
                key={`${r.name}-${idx}`}
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr auto",
                  alignItems: "center",
                  gap: 12,
                  padding: 12,
                  border: "1px solid #ddd",
                  borderRadius: 8,
                }}
              >
                <div>
                  <div style={{ fontWeight: 600 }}>{r.name}</div>
                  <div style={{ fontSize: 12, opacity: 0.8 }}>
                    Carbs: {r.carbs || "—"} · Protein: {r.protein || "—"} · Fat: {r.fat || "—"}
                  </div>
                </div>

                {/* Add -> Added page */}
                <Link to="/added">
                  <button>Add</button>
                </Link>
              </div>
            ))}
            {!filtered.length && <div>No results. Try another search term.</div>}
          </div>
        )}
      </section>

      {/* Intake -> Daily Records Today */}
      <div style={{ position: "fixed", right: 16, bottom: 96 }}>
        <Link to="/daily-records-today">
          <button>Intake</button>
        </Link>
      </div>

      {/* Bottom nav */}
      <nav style={{
        position: "fixed", left: 0, right: 0, bottom: 0,
        display: "flex", borderTop: "1px solid #ddd", background: "#fafafa"
      }}>
        <Link to="/feed-search" style={{ flex: 1 }}>
          <button style={{ width: "100%", padding: 14 }}>Feed</button>
        </Link>
        <Link to="/homepage" style={{ flex: 1 }}>
          <button style={{ width: "100%", padding: 14 }}>Logo / Home</button>
        </Link>
        <Link to="/detailedrecordhistory" style={{ flex: 1 }}>
          <button style={{ width: "100%", padding: 14 }}>Records/History</button>
        </Link>
      </nav>
    </div>
  );
}

export default FeedMyPetIngredients;
