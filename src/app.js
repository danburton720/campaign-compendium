const express = require('express');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const cors = require('cors');
const session = require('cookie-session');
const User = require('./models/user');
const path = require('path');
require('./db/mongoose');

const authRouter = require('./routers/auth');
const userRouter = require('./routers/user');
const campaignRouter = require('./routers/campaign');
const characterRouter = require('./routers/character');
const sessionUpdateRouter = require('./routers/sessionUpdate');
const noteRouter = require('./routers/note');

const app = express();

const origin = process.env.CLIENT;

// Middleware
app.use(express.json());
app.use(cors({ origin, credentials: true }));

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
            done('There was a problem logging you in. Try again later.', null);
        }
    }));

if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.resolve("client", "build")));
}

app.use(authRouter);
app.use('/api', userRouter);
app.use('/api', campaignRouter);
app.use('/api', characterRouter);
app.use('/api', sessionUpdateRouter);
app.use('/api', noteRouter);

if (process.env.NODE_ENV === "production") {
    app.get('*', (req,res) =>{
        res.sendFile(path.resolve("client", "build", "index.html"));
    });
}

module.exports = app;