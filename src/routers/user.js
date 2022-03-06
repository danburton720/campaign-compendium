const express = require('express');
const router = new express.Router();

router.get("/user", (req, res) => {
    if (req.user) {
        res.send(req.user);
    } else {
        res.status(401).send({});
    }
})

module.exports = router;