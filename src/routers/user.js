const express = require('express');
const router = new express.Router();

router.get("/user", (req, res) => {
    res.send(req.user);
})

module.exports = router;