const PORT = process.env.PORT || 3000;
const express = require('express');
const server = express();
const client = require('./db/database');
client.connect();

server.listen(PORT, () => {


const bodyParser = require('body-parser');
server.use(bodyParser.json());
server.use(bodyParser.urlencoded({extended: true}));

const morgan = require('morgan');
server.use(morgan('dev'))});