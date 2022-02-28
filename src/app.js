const express = require('express');
const morgan = require('morgan');
// const passport = require('passport');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');

require('./db/mongoose');
const authRouter = require('./routers/auth');

// Passport config
// require('./passport/passport')(passport);

const app = express();
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Sessions
// app.use(session({
//     secret: 'piano dog',
//     resave: false,
//     saveUninitialized: false,
// }));

// Passport middleware
// app.use(passport.initialize());
// app.use(passport.session());

app.use(authRouter);

module.exports = app;