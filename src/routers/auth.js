const express = require('express');
// const passport = require('passport');
const User = require('../models/user');
const router = new express.Router();

// router.post('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.post('/auth/google', async (req, res) => {
    const newUser = {
        googleId: req.body.googleId,
        email: req.body.email,
        displayName: req.body.name,
        firstName: req.body.givenName,
        lastName: req.body.familyName,
        image: req.body.imageUrl,
        token: req.body.token
    };

    try {
        const existingUser = await User.findOne({ googleId: req.body.id });
        if (existingUser) {
            res.status(200).send(existingUser);
        } else {
            const user = await User.create(newUser);
            res.status(200).send(user);
        }
    } catch (err) {
        throw new Error(err);
    }
});


// router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/', session: false }), (req, res) => {
//     const token = req.user.token;
//     console.log('in callback')
//     res.redirect('http://localhost:3000?token=' + token);
// });

// router.post('/auth/logout', (req, res) => {
//     console.log('logging out')
//     req.logout();
//     // res.redirect("http://localhost:3000");
// })

module.exports = router;