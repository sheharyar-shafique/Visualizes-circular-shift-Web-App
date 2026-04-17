"""
shift_logic.py
Pure Python implementation of Circular q-Shift on a 2D Mesh.
Testable in isolation — no Flask dependency.
"""
import math


def circular_shift(p: int, q: int) -> dict:
    """
    Simulate circular q-shift on a p-node 2D mesh.

    Stage 1 — Row Shift:  each node i → node (i + row_shift) within its row
    Stage 2 — Column Shift: each node i → node (i + col_shift) within its column

    Returns a dict with:
        before       : list of p values [0..p-1] (initial assignment: node i holds value i)
        after_row    : list after Stage 1
        after_col    : list after Stage 2 (final)
        row_shift    : q mod sqrt(p)
        col_shift    : floor(q / sqrt(p))
        total_steps  : row_shift + col_shift
        ring_steps   : min(q, p - q)
        side         : sqrt(p)
        row_arrows   : list of (from_node, to_node) for row shift
        col_arrows   : list of (from_node, to_node) for col shift
    """
    side = int(math.isqrt(p))
    if side * side != p:
        raise ValueError(f"p={p} is not a perfect square")
    if not (1 <= q <= p - 1):
        raise ValueError(f"q={q} must be in range [1, {p-1}]")

    row_shift = q % side
    col_shift = q // side

    # ── Initial state: node i holds value i ─────────────────────────────────
    before = list(range(p))

    # ── Stage 1: Row Shift ───────────────────────────────────────────────────
    after_row = [None] * p
    row_arrows = []
    for r in range(side):
        for c in range(side):
            src = r * side + c
            dst_col = (c + row_shift) % side
            dst = r * side + dst_col
            after_row[dst] = before[src]
            if row_shift > 0:
                row_arrows.append({"from": src, "to": dst})

    # ── Stage 2: Column Shift ────────────────────────────────────────────────
    after_col = [None] * p
    col_arrows = []
    for r in range(side):
        for c in range(side):
            src = r * side + c
            dst_row = (r + col_shift) % side
            dst = dst_row * side + c
            after_col[dst] = after_row[src]
            if col_shift > 0:
                col_arrows.append({"from": src, "to": dst})

    # ── Complexity numbers ───────────────────────────────────────────────────
    total_steps = row_shift + col_shift
    ring_steps = min(q, p - q)

    return {
        "before": before,
        "after_row": after_row,
        "after_col": after_col,
        "row_shift": row_shift,
        "col_shift": col_shift,
        "total_steps": total_steps,
        "ring_steps": ring_steps,
        "side": side,
        "row_arrows": row_arrows,
        "col_arrows": col_arrows,
    }


if __name__ == "__main__":
    result = circular_shift(16, 5)
    print("row_shift:", result["row_shift"])    # 1
    print("col_shift:", result["col_shift"])    # 1
    print("total_steps:", result["total_steps"])  # 2
    print("ring_steps:", result["ring_steps"])  # 5
    print("before:", result["before"])
    print("after_row:", result["after_row"])
    print("after_col:", result["after_col"])
