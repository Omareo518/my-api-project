const express = require('express');
const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize('postgres', 'postgres.dpbxhwvkyiwrxaycunnd', 'Ramoomar2008&', {
  host: 'aws-0-ca-central-1.pooler.supabase.com',
  dialect: 'postgres',
  port: 5432, // Default PostgreSQL port
  dialectOptions: {
    ssl: { rejectUnauthorized: false }, // Handle SSL connection if required
  },
});

// Define the Greeting model
const Greeting = sequelize.define('Greeting', {
  timeOfDay: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  language: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  tone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  greetingMessage: {
    type: DataTypes.STRING,
    allowNull: false,
  },
});

// Seed the database
const seedDatabase = async () => {
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
    { timeOfDay: 'Evening', language: 'Spanish', greetingMessage: '¡Hola!', tone: 'Casual' },
  ];

  try {
    const count = await Greeting.count();
    if (count === 0) {
      await Greeting.bulkCreate(seedData);
      console.log('Database has been seeded.');
    } else {
      console.log('Database already contains data. Skipping seeding.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

// Test the PostgreSQL connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to PostgreSQL has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to PostgreSQL:', err);
  });

// Sync the models with the database (creates tables if they don't exist)
sequelize
  .sync()
  .then(async () => {
    console.log('Tables synced with the PostgreSQL database.');
    await seedDatabase(); // Call seedDatabase after syncing
  })
  .catch((err) => {
    console.error('Error syncing the models with the database:', err);
  });

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Middleware and Routes
app.use(express.json());

// Greet Endpoint
app.post('/api/greet', async (req, res) => {
  const { timeOfDay, language, tone } = req.body;

  if (!timeOfDay || !language || !tone) {
    return res.status(400).json({ error: 'timeOfDay, language, and tone are required' });
  }

  try {
    const greeting = await Greeting.findOne({
      where: { timeOfDay, language, tone },
    });

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
    const times = await Greeting.findAll({
      attributes: ['timeOfDay'],
      group: ['timeOfDay'],
    });
    const uniqueTimes = times.map(t => t.timeOfDay);
    res.json(uniqueTimes); // Return unique times of day
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Supported Languages
app.get('/api/languages', async (req, res) => {
  try {
    const languages = await Greeting.findAll({
      attributes: ['language'],
      group: ['language'],
    });
    const uniqueLanguages = languages.map(l => l.language);
    res.json(uniqueLanguages); // Return unique languages
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start the server
app.listen(HTTP_PORT, () => {
  console.log(`Server listening on: http://localhost:${HTTP_PORT}`);
});

module.exports = app;
