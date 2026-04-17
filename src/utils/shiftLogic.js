/**
 * shiftLogic.js
 * Pure JS mirror of the Python shift_logic.py module.
 * Used for instant complexity panel updates without a round-trip to the backend.
 */

/**
 * Compute circular q-shift on a p-node 2D mesh.
 * @param {number} p - Total nodes (perfect square)
 * @param {number} q - Shift amount
 * @returns {object} Full simulation state
 */
export function circularShift(p, q) {
  const side = Math.round(Math.sqrt(p));
  const rowShift = q % side;
  const colShift = Math.floor(q / side);

  // Initial state: node i holds value i
  const before = Array.from({ length: p }, (_, i) => i);

  // Stage 1: Row Shift
  const afterRow = new Array(p).fill(null);
  const rowArrows = [];
  for (let r = 0; r < side; r++) {
    for (let c = 0; c < side; c++) {
      const src = r * side + c;
      const dstCol = (c + rowShift) % side;
      const dst = r * side + dstCol;
      afterRow[dst] = before[src];
      if (rowShift > 0) rowArrows.push({ from: src, to: dst });
    }
  }

  // Stage 2: Column Shift
  const afterCol = new Array(p).fill(null);
  const colArrows = [];
  for (let r = 0; r < side; r++) {
    for (let c = 0; c < side; c++) {
      const src = r * side + c;
      const dstRow = (r + colShift) % side;
      const dst = dstRow * side + c;
      afterCol[dst] = afterRow[src];
      if (colShift > 0) colArrows.push({ from: src, to: dst });
    }
  }

  return {
    before,
    afterRow,
    afterCol,
    rowShift,
    colShift,
    totalSteps: rowShift + colShift,
    ringSteps: Math.min(q, p - q),
    side,
    rowArrows,
    colArrows,
  };
}

/**
 * List of valid p values (perfect squares from 4 to 64)
 */
export const VALID_P_VALUES = [4, 9, 16, 25, 36, 49, 64];

/**
 * Validate p and q inputs.
 * @returns {object} { valid: boolean, errors: string[] }
 */
export function validateInputs(p, q) {
  const errors = [];
  const pNum = Number(p);
  const qNum = Number(q);

  if (!Number.isInteger(pNum) || !VALID_P_VALUES.includes(pNum)) {
    errors.push(`p must be a perfect square: ${VALID_P_VALUES.join(", ")}`);
  }
  if (!Number.isInteger(qNum) || qNum < 1 || qNum >= pNum) {
    errors.push(`q must be between 1 and ${pNum - 1}`);
  }
  return { valid: errors.length === 0, errors };
}
