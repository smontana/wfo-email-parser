require('dotenv').load();
var express = require('express');
var app = express();

require('./lib/logging')(app);
require('./lib/request_parsing')(app);
require('./lib/static')(app);
require('./lib/views')(app);

// var connection = require('./db/connection');

// require('./lib/routing')(app, connection);
require('./lib/routing')(app);
require('./lib/errors')(app); // error handles must load after app routes

module.exports = app;
