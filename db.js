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
        // English greetings
        { timeOfDay: 'Morning', language: 'English', greetingMessage: 'Good Morning!', tone: 'Formal' },
        { timeOfDay: 'Morning', language: 'English', greetingMessage: 'Good Morning!', tone: 'Casual' },
        { timeOfDay: 'Afternoon', language: 'English', greetingMessage: 'Good Afternoon!', tone: 'Formal' },
        { timeOfDay: 'Afternoon', language: 'English', greetingMessage: 'Good Afternoon!', tone: 'Casual' },
        { timeOfDay: 'Evening', language: 'English', greetingMessage: 'Good Evening!', tone: 'Formal' },
        { timeOfDay: 'Evening', language: 'English', greetingMessage: 'Good Evening!', tone: 'Casual' },

        // French greetings
        { timeOfDay: 'Morning', language: 'French', greetingMessage: 'Bonjour!', tone: 'Formal' },
        { timeOfDay: 'Morning', language: 'French', greetingMessage: 'Salut!', tone: 'Casual' },
        { timeOfDay: 'Afternoon', language: 'French', greetingMessage: 'Bon Après-midi!', tone: 'Formal' },
        { timeOfDay: 'Afternoon', language: 'French', greetingMessage: 'Salut!', tone: 'Casual' },
        { timeOfDay: 'Evening', language: 'French', greetingMessage: 'Bonsoir!', tone: 'Formal' },
        { timeOfDay: 'Evening', language: 'French', greetingMessage: 'Salut!', tone: 'Casual' },

        // Spanish greetings
        { timeOfDay: 'Morning', language: 'Spanish', greetingMessage: '¡Buenos Días!', tone: 'Formal' },
        { timeOfDay: 'Morning', language: 'Spanish', greetingMessage: '¡Hola!', tone: 'Casual' },
        { timeOfDay: 'Afternoon', language: 'Spanish', greetingMessage: '¡Buenas Tardes!', tone: 'Formal' },
        { timeOfDay: 'Afternoon', language: 'Spanish', greetingMessage: '¡Hola!', tone: 'Casual' },
        { timeOfDay: 'Evening', language: 'Spanish', greetingMessage: '¡Buenas Noches!', tone: 'Formal' },
        { timeOfDay: 'Evening', language: 'Spanish', greetingMessage: '¡Hola!', tone: 'Casual' }
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
