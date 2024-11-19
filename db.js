const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');

async function setupDatabase() {
    const db = await sqlite.open({ filename: './greetings.db', driver: sqlite3.Database });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS Greetings (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timeOfDay TEXT NOT NULL,
            language TEXT NOT NULL,
            greetingMessage TEXT NOT NULL,
            tone TEXT NOT NULL
        )
    `);

    const seedData = [
        { timeOfDay: 'Morning', language: 'English', greetingMessage: 'Good Morning!', tone: 'Formal' },
        { timeOfDay: 'Morning', language: 'French', greetingMessage: 'Bonjour!', tone: 'Formal' },
        { timeOfDay: 'Afternoon', language: 'Spanish', greetingMessage: 'Buenas Tardes!', tone: 'Casual' }
        // Add more as required
    ];

    for (const { timeOfDay, language, greetingMessage, tone } of seedData) {
        await db.run(
            'INSERT INTO Greetings (timeOfDay, language, greetingMessage, tone) VALUES (?, ?, ?, ?)',
            [timeOfDay, language, greetingMessage, tone]
        );
    }

    return db;
}

module.exports = setupDatabase;
