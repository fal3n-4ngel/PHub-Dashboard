import React from "react";
import { WatchlistItem, SearchResult } from "@/types";

interface WatchlistTabProps {
  watchlist: WatchlistItem[];
  watchlistFilter: "all" | "anime" | "movie" | "show";
  setWatchlistFilter: (f: "all" | "anime" | "movie" | "show") => void;
  mediaQuery: string;
  setMediaQuery: (q: string) => void;
  mediaType: "movie" | "show" | "anime" | "book";
  setMediaType: (t: "movie" | "show" | "anime" | "book") => void;
  searchMedia: (e: React.FormEvent) => void;
  isSearchingMedia: boolean;
  searchResults: SearchResult[];
  addToWatchlist: (res: SearchResult) => void;
  updateWatchItem: (item: WatchlistItem, updates: Partial<WatchlistItem>) => void;
  deleteWatchItem: (id: string) => void;
  isFetchingWatchlist: boolean;
  showLetterboxdModal: boolean;
  setShowLetterboxdModal: (show: boolean) => void;
  letterboxdCsv: string;
  setLetterboxdCsv: (s: string) => void;
  handleLetterboxdImport: () => void;
  isImportingLetterboxd: boolean;
}

export const WatchlistTab: React.FC<WatchlistTabProps> = ({
  watchlist,
  watchlistFilter,
  setWatchlistFilter,
  mediaQuery,
  setMediaQuery,
  mediaType,
  setMediaType,
  searchMedia,
  isSearchingMedia,
  searchResults,
  addToWatchlist,
  updateWatchItem,
  deleteWatchItem,
  isFetchingWatchlist,
  showLetterboxdModal,
  setShowLetterboxdModal,
  letterboxdCsv,
  setLetterboxdCsv,
  handleLetterboxdImport,
  isImportingLetterboxd,
}) => {
  const [statusFilter, setStatusFilter] = React.useState<"all" | "watching" | "plan_to_watch" | "completed" | "dropped">("all");

  const filteredWatchlist = watchlist.filter((item) => {
    if (item.type === "book") return false;
    if (watchlistFilter !== "all" && item.type !== watchlistFilter) return false;
    if (statusFilter !== "all" && item.status !== statusFilter) return false;
    return true;
  });

  const moviesWatched = watchlist.filter((i) => i.type === "movie" && i.status === "completed").length;
  const showsWatching = watchlist.filter((i) => i.type === "show" && i.status === "watching").length;
  const animeCompleted = watchlist.filter((i) => i.type === "anime" && i.status === "completed").length;
  const episodesWatched = watchlist.filter((i) => i.type === "show" || i.type === "anime").reduce((acc, i) => acc + (i.progress || 0), 0);
  const planToWatch = watchlist.filter((i) => i.type !== "book" && i.status === "plan_to_watch").length;

  return (
    <div className="animate-fade-in" style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: 700, letterSpacing: "-0.5px" }}>Media Watchlist</h1>
        <button
          onClick={() => setShowLetterboxdModal(true)}
          className="btn-secondary"
          style={{ fontSize: "12px", padding: "6px 12px", display: "flex", alignItems: "center", gap: "6px" }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
          Import Letterboxd CSV
        </button>
      </div>

      {/* Media Overview Stat Cards */}
      <div className="responsive-stats" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(170px, 1fr))", gap: "16px" }}>
        <div className="stat-card">
          <span className="label-mono">Movies Watched</span>
          <span className="stat-value">{moviesWatched}</span>
          <span className="stat-subtext">Completed movies</span>
        </div>
        <div className="stat-card">
          <span className="label-mono">Shows Watching</span>
          <span className="stat-value" style={{ color: "#3b82f6" }}>{showsWatching}</span>
          <span className="stat-subtext">TV shows in progress</span>
        </div>
        <div className="stat-card">
          <span className="label-mono">Anime Completed</span>
          <span className="stat-value" style={{ color: "#ec4899" }}>{animeCompleted}</span>
          <span className="stat-subtext">Finished anime</span>
        </div>
        <div className="stat-card">
          <span className="label-mono">Episodes Logged</span>
          <span className="stat-value">{episodesWatched}</span>
          <span className="stat-subtext">Total episodes watched</span>
        </div>
        <div className="stat-card">
          <span className="label-mono">Plan to Watch</span>
          <span className="stat-value" style={{ color: "#e39282" }}>{planToWatch}</span>
          <span className="stat-subtext">In watchlist queue</span>
        </div>
      </div>

      {/* Search Media Card */}
      <div className="bento-card">
        <span className="label-mono" style={{ marginBottom: "12px", display: "block" }}>Add Movie, TV Show, or Anime</span>
        <form onSubmit={searchMedia} style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          <select value={mediaType} onChange={(e) => setMediaType(e.target.value as any)} style={{ padding: "8px 12px", fontSize: "13px" }}>
            <option value="movie">Movie</option>
            <option value="show">TV Show</option>
            <option value="anime">Anime</option>
          </select>
          <input
            type="text"
            placeholder={`Search ${mediaType}...`}
            value={mediaQuery}
            onChange={(e) => setMediaQuery(e.target.value)}
            style={{ flex: 1, minWidth: "200px" }}
            required
          />
          <button type="submit" disabled={isSearchingMedia} className="btn-primary">
            {isSearchingMedia ? "Searching..." : "Search"}
          </button>
        </form>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div style={{ marginTop: "16px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: "12px" }}>
            {searchResults.map((res, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", backgroundColor: "var(--bg-body)", padding: "10px", borderRadius: "8px", border: "1px solid var(--border-subtle)", alignItems: "center" }}>
                {res.coverImage ? (
                  <img src={res.coverImage} alt={res.title} style={{ width: "40px", height: "56px", objectFit: "cover", borderRadius: "4px" }} />
                ) : (
                  <div style={{ width: "40px", height: "56px", backgroundColor: "var(--bg-secondary)", borderRadius: "4px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🎬</div>
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "12px", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{res.title}</p>
                  <p style={{ fontSize: "10px", color: "var(--text-muted)", marginTop: "2px" }}>{res.year || "—"}</p>
                  <button
                    onClick={() => addToWatchlist(res)}
                    className="btn-secondary"
                    style={{ fontSize: "10px", padding: "3px 8px", marginTop: "6px" }}
                  >
                    + Add
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Filter Tabs & Status Tabs */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Status Tabs */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
          <div style={{ display: "flex", gap: "4px", backgroundColor: "var(--bg-secondary)", borderRadius: "8px", padding: "3px" }}>
            {[
              { id: "all", label: "All Statuses" },
              { id: "watching", label: "Watching" },
              { id: "plan_to_watch", label: "Plan to Watch" },
              { id: "completed", label: "Completed" },
              { id: "dropped", label: "Dropped" },
            ].map((st) => (
              <button
                key={st.id}
                onClick={() => setStatusFilter(st.id as any)}
                style={{
                  fontSize: "12px",
                  fontWeight: 600,
                  padding: "6px 14px",
                  backgroundColor: statusFilter === st.id ? "#fff" : "transparent",
                  color: statusFilter === st.id ? "var(--text-primary)" : "var(--text-secondary)",
                  borderRadius: "6px",
                  boxShadow: statusFilter === st.id ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                  transition: "all 0.2s",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                {st.label}
              </button>
            ))}
          </div>

          {/* Type Filter Pills */}
          <div style={{ display: "flex", gap: "4px", backgroundColor: "var(--bg-secondary)", borderRadius: "8px", padding: "3px" }}>
            {(["all", "movie", "show", "anime"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setWatchlistFilter(f)}
                style={{
                  fontSize: "11px",
                  fontWeight: 600,
                  padding: "5px 12px",
                  backgroundColor: watchlistFilter === f ? "#fff" : "transparent",
                  color: watchlistFilter === f ? "var(--text-primary)" : "var(--text-secondary)",
                  borderRadius: "6px",
                  boxShadow: watchlistFilter === f ? "0 1px 3px rgba(0,0,0,0.05)" : "none",
                  transition: "all 0.2s",
                  border: "none",
                  cursor: "pointer",
                  textTransform: "capitalize",
                }}
              >
                {f === "all" ? "All Types" : f === "movie" ? "Movies" : f === "show" ? "TV Shows" : "Anime"}
              </button>
            ))}
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{filteredWatchlist.length} items</span>
        </div>
      </div>

      {/* Media Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
        {filteredWatchlist.map((item) => (
          <div key={item.id} className="bento-card" style={{ padding: "14px", display: "flex", gap: "12px" }}>
            {item.coverImage ? (
              <img src={item.coverImage} alt={item.title} style={{ width: "70px", height: "100px", objectFit: "cover", borderRadius: "6px", flexShrink: 0 }} />
            ) : (
              <div style={{ width: "70px", height: "100px", backgroundColor: "var(--bg-secondary)", borderRadius: "6px", flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
                {item.type === "movie" ? "🎬" : item.type === "show" ? "📺" : "🌸"}
              </div>
            )}
            <div style={{ flex: 1, minWidth: 0, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: "13.5px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={item.title}>
                  {item.title}
                </p>
                <div style={{ display: "flex", gap: "6px", alignItems: "center", marginTop: "4px" }}>
                  <span style={{ fontSize: "9px", fontFamily: "monospace", textTransform: "uppercase", backgroundColor: "var(--bg-secondary)", padding: "1px 5px", borderRadius: "3px", color: "var(--text-muted)" }}>
                    {item.type}
                  </span>
                  {item.year && <span style={{ fontSize: "11px", color: "var(--text-muted)" }}>{item.year}</span>}
                </div>
              </div>

              <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <select
                  value={item.status}
                  onChange={(e) => updateWatchItem(item, { status: e.target.value as any })}
                  style={{ fontSize: "11px", padding: "3px 6px", width: "100%" }}
                >
                  <option value="plan_to_watch">Plan to Watch</option>
                  <option value="watching">Watching</option>
                  <option value="completed">Completed</option>
                  <option value="dropped">Dropped</option>
                </select>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  {(item.type === "show" || item.type === "anime") && (
                    <div style={{ display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "var(--text-secondary)" }}>
                      <span>Ep:</span>
                      <button
                        onClick={() => updateWatchItem(item, { progress: Math.max(0, item.progress - 1) })}
                        style={{ padding: "1px 5px", fontSize: "10px", backgroundColor: "var(--bg-secondary)", border: "none", borderRadius: "3px", cursor: "pointer" }}
                      >
                        -
                      </button>
                      <span>{item.progress}</span>
                      <button
                        onClick={() => updateWatchItem(item, { progress: item.progress + 1 })}
                        style={{ padding: "1px 5px", fontSize: "10px", backgroundColor: "var(--bg-secondary)", border: "none", borderRadius: "3px", cursor: "pointer" }}
                      >
                        +
                      </button>
                      {item.totalEpisodes && <span style={{ color: "var(--text-muted)" }}>/{item.totalEpisodes}</span>}
                    </div>
                  )}
                  <button
                    onClick={() => deleteWatchItem(item.id)}
                    style={{ backgroundColor: "transparent", border: "none", color: "#b3666b", fontSize: "11px", marginLeft: "auto", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filteredWatchlist.length === 0 && (
          <p style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--text-muted)", padding: "32px" }}>
            {isFetchingWatchlist ? "Loading watchlist..." : "No items in your watchlist."}
          </p>
        )}
      </div>

      {/* Letterboxd Import Modal */}
      {showLetterboxdModal && (
        <div style={{ position: "fixed", inset: 0, zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)", padding: "16px" }}>
          <div className="bento-card" style={{ width: "100%", maxWidth: "500px", padding: "24px", display: "flex", flexDirection: "column", gap: "16px" }}>
            <h3 style={{ fontSize: "16px", fontWeight: 600 }}>Import Letterboxd Watchlist CSV</h3>
            <p style={{ fontSize: "12px", color: "var(--text-secondary)", lineHeight: 1.5 }}>
              Export your watchlist from Letterboxd (Settings &gt; Import &amp; Export &gt; Export your data), open the watchlist.csv file, and paste its raw contents below:
            </p>
            <textarea
              rows={8}
              placeholder="Date,Name,Year,Letterboxd URI..."
              value={letterboxdCsv}
              onChange={(e) => setLetterboxdCsv(e.target.value)}
              style={{ width: "100%", fontFamily: "monospace", fontSize: "11px" }}
            />
            <div style={{ display: "flex", gap: "8px", justifyContent: "flex-end" }}>
              <button className="btn-secondary" onClick={() => setShowLetterboxdModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleLetterboxdImport} disabled={isImportingLetterboxd || !letterboxdCsv.trim()}>
                {isImportingLetterboxd ? "Importing..." : "Import Movies"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
