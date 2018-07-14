const express = require('express');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, '../client/public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../client', 'public', 'index.html'));
});

module.exports = app;
