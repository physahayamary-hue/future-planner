import React from 'react'

// Simple graph of nodes (A..E) with distances (km)
const NODES = {
  A: { x: 80, y: 80 },
  B: { x: 320, y: 60 },
  C: { x: 200, y: 200 },
  D: { x: 420, y: 260 },
  E: { x: 100, y: 320 },
}

const EDGES = [
  ['A','B', 6],
  ['A','C', 4],
  ['C','B', 3],
  ['C','D', 5],
  ['C','E', 7],
  ['D','E', 4],
]

const MODES = [
  { id: 'metro', speed_kmph: 60, cost_per_km: 0.5, label: 'Metro', icon: '🚇' },
  { id: 'ev', speed_kmph: 20, cost_per_km: 0.2, label: 'EV Bike', icon: '🔋' },
  { id: 'drone', speed_kmph: 80, cost_per_km: 1.2, label: 'Drone', icon: '🛸' },
  { id: 'hyperloop', speed_kmph: 300, cost_per_km: 2.0, label: 'Hyperloop', icon: '⚡' },
]

// Non-AI shortest path (Dijkstra-like) on this tiny graph (by distance)
function shortestPath(start, end) {
  const dist = {}, prev = {}, Q = new Set(Object.keys(NODES))
  for (const n of Q) { dist[n] = Infinity; prev[n]=null }
  dist[start]=0
  while (Q.size) {
    let u = null, best = Infinity
    for (const v of Q) if (dist[v] < best) { best = dist[v]; u = v }
    if (!u) break
    Q.delete(u)
    if (u === end) break
    for (const [a,b,w] of EDGES) {
      if (a===u && Q.has(b)) {
        const alt = dist[u]+w
        if (alt < dist[b]) { dist[b]=alt; prev[b]=u }
      } else if (b===u && Q.has(a)) {
        const alt = dist[u]+w
        if (alt < dist[a]) { dist[a]=alt; prev[a]=u }
      }
    }
  }
  if (dist[end]===Infinity) return null
  const path = []
  let u = end
  while (u) { path.unshift(u); u = prev[u] }
  return { path, distance: dist[end] }
}

// Simulated AI: ranks mode choices combining distance, time & cost with a tiny learned-ish heuristic
function simulateAIPredict({distance, modes, preference}){
  // produce score for each mode; lower is better
  return modes.map(m => {
    const time = distance / m.speed_kmph
    const cost = distance * m.cost_per_km
    // heuristic: if preference fastest, time weight higher; if cheapest, cost weight higher
    const wTime = preference === 'fastest' ? 0.7 : 0.3
    const wCost = preference === 'cheapest' ? 0.7 : 0.3
    const score = wTime * time + wCost * (cost/10) // normalize cost a bit
    return { ...m, time: (time*60).toFixed(0), cost: cost.toFixed(2), score: Number(score.toFixed(3)) }
  }).sort((a,b) => a.score - b.score)
}

export default function CityMap({ start='A', end='E', preference='fastest', onChoose, showLegend=false }){
  const route = shortestPath(start, end) || { path: [start, end], distance: 0 }
  const distance = route.distance
  const proposals = simulateAIPredict({ distance, modes: MODES, preference })

  return (
    <div className="map-wrap">
      <svg viewBox="0 0 520 380" className="city-map">
        {/* edges */}
        {EDGES.map(([a,b,w],i) => (
          <g key={i}>
            <line
              x1={NODES[a].x} y1={NODES[a].y}
              x2={NODES[b].x} y2={NODES[b].y}
              stroke="#1f2937" strokeOpacity="0.12" strokeWidth={6} strokeLinecap="round" />
            <text x={(NODES[a].x+NODES[b].x)/2} y={(NODES[a].y+NODES[b].y)/2 - 8} fontSize="10" textAnchor="middle">{w}km</text>
          </g>
        ))}

        {/* nodes */}
        {Object.entries(NODES).map(([id, p]) => (
          <g key={id}>
            <circle cx={p.x} cy={p.y} r={24} fill="#0ea5a3" fillOpacity={0.12} stroke="#0891b2" strokeWidth={2} />
            <text x={p.x} y={p.y+4} fontSize="14" fontWeight="700" textAnchor="middle" fill="#022c2e">{id}</text>
            <text x={p.x} y={p.y+26} fontSize="10" textAnchor="middle" fill="#084" opacity="0.7">{{
              A: 'Downtown', B: 'Uptown', C: 'Midtown', D: 'Riverside', E: 'TechPark'
            }[id]}</text>
          </g>
        ))}

        {/* highlight path */}
        {route.path.map((n,i) => {
          if (i===route.path.length-1) return null
          const a = route.path[i], b = route.path[i+1]
          const edge = EDGES.find(e => (e[0]===a && e[1]===b) || (e[1]===a && e[0]===b))
          if (!edge) return null
          return (
            <line key={i+'h'} x1={NODES[a].x} y1={NODES[a].y} x2={NODES[b].x} y2={NODES[b].y} stroke="#ef4444" strokeWidth={8} strokeLinecap="round" opacity="0.55" />
          )
        })}

        {/* start / end markers */}
        <text x={NODES[start].x} y={NODES[start].y-34} fontSize="12" fill="#065f46">Start</text>
        <text x={NODES[end].x} y={NODES[end].y-34} fontSize="12" fill="#065f46">End</text>
      </svg>

      <div className="proposal-list">
        <h4>AI + Rules Suggestions</h4>
        <p className="meta">Route: {route.path.join(' → ')} · Distance: {distance} km</p>

        <ul>
          {proposals.map(p => (
            <li key={p.id} className="proposal" onClick={() => onChoose && onChoose({ mode: p.id, time_min: p.time, cost: p.cost, distance })}>
              <div className="icon">{p.icon}</div>
              <div className="meta">
                <strong>{p.label}</strong>
                <div className="small">{p.time} min · ₹{p.cost}</div>
              </div>
              <div className="score">score: {p.score}</div>
            </li>
          ))}
        </ul>

        {showLegend && (
          <div className="legend">
            <h5>Legend</h5>
            <div className="legend-row"><span className="dot">🚇</span> Metro</div>
            <div className="legend-row"><span className="dot">🔋</span> EV Bike</div>
            <div className="legend-row"><span className="dot">🛸</span> Drone</div>
            <div className="legend-row"><span className="dot">⚡</span> Hyperloop</div>
          </div>
        )}
      </div>
    </div>
  )
}
