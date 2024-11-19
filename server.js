const express = require('express');
const path = require('path');
const setupDatabase = require('./db');

const app = express();
const PORT = 8080;
let db;

app.use(express.json());

(async () => {
    db = await setupDatabase();
})();

// Endpoints

// Greet Endpoint
app.post('/api/greet', async (req, res) => {
    const { timeOfDay, language, tone } = req.body;

    if (!timeOfDay || !language || !tone) {
        return res.status(400).json({ error: 'timeOfDay, language, and tone are required' });
    }

    try {
        const greeting = await db.get(
            'SELECT greetingMessage FROM Greetings WHERE timeOfDay = ? AND language = ? AND tone = ?',
            [timeOfDay, language, tone]
        );

        if (greeting) {
            res.json({ greetingMessage: greeting.greetingMessage });
        } else {
            res.status(404).json({ error: 'Greeting not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get All Times of Day
app.get('/api/timesOfDay', async (req, res) => {
    try {
        const times = await db.all('SELECT DISTINCT timeOfDay FROM Greetings');
        res.json({ times: times.map(t => t.timeOfDay) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Supported Languages
app.get('/api/languages', async (req, res) => {
    try {
        const languages = await db.all('SELECT DISTINCT language FROM Greetings');
        res.json({ languages: languages.map(l => l.language) });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
