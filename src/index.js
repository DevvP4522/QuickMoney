const express = require('express');
  const app = express();
  const connectToMongo = require('./db');
  const cors = require('cors');
  const helmet = require('helmet');

  connectToMongo();

  app.use(helmet());
  app.use(cors());
  app.use(express.json());

  app.use('/api/auth', require('./routes/Auth'));
  app.use('/api/posts', require('./routes/Post'));

  app.listen(5000, () => {
    console.log('Server running on port 5000');
  });