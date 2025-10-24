import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function FeedMyPetSearch() {
  const [query, setQuery] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/feed-ingredients?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div style={{ padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 24 }}>
        <h2 style={{ margin: 0 }}>Feed My Pet — Search</h2>
        <Link to="/userpage"><button>User</button></Link>
      </div>

      <form onSubmit={handleSearch} style={{ maxWidth: 480 }}>
        <label htmlFor="search" style={{ display: "block", marginBottom: 8 }}>Search Ingredients</label>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            id="search"
            type="text"
            placeholder="e.g., Banana"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            style={{ flex: 1, padding: "10px 12px" }}
          />
          <button type="submit">Search</button>
        </div>
      </form>

      {/* Intake -> Daily Records Today */}
      <Link to="/daily-records-today" style={{ position: "fixed", right: 16, bottom: 96 }}>
        <button>Intake</button>
      </Link>

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

export default FeedMyPetSearch;
