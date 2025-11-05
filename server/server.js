const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simple quote array used as default
const quotes = [
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Don’t watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
  { text: "The future depends on what you do today.", author: "Mahatma Gandhi" },
  { text: "It always seems impossible until it's done.", author: "Nelson Mandela" },
  { text: "Small steps every day.", author: "Unknown" }
];

// /api/quote - returns a random quote from the array
app.get('/api/quote', (req, res) => {
  try {
    const q = quotes[Math.floor(Math.random() * quotes.length)];
    res.json({ quote: q });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Could not fetch quote.' });
  }
});

// /api/weather?city=CityName - uses OpenWeatherMap if API key provided, otherwise returns mock data
app.get('/api/weather', async (req, res) => {
  try {
    const city = req.query.city || 'London';
    const apiKey = process.env.OPENWEATHER_API_KEY;
    if (!apiKey) {
      // return mock simplified response
      return res.json({
        city,
        temperatureC: 22,
        description: 'Partly cloudy (mock data)'
      });
    }
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric&appid=${apiKey}`;
    const response = await axios.get(url);
    const data = response.data;
    const simplified = {
      city: data.name,
      temperatureC: data.main.temp,
      description: data.weather && data.weather[0] && data.weather[0].description
    };
    res.json(simplified);
  } catch (err) {
    console.error(err && err.message);
    res.status(500).json({ error: 'Could not fetch weather data.' });
  }
});

// /api/currency?amount=100 - converts INR to USD and EUR using exchangerate.host (no API key)
app.get('/api/currency', async (req, res) => {
  try {
    const amount = Number(req.query.amount) || 1;
    // Using exchangerate.host (free, no API key). If offline or blocked, fallback to mock.
    const resp = await axios.get('https://api.exchangerate.host/latest', {
      params: { base: 'INR', symbols: 'USD,EUR' }
    });
    if (!resp.data || !resp.data.rates) {
      throw new Error('Bad response from exchange API');
    }
    const rates = resp.data.rates;
    const usd = +(amount * rates.USD).toFixed(4);
    const eur = +(amount * rates.EUR).toFixed(4);
    res.json({ amountINR: amount, usd, eur, rates });
  } catch (err) {
    console.error('Currency error:', err && err.message);
    // Fallback mock conversion rates (approximate)
    const usd = +( (Number(req.query.amount) || 1) * 0.012 ).toFixed(4);
    const eur = +( (Number(req.query.amount) || 1) * 0.011 ).toFixed(4);
    res.json({ amountINR: Number(req.query.amount) || 1, usd, eur, rates: { USD: 0.012, EUR: 0.011 }, note: 'mock rates used due to API failure' });
  }
});

// Serve a simple alive route
app.get('/', (req, res) => {
  res.send({ status: 'InfoHub server running' });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
