const express = require('express');
const path = require('path');

const app = express();

const appPath = path.resolve(__dirname, 'dist/workout-timer')

app.use(express.static(appPath));

app.get('/*', function (req, res) {
  res.sendFile(path.resolve(appPath, 'index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);