/**
 * App.jsx
 * Root component — orchestrates state, calls Flask API, passes data to children.
 */
import { useState, useCallback } from "react";
import ControlPanel from "./components/ControlPanel";
import MeshGrid from "./components/MeshGrid";
import ComplexityPanel from "./components/ComplexityPanel";
import { circularShift } from "./utils/shiftLogic";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

export default function App() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [params, setParams] = useState({ p: 16, q: 5 });

  // Called on every p/q change for instant complexity panel update
  const handleParamsChange = useCallback((newParams) => {
    setParams(newParams);
  }, []);

  // Called when user clicks "Run Simulation"
  const handleSimulate = async ({ p, q }) => {
    setLoading(true);
    setError(null);
    setAnimating(false);

    try {
      const res = await fetch(`${API_BASE}/api/shift`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ p, q }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Server error");
      setResult(data);
      setAnimating(true);
    } catch (err) {
      // Fallback to JS implementation if backend is unreachable
      console.warn("Backend unreachable, using JS fallback:", err.message);
      try {
        const jsResult = circularShift(p, q);
        // Normalize keys to match API response
        setResult({
          before: jsResult.before,
          after_row: jsResult.afterRow,
          after_col: jsResult.afterCol,
          row_arrows: jsResult.rowArrows,
          col_arrows: jsResult.colArrows,
          row_shift: jsResult.rowShift,
          col_shift: jsResult.colShift,
          total_steps: jsResult.totalSteps,
          ring_steps: jsResult.ringSteps,
          side: jsResult.side,
        });
        setAnimating(true);
        setError("⚠ Backend offline — using client-side computation");
      } catch (jsErr) {
        setError(`Error: ${jsErr.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="header-icon">⬡</div>
          <div>
            <h1 className="app-title">Mesh Circular Shift Visualizer</h1>
            <p className="app-subtitle">
              2D Mesh All-to-All Personalized Communication · Parallel &amp; Distributed Computing
            </p>
          </div>
        </div>
        <div className="header-badges">
          <span className="badge-pill cyan">Ring O(p)</span>
          <span className="badge-pill pink">Mesh O(√p)</span>
        </div>
      </header>

      {/* Main layout */}
      <main className="app-main">
        {/* Left sidebar */}
        <aside className="left-sidebar">
          <ControlPanel
            onSimulate={handleSimulate}
            onParamsChange={handleParamsChange}
            loading={loading}
          />
          <ComplexityPanel params={params} localResult={null} />
        </aside>

        {/* Center stage */}
        <section className="center-stage">
          {error && (
            <div className={`alert ${error.startsWith("⚠") ? "alert-warn" : "alert-error"}`}>
              {error}
            </div>
          )}
          <MeshGrid result={result} animating={animating} />
        </section>
      </main>

      <footer className="app-footer">
        <span>PDC Assignment · Mesh Circular Shift · React + Python Flask</span>
      </footer>
    </div>
  );
}
