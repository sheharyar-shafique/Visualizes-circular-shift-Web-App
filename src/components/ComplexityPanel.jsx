/**
 * ComplexityPanel.jsx
 * Real-time complexity analysis panel with formula display and bar chart.
 * Updates instantly as p/q change (no backend round-trip needed).
 */

function Bar({ label, value, maxValue, color, formula }) {
  const pct = maxValue > 0 ? (value / maxValue) * 100 : 0;
  return (
    <div className="bar-row">
      <div className="bar-label">{label}</div>
      <div className="bar-track">
        <div
          className="bar-fill"
          style={{
            width: `${pct}%`,
            background: color,
            transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
          }}
        />
      </div>
      <div className="bar-value" style={{ color }}>
        {value} <span className="bar-formula">{formula}</span>
      </div>
    </div>
  );
}

export default function ComplexityPanel({ params, localResult }) {
  const { p, q } = params;
  const side = Math.round(Math.sqrt(p));

  const rowShift = q % side;
  const colShift = Math.floor(q / side);
  const meshSteps = rowShift + colShift;
  const ringSteps = Math.min(q, p - q);
  const saving = ringSteps - meshSteps;
  const savingPct = ringSteps > 0 ? ((saving / ringSteps) * 100).toFixed(0) : 0;

  const maxSteps = Math.max(meshSteps, ringSteps, 1);

  return (
    <div className="complexity-panel">
      <h2 className="panel-title">
        <span className="icon">📈</span> Complexity Analysis
      </h2>

      {/* Formula section */}
      <div className="formula-section">
        <div className="formula-block">
          <div className="formula-label">Mesh Steps Formula</div>
          <div className="formula-expr">
            <span className="formula-part cyan">(q mod √p)</span>
            <span className="formula-op"> + </span>
            <span className="formula-part pink">⌊q / √p⌋</span>
          </div>
          <div className="formula-eval">
            = <span className="cyan">{rowShift}</span>
            <span className="formula-op"> + </span>
            <span className="pink">{colShift}</span>
            <span className="result"> = {meshSteps}</span>
          </div>
        </div>

        <div className="formula-block">
          <div className="formula-label">Ring Steps Formula</div>
          <div className="formula-expr">
            <span className="formula-part yellow">min(q, p − q)</span>
          </div>
          <div className="formula-eval">
            = min({q}, {p - q}) <span className="result"> = {ringSteps}</span>
          </div>
        </div>
      </div>

      {/* Bar chart */}
      <div className="bar-chart">
        <div className="chart-title">Step Count Comparison</div>
        <Bar
          label="Mesh"
          value={meshSteps}
          maxValue={maxSteps}
          color="#00e5ff"
          formula={`(q%√p) + ⌊q/√p⌋`}
        />
        <Bar
          label="Ring"
          value={ringSteps}
          maxValue={maxSteps}
          color="#ffd700"
          formula={`min(q, p−q)`}
        />
      </div>

      {/* Stats grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-label">p (nodes)</div>
          <div className="stat-value">{p}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Grid</div>
          <div className="stat-value">{side}×{side}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">q (shift)</div>
          <div className="stat-value">{q}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Row Δ</div>
          <div className="stat-value cyan">{rowShift}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Col Δ</div>
          <div className="stat-value pink">{colShift}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Mesh Steps</div>
          <div className="stat-value cyan">{meshSteps}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Ring Steps</div>
          <div className="stat-value yellow">{ringSteps}</div>
        </div>
        <div className="stat-card highlight-card">
          <div className="stat-label">Mesh Saves</div>
          <div className="stat-value green">
            {saving > 0 ? `${saving} steps (${savingPct}%)` : saving === 0 ? "Equal" : "—"}
          </div>
        </div>
      </div>

      {/* Efficiency badge */}
      {saving > 0 && (
        <div className="efficiency-banner">
          🚀 Mesh is <strong>{savingPct}% faster</strong> than Ring for this configuration
        </div>
      )}
      {saving === 0 && (
        <div className="efficiency-banner neutral">
          ⚖️ Mesh and Ring have the <strong>same step count</strong> for this configuration
        </div>
      )}

      {/* Complexity classes */}
      <div className="complexity-classes">
        <div className="cc-row">
          <span className="cc-label">Ring</span>
          <span className="cc-class yellow">O(p)</span>
          <span className="cc-desc">Linear in node count</span>
        </div>
        <div className="cc-row">
          <span className="cc-label">Mesh</span>
          <span className="cc-class cyan">O(√p)</span>
          <span className="cc-desc">Square-root improvement</span>
        </div>
      </div>
    </div>
  );
}
