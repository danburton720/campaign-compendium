const express = require('express');
const router = new express.Router();
const Character = require('../models/character');

router.delete("/characters/:id", async (req, res) => {
    if (req.user) {
        const _id = req.params.id;
        // delete the character
        try {
            const character = await Character.findOneAndDelete({ _id });
            if (!character) {
                return res.status(404).send();
            }
            res.send(character);
        } catch (e) {
            res.status(500).send(e);
        }
    } else {
        res.status(401).send({});
    }
});

router.patch("/characters/:id", async (req, res) => {
    if (req.user) {
        try {
            const _id = req.params.id;
            const character = await Character.findById(_id);
            if (req.body.hasOwnProperty('name')) character.name = req.body.name;
            if (req.body.hasOwnProperty('description')) character.name = req.body.description;
            if (req.body.hasOwnProperty('race')) character.race = req.body.race;
            if (req.body.hasOwnProperty('class')) character.class = req.body.class;
            if (req.body.hasOwnProperty('externalLink')) character.externalLink = req.body.externalLink;
            if (req.body.hasOwnProperty('status')) character.status = req.body.status;
            await character.save();
            res.send(character);
        } catch (e) {
            res.status(404).send(e);
        }
    } else {
        res.status(401).send({});
    }
});

router.post("/characters/:id/kill", async (req, res) => {
    if (req.user) {
        try {
            const _id = req.params.id;
            const character = await Character.findById(_id);
            if (character.status === "active") {
                character.status = "dead"
                await character.save();
            }
            res.send(character);
        } catch (e) {
            res.status(404).send(e);
        }
    } else {
        res.status(401).send({});
    }
});

router.post("/characters/:id/revive", async (req, res) => {
    if (req.user) {
        try {
            const _id = req.params.id;
            const character = await Character.findById(_id);
            if (character.status === "dead") {
                character.status = "active"
                await character.save();
            }
            res.send(character);
        } catch (e) {
            res.status(404).send(e);
        }
    } else {
        res.status(401).send({});
    }
});

router.get("/characters/:id", async (req, res) => {
    if (req.user) {
        try {
            const _id = req.params.id;
            const character = await Character.findById(_id);
            res.send(character);
        } catch (e) {
            res.status(404).send(e);
        }
    } else {
        res.status(401).send({});
    }
});

module.exports = router;