const express = require('express');
const parrot = require('parrot-middleware');
const cors = require('cors');
const scenarios = require('./scenarios');

const whitelist = ['http://localhost:8080'];
const corsOptions = {
  origin: (origin, callback) => {
    callback(null, true);
  },
  exposedHeaders: ['Location', 'x-correlationid', 'x-requestid'],
  credentials: false,
};

const app = express();
app.use(cors(corsOptions));
app.use(parrot(scenarios));
app.listen(8082);
