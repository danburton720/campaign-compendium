const express = require('express');
const passport = require('passport');
const router = new express.Router();

// TODO add production env here when known
const redirect = process.env.NODE_ENV === "production" ? "ADD_THIS_WHEN_KNOWN" : "http://localhost:3000";

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: redirect, session: true }),
    function (req, res) {
        res.redirect(redirect);
    }
);

router.get("/auth/logout", (req, res) => {
    console.log('logging out')
    console.log('req.user', req.user)
    if (req.user) {
        req.logout();
    }
    res.send("done");
})

module.exports = router;