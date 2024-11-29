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

// Test the PostgreSQL connection
sequelize
  .authenticate()
  .then(() => {
    console.log('Connection to PostgreSQL has been established successfully.');
  })
  .catch((err) => {
    console.error('Unable to connect to PostgreSQL:', err);
  });


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

// Sync the models with the database (creates tables if they don't exist)
sequelize.sync()
  .then(() => {
    console.log('Tables synced with the PostgreSQL database.');
  })
  .catch((err) => {
    console.error('Error syncing the models with the database:', err);
  });

const app = express();
const HTTP_PORT = process.env.PORT || 8080;

// Set views directory and template engine (if needed)
app.set('views', __dirname + '/views');  // Set the views folder (for templates like EJS)
app.set('view engine', 'ejs');  // Set the view engine (replace 'ejs' if using another engine)

// Serve static files from the 'public' folder
app.use(express.static(__dirname + '/public'));  // Adjust '/public' to where your static files are

// Use JSON middleware
app.use(express.json());

// Routes (example endpoints for greeting functionality)

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
    res.json(times.map(t => t.timeOfDay)); // Just return the array of times of day
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
    res.json(languages.map(l => l.language)); // Just return the array of languages
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Default route
app.get('/', (req, res) => {
  res.send('Web API is working!');
});

// Start the Express server
app.listen(HTTP_PORT, () => {
  console.log(`Server listening on: http://localhost:${HTTP_PORT}`);
});

module.exports = app;  // Export the app for Vercel to use
