import React, { useEffect, useState } from 'react'
import axios from 'axios'

export default function WeatherModule() {
  const [city, setCity] = useState('London')
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => { fetchWeather() }, [])

  async function fetchWeather() {
    setIsLoading(true)
    setError('')
    setData(null)
    try {
      const res = await axios.get('/api/weather', { params: { city } })
      setData(res.data)
    } catch (err) {
      console.error(err)
      setError('Could not fetch weather. Try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {/* Input + Button Row */}
      <div className="row" style={{ display: 'flex', gap: '10px', marginBottom: '15px',justifyContent:'center'}}>
        <div>
          <input
          type="text"
          className="input"
          placeholder="Enter city name"
          value={city}
          onChange={e => setCity(e.target.value)}
          style={{ flex: 1 }}
        />
        </div>
        <div>
          <button onClick={fetchWeather}>Get Weather</button>
        </div>
      </div>

      {/* States */}
      {isLoading && <div className="loading">Loading weather...</div>}
      {error && <div className="error">{error}</div>}

      {/* Weather Card */}
      {data && (
        <div className="card">
          <div className="result-title">{data.city}</div>
          <div className="result-value">{data.temperatureC}°C</div>
          <p style={{ fontSize: '16px', color: '#555' }}>{data.description}</p>
        </div>
      )}
    </div>
  )
}
