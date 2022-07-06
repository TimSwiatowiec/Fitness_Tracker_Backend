

// Import express, and create a server
const express = require('express');
const server = express();


// Have the server use bodyParser.json()
server.use(bodyParser.json());


// Have the server use your api router with prefix '/api'
server.use('/api', require('./api'));

// Import the client from your db/index.js
const { client } = require('./db');

// Create custom 404 handler that sets the status code to 404.
server.use('*', (req, res, next) => {
  res.status(404);
  res.send({ error: 'route not found' })
});

// Create custom error handling that sets the status code to 500
// and returns the error as an object
server.use((error, req, res, next) => {
  res.status(500);
  res.send({ error: error.message });
})
