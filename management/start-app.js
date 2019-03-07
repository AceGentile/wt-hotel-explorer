#! /usr/bin/env node

const fs = require('fs');
const path = require('path');
const superstatic = require('superstatic').server;

require('./build-env-file');

const port = 8080;
const host = '0.0.0.0';

const app = superstatic({
  debug: true,
  port: port,
  host: host,
  compression: true,
  cwd: path.resolve(__dirname, '../public'),
  config: path.resolve(__dirname, '../superstatic.json'),
});

app.listen(function() {
  console.log(`Visit http://${host}:${port} to view your app.`);
});