import React, { useState } from 'react'
import axios from 'axios'

export default function CurrencyConverter(){
  const [amount, setAmount] = useState(100)
  const [result, setResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function convert(){
    setIsLoading(true); setError(''); setResult(null)
    try {
      const res = await axios.get('/api/currency', { params: { amount } })
      setResult(res.data)
    } catch (err) {
      setError('Conversion failed.')
    } finally { setIsLoading(false) }
  }

  return (
    <div>
      <div className="row">
        <input className="input" type="number" value={amount} onChange={e=>setAmount(e.target.value)} />
        <button onClick={convert}>Convert INR</button>
      </div>
      {isLoading && <div>Converting...</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
      {result && (
        <div>
          <p>INR: {result.amountINR}</p>
          <p>USD: {result.usd}</p>
          <p>EUR: {result.eur}</p>
        </div>
      )}
    </div>
  )
}
