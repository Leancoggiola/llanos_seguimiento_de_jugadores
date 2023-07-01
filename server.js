const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser');

const userRoutes = require('./endpoints/user/routes.js');
const playersRoutes = require('./endpoints/players/routes.js');
const teamsRoutes = require('./endpoints/teams/routes.js');
const tournamentsRoutes = require('./endpoints/tournaments/routes.js');
const { clearUnsetDocuments } = require('./schedules.js');

// Constants
const PORT = process.env.PORT || 8000;
const app = express();
require('dotenv').config();

// DB config
mongoose.set('strictQuery', true);
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('DB connected'))
    .catch((err) => console.error(err.message));

// Configuration
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routing
app.use('/api/user', userRoutes);
app.use('/api/players', playersRoutes);
app.use('/api/teams', teamsRoutes);
app.use('/api/tournaments', tournamentsRoutes);

// Deploy config
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => res.sendFile(path.join(__dirname, 'client', 'build', 'index.html')));
}

app.use((err, req, res, next) => {
    res.locals.error = err;
    const status = err.status || 500;
    res.status(status);
    res.render('error');
});

app.listen(PORT, () => {
    console.log(`Serve at http://localhost:${PORT}`);
});

clearUnsetDocuments();
