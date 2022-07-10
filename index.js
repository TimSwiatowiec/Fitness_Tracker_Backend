// const PORT = process.env.PORT || 3000;
// const express = require('express');
// const server = express();
// const client = require('./db/client');
// client.connect();

// server.listen(PORT, () => {


// const bodyParser = require('body-parser');
// server.use(bodyParser.json());
// server.use(bodyParser.urlencoded({extended: true}));

// const morgan = require('morgan');
// server.use(morgan('dev'))});

// create the express server here
const express = require('express');
const server = express();
// Have the server use your api router with prefix '/api'
server.use('/api', require('./api'));
// Import the client from your db/index.js
const { client } = require('./db');
client.connect();
// Create custom 404 handler that sets the status code to 404.
server.use("*", (req, res, next) => {
    res.status(404);
    res.send({ error: "route not found" })
  });
  // Create custom error handling that sets the status code to 500
  // and returns the error as an object
  server.use((error, req, res, next) => {
    res.status(500);
    res.send({ error: error.message });
  })