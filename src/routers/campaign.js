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

                const foundUser = await User.findOne({ email: user.toLowerCase() });
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
                        status: 'invited',
                        deletedAt: ''
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
        const characters = await Character.find({ 'userId': req.user._id, 'deletedAt': "" }).lean();
        const uniqueCampaignIds = [ ...new Set(characters.map(character => character.campaignId.toString()))];
        for (const campaignId of uniqueCampaignIds) {
            const campaign = await Campaign.findById(campaignId).lean();

            // now get all characters in this campaign for that user
            campaign.characters = await Character.find({ 'campaignId': campaign._id, 'userId': req.user._id, 'deletedAt': "" }).lean();
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
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A campaign could not be found for the given ID');
            const campaign = await Campaign.findById(_id).lean();
            if (!campaign) return res.status(404).send('A campaign could not be found for the given ID');
            // we've found a campaign so we need to get associated player and character info
            // first get all characters in this campaign
            const newCampaign = campaign;
            const characters = await Character.find({ 'campaignId': _id, 'deletedAt': "" }).lean();
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
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A campaign could not be found for the given ID');

            const campaign = await Campaign.findById(_id);

            if (!campaign) return res.status(404).send('A campaign could not be found for the given id')
            if (!campaign.createdBy.equals(req.user._id)) {
                return res.status(401).send('You are not authorised to edit this campaign');
            }

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
        if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A campaign could not be found for the given ID');
        if (!req.body.email) return res.status(400).send('No email address provided');

        const foundUser = await User.findOne({ email: req.body.email.toLowerCase() });
        if (!foundUser) return res.status(400).send("User not in system");

        // get campaign to which this invite relates
        const campaign = await Campaign.findById(_id);
        if (!campaign) return res.status(500).send('A campaign could not be found for the given ID');

        // check if the campaign to which this user is being invited to has been created by the requesting user
        if (!campaign.createdBy.equals(req.user._id)) return res.status(401).send('You are not authorised to invite users to this campaign');

        // check if the user is already in this campaign with an active or invited character (as long as they aren't deleted)
        const existingCharacter = await Character.findOne(
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
                        campaignId: _id,
                    },
                    {
                        userId: foundUser._id,
                    },
                    {
                        deletedAt: ""
                    }
                ]
            }
        );
        if (existingCharacter) return res.status(400).send('The specified user already exists in the campaign for the given ID');

        // check that the invited user isn't the DM
        if (campaign.createdBy.equals(foundUser._id)) return res.status(400).send('You are the DM, you cannot invite yourself to join as a player');

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
                status: 'invited',
                deletedAt: ''
            });
            await character.save();
            res.status(200).send();
        } catch (e) {
            res.status(500).send(e);
        }
    } else {
        res.status(401).send({});
    }
});

router.delete("/campaigns/:campaignId/users/:userId", async (req, res) => {
    if (req.user) {
        const campaignId = req.params.campaignId;
        const userId = req.params.userId;

        if (!mongoose.Types.ObjectId.isValid(campaignId)) return res.status(404).send('A campaign could not be found for the given ID');
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(404).send('A user could not be found for the given ID');

        try {
            // get this campaign
            const campaign = await Campaign.findById(campaignId);
            if (!campaign) return res.status(500).send('A campaign could not be found for the given ID');

            // check if the campaign was created by the same user who is sending this request
            if (!campaign.createdBy.equals(req.user._id)) return res.status(401).send('You are not authorised to remove this player');

            // we need to get all non-deleted characters relating to this campaign for this user
            const characters = await Character.find({ 'campaignId': campaignId, 'userId': userId, 'deletedAt': "" }).lean();
            if (!characters || characters.length === 0) return res.status(404).send('A character could not be found for the given campaign and user ID');

            const deletedCharacters = await Character.updateMany({ 'campaignId': campaignId, 'userId': userId, 'deletedAt': '' }, { 'deletedAt': new Date().toISOString() });

            res.status(200).send(deletedCharacters);
        } catch (e) {
            res.status(400).send(e);
        }
    } else {
        res.status(401).send({});
    }
});

module.exports = router;