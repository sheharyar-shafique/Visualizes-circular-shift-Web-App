# Mesh Circular Shift Visualizer

> **Live Demo:** <!-- TODO: Add deployment URL here -->

Interactive web application for visualizing **Circular q-Shift** on a **2D Mesh** topology — a fundamental operation in Parallel & Distributed Computing.

## What It Does

A circular q-shift transfers data from node `i` to node `(i + q) mod p`. On a 2D mesh, this is done efficiently in two stages:

| Stage | Operation | Steps |
|-------|-----------|-------|
| 1 — Row Shift | Each node shifts within its row by `q mod √p` positions | `q mod √p` |
| 2 — Col Shift | Each node shifts within its column by `⌊q / √p⌋` positions | `⌊q / √p⌋` |
| **Total** | **Mesh steps** | **`(q mod √p) + ⌊q/√p⌋`** |
| Ring baseline | `min(q, p−q)` steps | `O(p)` |

The mesh achieves **O(√p)** vs ring's **O(p)** — a square-root improvement.

## Project Structure

```
mesh-shift-visualizer/
├── public/
├── src/
│   ├── components/
│   │   ├── MeshGrid.jsx         ← grid rendering + animation
│   │   ├── ControlPanel.jsx     ← user inputs (p, q) + validation
│   │   └── ComplexityPanel.jsx  ← analysis panel + bar chart
│   ├── utils/
│   │   └── shiftLogic.js        ← pure shift algorithm (testable)
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── backend/
│   ├── app.py                   ← Flask REST API
│   ├── shift_logic.py           ← pure Python shift (testable)
│   └── requirements.txt
├── README.md
└── package.json
```

## Setup & Run (Local)

### 1. Frontend (React + Vite)

```bash
cd mesh-shift-visualizer
npm install
npm run dev
# → http://localhost:5173
```

### 2. Backend (Python Flask)

```bash
cd mesh-shift-visualizer/backend
pip install -r requirements.txt
python app.py
# → http://localhost:5000
```

> **Note:** The frontend has a built-in JS fallback if the backend is offline.  
> You can run the frontend alone for full functionality.

## Features

- ✅ **Input Controls** — p (4–64, perfect squares) and q (1 to p−1) with validation
- ✅ **Mesh Grid Visualization** — √p × √p grid showing node index + data value
- ✅ **Step-by-Step Animation** — Before → Row Shift → Column Shift with directional arrows
- ✅ **Before/After State** — All three states displayed with colour coding
- ✅ **Complexity Panel** — Live formula evaluation + bar chart comparing Mesh vs Ring

## Tech Stack

- **Frontend:** React 18 + Vite, Vanilla CSS (no UI library)
- **Backend:** Python 3.x + Flask + Flask-CORS

## Deployment

- Frontend → [Vercel](https://vercel.com) / [Netlify](https://netlify.com)
- Backend → [Render.com](https://render.com) (free tier)

Set the env variable `VITE_API_URL` to your deployed backend URL before building:
```bash
VITE_API_URL=https://your-backend.onrender.com npm run build
```
