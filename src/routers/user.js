const express = require('express');
const User = require('../models/user');
const router = new express.Router();

router.post('/users/login', async (req, res) => {
    // try {
    //     const user = await User.findByCredentials(req.body.email, req.body.password);
    //     const token = await user.generateAuthToken();
    //     res.send({ user, token })
    // } catch (e) {
    //     res.status(400).send()
    // }
    res.status(200).send("hello")
});

module.exports = router;