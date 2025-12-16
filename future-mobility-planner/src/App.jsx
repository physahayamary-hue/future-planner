import React, { useState } from 'react'
import CityMap from './components/CityMap'

const MODES = [
  { id: 'metro', label: 'Metro', icon: '🚇' },
  { id: 'ev', label: 'EV Bike', icon: '🔋' },
  { id: 'drone', label: 'Drone', icon: '🛸' },
  { id: 'hyperloop', label: 'Hyperloop', icon: '⚡' },
]

export default function App() {
  const [start, setStart] = useState('A')
  const [end, setEnd] = useState('E')
  const [preference, setPreference] = useState('fastest') // or 'cheapest'
  const [plan, setPlan] = useState(null)

  return (
    <div className="app">
      <header className="header">
        <h1>Future Transport & Mobility Planner</h1>
        <p className="tag">Non-AI + AI hybrid · Multi-modal · Futuristic UI</p>
      </header>

      <main className="main">
        <aside className="panel">
          <div className="control">
            <label>Start</label>
            <select value={start} onChange={e => setStart(e.target.value)}>
              <option value="A">A - Downtown</option>
              <option value="B">B - Uptown</option>
              <option value="C">C - Midtown</option>
              <option value="D">D - Riverside</option>
              <option value="E">E - TechPark</option>
            </select>
          </div>

          <div className="control">
            <label>End</label>
            <select value={end} onChange={e => setEnd(e.target.value)}>
              <option value="A">A - Downtown</option>
              <option value="B">B - Uptown</option>
              <option value="C">C - Midtown</option>
              <option value="D">D - Riverside</option>
              <option value="E">E - TechPark</option>
            </select>
          </div>

          <div className="control">
            <label>Preference</label>
            <div className="btn-group">
              <button className={preference==='fastest'? 'active':''} onClick={() => setPreference('fastest')}>Fastest</button>
              <button className={preference==='cheapest'? 'active':''} onClick={() => setPreference('cheapest')}>Cheapest</button>
            </div>
          </div>

          <div className="control">
            <button onClick={() => setPlan({ start, end, preference, ts: Date.now() })} className="primary">Plan Route</button>
          </div>

          {plan && (
            <div className="plan">
              <h3>Suggested Plans</h3>
              <CityMap start={plan.start} end={plan.end} preference={plan.preference} onChoose={p => setPlan(p)} />
            </div>
          )}
        </aside>

        <section className="canvas">
          <h2>Interactive City Map</h2>
          <CityMap start={start} end={end} preference={preference} onChoose={p => setPlan(p)} showLegend />
        </section>
      </main>

      <footer className="footer">Made with ❤️ · Futuristic icons & placeholder AI.</footer>
    </div>
  )
}
