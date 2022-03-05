const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const session = require('express-session');
const User = require('./models/user');
require('./db/mongoose');

const authRouter = require('./routers/auth');
const userRouter = require('./routers/user');

const app = express();

// TODO add production origin too when known
const origins = [
    "http://localhost:3000"
];

// Middleware
app.use(express.json());
app.use(cors({ origin: origins, credentials: true }));

const sessionOpts = {
    secret: "secretcode",
    resave: true,
    saveUninitialized: true
};

if (process.env.NODE_ENV === "production") {
    app.set("trust proxy", 1);

    sessionOpts.cookie = {
        sameSite: "none",
        secure: true,
        maxAge: 1000 * 60 * 60 * 24 * 7 // One week
    }
}

// Sessions
app.use(session(sessionOpts));

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => {
    return done(null, user._id);
});

passport.deserializeUser((id, done) => {
    User.findById(id, (err, doc) => {
        // Whatever we return goes to the client and binds to the req.user property
        return done(null, doc);
    })
})

passport.use(new GoogleStrategy({
        clientID: `${process.env.GOOGLE_CLIENT_ID}`,
        clientSecret: `${process.env.GOOGLE_CLIENT_SECRET}`,
        callbackURL: "/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
        try {
            const newUser = new User({
                googleId: profile.id,
                displayName: profile.displayName,
                email: profile.emails[0].value,
                firstName: profile.name.givenName,
                lastName: profile.name.familyName,
                image: profile.photos[0].value,
                token: accessToken
            });

            const currentUser = await User.findOne({ googleId: profile.id });

            if (currentUser) {
                return done(null, currentUser)
            } else {
                await newUser.save();
                done(null, newUser);
            }
        } catch (err) {
            console.log('err', err)
            done('There was a problem logging you in. Try again later.', null);
        }
    }));

app.use(authRouter);
app.use(userRouter);


module.exports = app;