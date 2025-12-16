# Future Transport & Mobility Planner

This is a minimal React + Vite scaffold demonstrating a futuristic multi-modal transport planner (metro, EV bikes, drones, hyperloop) with a simple AI recommendation engine (simulated).

## Features included
- Interactive SVG city map with mobility icons
- Route search between two points
- Hybrid recommendation: simple rules (non-AI) + simulated AI scorer
- UI-ready for adding real maps (Leaflet/Mapbox) or AI models

## Run locally
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start dev server:
   ```bash
   npm run dev
   ```

## Notes
- This project is intentionally dependency-light (no map lib) so you can run it quickly.
- Replace the `simulateAIPredict` placeholder with real AI integration later.
