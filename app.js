const express = require('express');
const mongoose = require('mongoose');
const passport = require('passport');
const session = require('express-session');
const flash = require('connect-flash');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

// Passport Config
require('./config/passport')(passport);

// Connect to MongoDB
mongoose.connect('mongodb://localhost/unified-universe')
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err));

// EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Bodyparser
app.use(bodyParser.urlencoded({ extended: false }));

// Express session
app.use(
  session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

// Static Files
app.use(express.static(path.join(__dirname, 'public')));


// Routes for rendering views

app.get('/', (req, res) => {
    res.render('index', { user: req.user, layout: false });
});

app.get('/intro', (req, res) => res.render('intro'));
app.get('/temporal-force', (req, res) => res.render('temporal_force'));
app.get('/gravity', (req, res) => res.render('gravity'));
app.get('/time-dilation', (req, res) => res.render('time_dilation'));
app.get('/cosmology', (req, res) => res.render('cosmology'));
app.get('/speed-of-light', (req, res) => res.render('speed_of_light'));
app.get('/dark-matter', (req, res) => res.render('dark_matter'));
app.get('/temporal-horizon', (req, res) => res.render('temporal_horizon'));
app.get('/quantum-tunneling', (req, res) => res.render('quantum_tunneling'));
app.get('/quantum-mechanics', (req, res) => res.render('quantum_mechanics'));
app.get('/contact', (req, res) => res.render('contact'));

// User management routes
app.use('/users', require('./routes/auth'));

// Post management routes
app.use('/posts', require('./routes/posts'));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
