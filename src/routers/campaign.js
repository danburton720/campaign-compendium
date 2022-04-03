const express = require('express');
const router = new express.Router();
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
        const characters = await Character.find({ 'userId': req.user._id });
        for (const character of characters) {
            const campaign = await Campaign.findOne({ '_id': character.campaignId });
            campaigns.push(campaign);
        }
        res.status(200).send(campaigns)
    } else {
        res.status(401).send({});
    }
});

module.exports = router;