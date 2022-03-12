const express = require('express');
const passport = require('passport');
const router = new express.Router();

const redirect = process.env.CLIENT;

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/auth/google/callback',
    passport.authenticate('google', { failureRedirect: redirect, session: true }),
    function (req, res) {
        res.redirect(redirect);
    }
);

router.get("/auth/logout", (req, res) => {
    if (req.user) {
        req.logout();
    }
    res.send("done");
});

module.exports = router;