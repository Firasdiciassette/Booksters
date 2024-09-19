"use strict";

const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

// Serve all static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

app.get('/Ciao', (req, res) => {
  res.send('Ciao WorldDDyyyDD!');
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
