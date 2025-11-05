import React, { useState } from 'react'
import axios from 'axios'

export default function QuoteGenerator(){
  const [quote, setQuote] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  async function fetchQuote(){
    setIsLoading(true); setError(''); setQuote(null)
    try {
      const res = await axios.get('/api/quote')
      setQuote(res.data.quote)
    } catch (err) {
      setError('Could not fetch quote.')
    } finally { setIsLoading(false) }
  }

  return (
    <div>
      <div className="row">
        <button onClick={fetchQuote}>Get Motivational Quote</button>
      </div>
      {isLoading && <div>Loading...</div>}
      {error && <div style={{color:'red'}}>{error}</div>}
      {quote && (
        <div>
          <blockquote>"{quote.text}"</blockquote>
          <div>— {quote.author}</div>
        </div>
      )}
    </div>
  )
}
