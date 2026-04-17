/**
 * MeshGrid.jsx
 * Renders the p-node mesh grid with Before / After Row / After Column panels
 * and animated directional arrows between nodes.
 */
import { useState, useEffect } from "react";

function Arrow({ from, to, side, color, visible }) {
  const cellSize = Math.min(72, 280 / side);
  const half = cellSize / 2;

  const fx = (from % side) * cellSize + half;
  const fy = Math.floor(from / side) * cellSize + half;
  const tx = (to % side) * cellSize + half;
  const ty = Math.floor(to / side) * cellSize + half;

  if (!visible) return null;

  // Arrow midpoint for label
  const mx = (fx + tx) / 2;
  const my = (fy + ty) / 2;

  // Marker id must be unique
  const markerId = `arrow-${from}-${to}-${color.replace("#", "")}`;

  return (
    <g opacity={visible ? 1 : 0} style={{ transition: "opacity 0.4s" }}>
      <defs>
        <marker
          id={markerId}
          markerWidth="8"
          markerHeight="8"
          refX="6"
          refY="3"
          orient="auto"
        >
          <path d="M0,0 L0,6 L8,3 z" fill={color} />
        </marker>
      </defs>
      <line
        x1={fx}
        y1={fy}
        x2={tx}
        y2={ty}
        stroke={color}
        strokeWidth="2"
        markerEnd={`url(#${markerId})`}
        strokeDasharray="4 2"
        opacity="0.85"
      />
    </g>
  );
}

function GridPanel({ title, data, side, arrows, arrowColor, highlight, phase }) {
  const cellSize = Math.min(72, 280 / side);
  const gridSize = cellSize * side;

  return (
    <div className={`grid-panel ${phase}`}>
      <div className="grid-panel-title">{title}</div>
      <div className="grid-wrapper" style={{ position: "relative" }}>
        {/* SVG layer for arrows */}
        <svg
          className="arrow-svg"
          width={gridSize}
          height={gridSize}
          style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none", zIndex: 10 }}
        >
          {arrows.map((a, i) => (
            <Arrow
              key={i}
              from={a.from}
              to={a.to}
              side={side}
              color={arrowColor}
              visible={true}
            />
          ))}
        </svg>

        {/* Node grid */}
        <div
          className="node-grid"
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${side}, ${cellSize}px)`,
            gridTemplateRows: `repeat(${side}, ${cellSize}px)`,
            width: gridSize,
            height: gridSize,
          }}
        >
          {data.map((val, idx) => (
            <div
              key={idx}
              className={`node-cell ${highlight.includes(idx) ? "node-active" : ""}`}
              style={{ width: cellSize, height: cellSize }}
            >
              <span className="node-index">{idx}</span>
              <span className="node-value">{val}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function MeshGrid({ result, animating }) {
  const [step, setStep] = useState(0); // 0=before, 1=after_row, 2=after_col

  // Auto-advance animation
  useEffect(() => {
    if (!result || !animating) return;
    setStep(0);
    const t1 = setTimeout(() => setStep(1), 800);
    const t2 = setTimeout(() => setStep(2), 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [result, animating]);

  if (!result) {
    return (
      <div className="mesh-placeholder">
        <div className="placeholder-icon">⬡</div>
        <p>Enter parameters and press <strong>Run Simulation</strong> to visualize the mesh shift.</p>
      </div>
    );
  }

  const { before, after_row, after_col, row_arrows, col_arrows, side } = result;

  // Active nodes during animation (those involved in current step's arrows)
  const rowActive = row_arrows.flatMap((a) => [a.from, a.to]);
  const colActive = col_arrows.flatMap((a) => [a.from, a.to]);

  return (
    <div className="mesh-container">
      <div className="step-indicator">
        <button className={`step-btn ${step === 0 ? "active" : ""}`} onClick={() => setStep(0)}>
          <span>1</span> Before
        </button>
        <div className={`step-connector ${step >= 1 ? "done" : ""}`} />
        <button className={`step-btn ${step === 1 ? "active" : ""}`} onClick={() => setStep(1)}>
          <span>2</span> Row Shift
        </button>
        <div className={`step-connector ${step >= 2 ? "done" : ""}`} />
        <button className={`step-btn ${step === 2 ? "active" : ""}`} onClick={() => setStep(2)}>
          <span>3</span> Col Shift
        </button>
      </div>

      <div className="grid-panels">
        {step === 0 && (
          <GridPanel
            title="📊 Initial State"
            data={before}
            side={side}
            arrows={[]}
            arrowColor="#00e5ff"
            highlight={[]}
            phase="phase-before"
          />
        )}
        {step === 1 && (
          <GridPanel
            title="↔ After Stage 1 — Row Shift"
            data={after_row}
            side={side}
            arrows={row_arrows}
            arrowColor="#00e5ff"
            highlight={rowActive}
            phase="phase-row"
          />
        )}
        {step === 2 && (
          <GridPanel
            title="↕ After Stage 2 — Column Shift"
            data={after_col}
            side={side}
            arrows={col_arrows}
            arrowColor="#ff006e"
            highlight={colActive}
            phase="phase-col"
          />
        )}
      </div>

      {/* All-three summary row */}
      <div className="summary-row">
        <div className="summary-mini">
          <div className="mini-label">Before</div>
          <div className="mini-grid" style={{ gridTemplateColumns: `repeat(${side}, 1fr)` }}>
            {before.map((v, i) => <div key={i} className="mini-cell">{v}</div>)}
          </div>
        </div>
        <div className="summary-arrow">→</div>
        <div className="summary-mini">
          <div className="mini-label" style={{ color: "#00e5ff" }}>After Row</div>
          <div className="mini-grid" style={{ gridTemplateColumns: `repeat(${side}, 1fr)` }}>
            {after_row.map((v, i) => <div key={i} className="mini-cell mini-cyan">{v}</div>)}
          </div>
        </div>
        <div className="summary-arrow">→</div>
        <div className="summary-mini">
          <div className="mini-label" style={{ color: "#ff006e" }}>Final</div>
          <div className="mini-grid" style={{ gridTemplateColumns: `repeat(${side}, 1fr)` }}>
            {after_col.map((v, i) => <div key={i} className="mini-cell mini-pink">{v}</div>)}
          </div>
        </div>
      </div>
    </div>
  );
}
