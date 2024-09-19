// Import required modules
const express = require('express');
const path = require('path');
const app = express();


app.listen(3000, () => console.log('Example app is listening on port 3000.'));


/* Set EJS as the templating engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware to serve static files
app.use(express.static(path.join(__dirname, 'public')));    

// Define routes
app.get('/', (req, res) => {
  res.render('index'); // Renders index.ejs from the views folder
});

app.get('/login', (req, res) => {
  res.render('login'); // Renders login.ejs from the views folder
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

*/