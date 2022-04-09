const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const Campaign = require('../models/campaign');
const Character = require('../models/character');
const User = require('../models/user');

router.post('/campaigns', async (req, res) => {
    if (req.user) {
        // when we create a campaign we also need to create characters for each of the invited users
        // as long as those users are already in the system. If not, don't add them
        const { name, description, invitedUsers } = req.body;
        const id = mongoose.Types.ObjectId();
        const campaign = new Campaign({
            _id: id,
            name,
            description,
            createdBy: req.user._id
        });

        const characters = [];
        if (invitedUsers && invitedUsers.length > 0) {
            for (const user of invitedUsers) {
                const foundUser = await User.findOne({ email: user });
                if (foundUser) {
                    // create a character for this user
                    const character = new Character({
                        name: 'My character',
                        description: 'My character description',
                        race: 'Human',
                        class: 'Barbarian',
                        externalLink: '',
                        userId: foundUser._id,
                        campaignId: id,
                        status: 'invited'
                    });
                    // push it to the array
                    characters.push(character);
                }
            }
        }

        try {
            await campaign.save();
            if (characters.length > 0) {
                characters.forEach(character => {
                    character.save();
                })
            }
            res.status(201).send(campaign);
        } catch (e) {

        }
    } else {
        res.status(401).send({});
    }
});

router.get("/campaigns/created", async (req, res) => {
    if (req.user) {
        // get all campaigns the user has created
        const campaigns = await Campaign.find({ 'createdBy': req.user._id });
        res.status(200).send(campaigns)
    } else {
        res.status(401).send({});
    }
});

router.get("/campaigns/player", async (req, res) => {
    if (req.user) {
        // get all campaigns the user is a player in
        const campaigns = [];
        const characters = await Character.find({ 'userId': req.user._id }).lean();
        for (const character of characters) {
            const campaign = await Campaign.findById(character.campaignId).lean();
            campaign.character = character;
            campaigns.push(campaign);
        }
        res.status(200).send(campaigns)
    } else {
        res.status(401).send({});
    }
});

router.get("/campaigns/:id", async (req, res) => {
    if (req.user) {
        const _id = req.params.id;
        try {
            const campaign = await Campaign.findById(_id).lean();
            if (!campaign) return res.status(404).send();
            // we've found a campaign so we need to get associated player and character info
            // first get all characters in this campaign
            const newCampaign = campaign;
            const characters = await Character.find({ 'campaignId': _id }).lean();
            if (characters) {
                // we have characters so we need to get the user to whom each of these characters belongs
                const charactersAndUsers = [];
                for (const character of characters) {
                    const user = await User.findById(character.userId, '_id displayName firstName lastName email image').lean();
                    // if we found a user (we should) then include the character and user info
                    if (user) charactersAndUsers.push({ ...character, user });
                }
                newCampaign.characters = charactersAndUsers;
            }
            res.send(newCampaign);
        } catch (e) {
            res.status(500).send(e);
        }
    } else {
        res.status(401).send({});
    }
});

router.patch("/campaigns/:id", async (req, res) => {
    if (req.user) {
        const _id = req.params.id;
        try {
            const campaign = await Campaign.findById(_id);
            if (req.body.hasOwnProperty('name')) campaign.name = req.body.name;
            if (req.body.hasOwnProperty('description')) campaign.description = req.body.description;
            await campaign.save();
            res.send(campaign);
        } catch (e) {
            res.status(400).send(e);
        }
    } else {
        res.status(401).send({});
    }
});

router.post("/campaigns/:id/invite", async (req, res) => {
    if (req.user) {
        const _id = req.params.id;
        const foundUser = await User.findOne({ email: req.body.email });
        if (!foundUser) res.status(400).send("User not in system");
        else {
            // user is in system so create them a character
            try {
                const character = new Character({
                    name: 'My character',
                    description: 'My character description',
                    race: 'Human',
                    class: 'Barbarian',
                    externalLink: '',
                    userId: foundUser._id,
                    campaignId: _id,
                    status: 'invited'
                });
                await character.save();
                res.status(200).send();
            } catch (e) {
                res.status(500).send(e);
            }
        }
    } else {
        res.status(401).send({});
    }
});

module.exports = router;