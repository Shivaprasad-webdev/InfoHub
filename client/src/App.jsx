import React, { useState } from 'react'
import WeatherModule from './components/WeatherModule'
import CurrencyConverter from './components/CurrencyConverter'
import QuoteGenerator from './components/QuoteGenerator'

export default function App() {
  const [active, setActive] = useState('Weather')
  return (
    <div className="container">
      <h1>InfoHub — Weather · Currency · Quotes</h1>
      <div className="tabs" role="tablist" aria-label="Modules">
        {['Weather','Currency','Quotes'].map(t => (
          <div key={t} className={`tab ${active===t ? 'active':''}`} onClick={()=>setActive(t)} role="tab">{t}</div>
        ))}
      </div>
      <div className="module">
        {active === 'Weather' && <WeatherModule />}
        {active === 'Currency' && <CurrencyConverter />}
        {active === 'Quotes' && <QuoteGenerator />}
      </div>
    </div>
  )
}
