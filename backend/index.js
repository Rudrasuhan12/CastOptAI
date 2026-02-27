require('dotenv').config();

const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();



app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
}));
app.use(express.json());


app.use((req, res, next) => {
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${req.method} ${req.path}`);
    next();
});



const AI_SERVICE_URL = process.env.AI_SERVICE_URL || 'http://localhost:8000';
const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY || '';
const PORT = process.env.PORT || 5000;



app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        service: 'CastOpt AI Backend',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
        ai_service_url: AI_SERVICE_URL,
        weather_api_configured: !!OPENWEATHER_API_KEY,
    });
});



app.get('/api/weather/:city', async (req, res) => {
    const { city } = req.params;

    if (!OPENWEATHER_API_KEY) {
        return res.status(400).json({
            status: 'error',
            message: 'OpenWeatherMap API key not configured. Using demo weather data on frontend.',
        });
    }

    try {
        const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&units=metric&appid=${OPENWEATHER_API_KEY}`
        );

        res.json({
            status: 'success',
            temp: Math.round(response.data.main.temp),
            humidity: response.data.main.humidity,
            desc: response.data.weather[0].description,
            city: city,
        });
    } catch (err) {
        console.error(`Weather API error for ${city}:`, err.message);
        res.status(500).json({
            status: 'error',
            message: `Failed to fetch weather for ${city}`,
        });
    }
});




app.post('/api/optimize', async (req, res) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/optimize`, req.body, {
            timeout: 30000,
        });
        res.json(response.data);
    } catch (err) {
        console.error('Optimize proxy error:', err.message);
        if (err.code === 'ECONNREFUSED') {
            return res.status(503).json({
                status: 'error',
                message: 'AI service is not running. Please start the FastAPI server on port 8000.',
            });
        }
        res.status(500).json({
            status: 'error',
            message: err.response?.data?.message || 'Optimization request failed.',
        });
    }
});


app.post('/api/what-if', async (req, res) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/what-if`, req.body, {
            timeout: 30000,
        });
        res.json(response.data);
    } catch (err) {
        console.error('What-If proxy error:', err.message);
        if (err.code === 'ECONNREFUSED') {
            return res.status(503).json({
                status: 'error',
                message: 'AI service is not running. Please start the FastAPI server on port 8000.',
            });
        }
        res.status(500).json({
            status: 'error',
            message: err.response?.data?.message || 'What-If simulation failed.',
        });
    }
});


app.post('/api/retrain', async (req, res) => {
    try {
        const response = await axios.post(`${AI_SERVICE_URL}/retrain`, req.body, {
            timeout: 60000,
        });
        res.json(response.data);
    } catch (err) {
        console.error('Retrain proxy error:', err.message);
        if (err.code === 'ECONNREFUSED') {
            return res.status(503).json({
                status: 'error',
                message: 'AI service is not running. Please start the FastAPI server on port 8000.',
            });
        }
        res.status(500).json({
            status: 'error',
            message: err.response?.data?.message || 'Retrain request failed.',
        });
    }
});



app.get('/api/ai-status', async (req, res) => {
    try {
        const response = await axios.get(`${AI_SERVICE_URL}/`, { timeout: 5000 });
        res.json({
            status: 'connected',
            ai_service: response.data,
        });
    } catch (err) {
        res.json({
            status: 'disconnected',
            message: 'AI service is not reachable.',
        });
    }
});




app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: `Route ${req.method} ${req.path} not found.`,
    });
});


app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
        status: 'error',
        message: 'Internal server error.',
    });
});



app.listen(PORT, () => {
    console.log('');
    console.log('╔══════════════════════════════════════════════════════╗');
    console.log('║                                                      ║');
    console.log('║   🚀 CastOpt AI Backend v2.0                        ║');
    console.log(`║   🌐 Running on http://localhost:${PORT}               ║`);
    console.log(`║   🤖 AI Service: ${AI_SERVICE_URL}           ║`);
    console.log(`║   🌤️  Weather API: ${OPENWEATHER_API_KEY ? 'Configured ✅' : 'Not set ❌'}              ║`);
    console.log('║                                                      ║');
    console.log('╚══════════════════════════════════════════════════════╝');
    console.log('');
});