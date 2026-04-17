"""
app.py — Flask REST API for Mesh Circular Shift Visualizer
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from shift_logic import circular_shift
import math

app = Flask(__name__)
CORS(app)  # allow requests from Vite dev server


@app.route("/api/shift", methods=["POST"])
def shift():
    data = request.get_json(force=True)
    p = data.get("p")
    q = data.get("q")

    # ── Validation ────────────────────────────────────────────────────────────
    errors = []
    if not isinstance(p, int) or p < 4 or p > 64:
        errors.append("p must be an integer between 4 and 64")
    else:
        side = int(math.isqrt(p))
        if side * side != p:
            errors.append("p must be a perfect square (4, 9, 16, 25, 36, 49, 64)")

    if not isinstance(q, int) or q < 1:
        errors.append("q must be a positive integer")
    elif isinstance(p, int) and q >= p:
        errors.append(f"q must be less than p ({p})")

    if errors:
        return jsonify({"error": "; ".join(errors)}), 400

    try:
        result = circular_shift(p, q)
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})


if __name__ == "__main__":
    app.run(debug=True, port=5000)
