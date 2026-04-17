/**
 * ControlPanel.jsx
 * User input controls: p (grid size) and q (shift amount) with validation.
 */
import { useState, useEffect } from "react";
import { VALID_P_VALUES } from "../utils/shiftLogic";

export default function ControlPanel({ onSimulate, onParamsChange, loading }) {
  const [p, setP] = useState(16);
  const [q, setQ] = useState(5);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    // Clamp q when p changes
    if (q >= p) setQ(1);
    onParamsChange({ p: Number(p), q: Math.min(Number(q), p - 1) });
  }, [p]);

  useEffect(() => {
    onParamsChange({ p: Number(p), q: Number(q) });
  }, [q]);

  const validate = () => {
    const errs = [];
    if (!VALID_P_VALUES.includes(Number(p)))
      errs.push(`p must be a perfect square: ${VALID_P_VALUES.join(", ")}`);
    if (Number(q) < 1 || Number(q) >= Number(p))
      errs.push(`q must be between 1 and ${p - 1}`);
    setErrors(errs);
    return errs.length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSimulate({ p: Number(p), q: Number(q) });
  };

  return (
    <div className="control-panel">
      <h2 className="panel-title">
        <span className="icon">⚙️</span> Parameters
      </h2>

      <form onSubmit={handleSubmit} className="control-form">
        {/* p selector */}
        <div className="field-group">
          <label htmlFor="p-select" className="field-label">
            Grid Size <span className="label-sub">(p nodes)</span>
          </label>
          <div className="select-wrapper">
            <select
              id="p-select"
              value={p}
              onChange={(e) => setP(Number(e.target.value))}
              className="styled-select"
            >
              {VALID_P_VALUES.map((v) => (
                <option key={v} value={v}>
                  {v} nodes ({Math.round(Math.sqrt(v))} × {Math.round(Math.sqrt(v))})
                </option>
              ))}
            </select>
          </div>
          <span className="field-hint">Perfect squares only (4 – 64)</span>
        </div>

        {/* q input */}
        <div className="field-group">
          <label htmlFor="q-input" className="field-label">
            Shift Amount <span className="label-sub">(q)</span>
          </label>
          <div className="range-wrapper">
            <input
              id="q-input"
              type="range"
              min={1}
              max={p - 1}
              value={q}
              onChange={(e) => setQ(Number(e.target.value))}
              className="styled-range"
            />
            <span className="range-value">{q}</span>
          </div>
          <input
            type="number"
            min={1}
            max={p - 1}
            value={q}
            onChange={(e) => setQ(Number(e.target.value))}
            className="styled-input"
            placeholder={`1 – ${p - 1}`}
          />
          <span className="field-hint">1 ≤ q ≤ {p - 1}</span>
        </div>

        {/* Shift preview badges */}
        <div className="shift-preview">
          <div className="badge badge-row">
            Row Δ = <strong>{Number(q) % Math.round(Math.sqrt(p))}</strong>
          </div>
          <div className="badge badge-col">
            Col Δ = <strong>{Math.floor(Number(q) / Math.round(Math.sqrt(p)))}</strong>
          </div>
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="error-box">
            {errors.map((e, i) => (
              <div key={i} className="error-item">⚠ {e}</div>
            ))}
          </div>
        )}

        <button
          type="submit"
          className={`run-btn ${loading ? "loading" : ""}`}
          disabled={loading}
        >
          {loading ? (
            <><span className="spinner" /> Computing…</>
          ) : (
            <><span className="btn-icon">▶</span> Run Simulation</>
          )}
        </button>
      </form>
    </div>
  );
}
