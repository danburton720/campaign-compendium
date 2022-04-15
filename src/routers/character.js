const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const Character = require('../models/character');
const Campaign = require('../models/campaign');

router.delete("/characters/:id", async (req, res) => {
    if (req.user) {
        const _id = req.params.id;
        try {
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A character could not be found for the given ID');
            const character = await Character.findById(_id);
            if (!character || character.deletedAt !== "") return res.status(404).send('A character could not be found for the given ID');

            // get the campaign this character relates to
            const campaign = await Campaign.findById(character.campaignId);
            if (!campaign) return res.status(500).send('A campaign could not be found for this character');

            // check if the campaign this character relates to was created by the same user who is sending this request
            if (!campaign.createdBy.equals(req.user._id)) return res.status(401).send('You are not authorised to delete this character');

            // delete the character
            const characterToDelete = await Character.findById(_id);
            characterToDelete.deletedAt = new Date().toISOString();
            await characterToDelete.save();
            res.send(characterToDelete);
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
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A character could not be found for the given ID');

            const character = await Character.findById(_id);

            if (!character || character.deletedAt !== '') {
                return res.status(404).send('A character could not be found for the given ID');
            }

            if (!character.userId.equals(req.user._id)) {
                return res.status(401).send('You are not authorised to update this character');
            }

            if (req.body.hasOwnProperty('name')) character.name = req.body.name;
            if (req.body.hasOwnProperty('description')) character.description = req.body.description;
            if (req.body.hasOwnProperty('race')) character.race = req.body.race;
            if (req.body.hasOwnProperty('class')) character.class = req.body.class;
            if (req.body.hasOwnProperty('externalLink')) character.externalLink = req.body.externalLink;
            if (req.body.hasOwnProperty('chosenImage')) character.chosenImage = req.body.chosenImage;
            if (req.body.hasOwnProperty('chosenColor')) character.chosenColor = req.body.chosenColor;
            if (req.body.hasOwnProperty('status')) {
                if (req.body.status !== 'active') {
                    return res.status(400).send('Invalid status');
                }
                if (req.body.status === 'active' && character.status !== 'invited') {
                    return res.status(500).send('Cannot activate user that is not at invited status');
                }
                character.status = req.body.status;
            }
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
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A character could not be found for the given ID');

            const character = await Character.findById(_id);
            if (!character || character.deletedAt !== "") {
                return res.status(404).send('A character could not be found for the given ID');
            }

            // get the campaign this character relates to
            const campaign = await Campaign.findById(character.campaignId);
            if (!campaign) return res.status(500).send('A campaign could not be found for this character');

            // check if the campaign this character relates to was created by the same user who is sending this request
            if (!campaign.createdBy.equals(req.user._id)) return res.status(401).send('You are not authorised to kill this character');

            if (character.status !== "active") return res.status(400).send('Cannot kill an inactive character');

            character.status = "dead"
            await character.save();
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
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A character could not be found for the given ID');

            const character = await Character.findById(_id);

            if (!character || character.deletedAt !== "") {
                return res.status(404).send('A character could not be found for the given ID');
            }

            // get the campaign this character relates to
            const campaign = await Campaign.findById(character.campaignId);
            if (!campaign) return res.status(500).send('A campaign could not be found for this character');

            // check if this campaign has any active or invited characters already for this user - if so then prevent this revival
            const existingActiveOrInvitedCharacter = await Character.findOne(
                {
                    $or: [
                        {
                            status: 'active'
                        },
                        {
                            status: 'invited'
                        }
                    ],
                    $and: [
                        {
                            campaignId: campaign._id,
                        },
                        {
                            userId: character.userId,
                        },
                        {
                            deletedAt: ""
                        }
                    ]
                }
            );

            if (existingActiveOrInvitedCharacter) return res.status(400).send('You cannot revive a character while the same player already has an active or invited character in this campaign')

            // check if the campaign this character relates to was created by the same user who is sending this request
            if (!campaign.createdBy.equals(req.user._id)) return res.status(401).send('You are not authorised to revive this character');

            if (character.status !== "dead") return res.status(400).send('Cannot revive a character that is not dead');

            character.status = "active"
            await character.save();
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
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A character could not be found for the given ID');

            const character = await Character.findById(_id);

            if (!character) {
                return res.status(404).send('A character could not be found for the given ID');
            }

            res.send(character);
        } catch (e) {
            res.status(404).send(e);
        }
    } else {
        res.status(401).send({});
    }
});

module.exports = router;