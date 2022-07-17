const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const Quest = require('../models/quest');
const QuestMilestone = require('../models/questMilestone');
const Campaign = require('../models/campaign');
const Character = require('../models/character');

// POST to create quest - /campaigns/:id/quests
// POST can only be performed by DM
// POST must relate to a campaign that exists
// data must be provided
router.post("/campaigns/:id/quests", async (req, res) => {
    if (req.user) {
        try {
            const _id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A campaign could not be found for the given ID');

            const campaign = await Campaign.findById(_id);
            if (!campaign) return res.status(404).send('A campaign could not be found for the given ID');

            // check if the user sending the request is the creator of this campaign
            if (!campaign.createdBy.equals(req.user._id)) return res.status(401).send('You are not authorised to create quests on this campaign');

            const { title, description, giverName, characters, milestones } = req.body;

            // basic checks to ensure parameters are supplied
            if (!title) return res.status(400).send('A title is required');
            if (!description) return res.status(400).send('A description is required');
            if (!characters ||
                !Array.isArray(characters) ||
                characters.length === 0
            ) return res.status(400).send('An array of characters is required');
            if (!milestones ||
                !Array.isArray(milestones) ||
                milestones.length === 0
            ) return res.status(400).send('An array of milestones is required');

            // get all characters that belong to this campaign so we can validate that these characters are in the list
            const campaignCharacters = await Character.find({ 'campaignId': _id }).lean();

            // further checks to make sure that character IDs are valid, they exist, and belong to the given campaign
            for (const character of characters) {
                if (!mongoose.Types.ObjectId.isValid(character)) {
                    return res.status(400).send(`Character ID ${character} is not valid`);
                }
                const foundCharacter = campaignCharacters.find(campaignCharacter => campaignCharacter._id.equals(mongoose.Types.ObjectId(character)));
                if (!foundCharacter) {
                    return res.status(400).send(`Character ID ${character} does not exist on the given campaign`);
                }
            }

            // further checks to make sure that the milestones have a name and complete = false
            for (const milestone of milestones) {
                if (!milestone.hasOwnProperty('name')) {
                    return res.status(400).send('All milestones must have a name property');
                }
                if (!milestone.hasOwnProperty('complete')) {
                    return res.status(400).send('All milestones must have a complete property');
                }
                if (milestone.complete !== false) {
                    return res.status(400).send('All milestones complete property must be false');
                }
            }

            // get an ID so we can attach it to the quest milestones too
            const id = mongoose.Types.ObjectId();

            // create the quest
            const quest = new Quest({
                _id: id,
                title,
                description,
                giverName: giverName ? giverName : '',
                characters,
                campaignId: _id
            });

            await quest.save();

            // create the quest milestones
            for (const milestone of milestones) {
                const questMilestone = new QuestMilestone({
                    questId: id,
                    name: milestone.name,
                    complete: milestone.complete
                });

                await questMilestone.save();
            }

            res.status(201).send(quest);
        } catch (e) {
            res.status(404).send(e);
        }
    } else {
        res.status(401).send({});
    }
});

// GET to fetch all quests on a campaign - /campaigns/:id/quests
// GET can only be performed by DM
// GET must relate to a campaign that exists
router.get("/campaigns/:id/quests", async (req, res) => {
    if (req.user) {
        try {
            const _id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A campaign could not be found for the given ID');

            const campaign = await Campaign.findById(_id);
            if (!campaign) return res.status(404).send('A campaign could not be found for the given ID');

            // check if the user sending the request is the creator of this campaign
            if (!campaign.createdBy.equals(req.user._id)) return res.status(401).send('You are not authorised to fetch quests on this campaign');

            // loop over quests and get the milestones to attach to the quests
            const quests = await Quest.find({ 'campaignId': _id }).lean();
            for (const quest of quests) {
                quest.milestones = await QuestMilestone.find({ 'questId': quest._id });
            }

            res.status(200).send(quests);

        } catch (e) {
            res.status(404).send(e);
        }
    } else {
        res.status(401).send({});
    }
});

// DELETE a particular quest - /quests/:id
// DELETE can only be performed by DM
router.delete("/quests/:id", async (req, res) => {
    if (req.user) {
        try {
            const _id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A quest could not be found for the given ID');

            // find the quest
            const quest = await Quest.findById(_id);
            if (!quest) return res.status(404).send('A quest could not be found for the given ID');

            // get the associated campaign
            const campaign = await Campaign.findById(quest.campaignId);
            if (!campaign) return res.status(404).send('A campaign could not be found for the quest for the given ID');

            // check if the user sending the request is the creator of this campaign
            if (!campaign.createdBy.equals(req.user._id)) return res.status(401).send('You are not authorised to delete quests on this campaign');

            // delete the quest
            await Quest.deleteOne({ _id });

            // now delete associated milestones
            await QuestMilestone.deleteMany({ 'questId': _id });

            res.status(200).send();

        } catch (e) {
            res.status(404).send(e);
        }
    } else {
        res.status(401).send({});
    }
});

// PATCH a particular quest - /quests/:id
// PATCH can only be performed by DM
router.patch("/quests/:id", async (req, res) => {
    if (req.user) {
        try {
            const _id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A quest could not be found for the given ID');

            // find the quest
            const quest = await Quest.findById(_id);
            if (!quest) return res.status(404).send('A quest could not be found for the given ID');

            // get the associated campaign
            const campaign = await Campaign.findById(quest.campaignId);
            if (!campaign) return res.status(404).send('A campaign could not be found for the quest for the given ID');

            // check if the user sending the request is the creator of this campaign
            if (!campaign.createdBy.equals(req.user._id)) return res.status(401).send('You are not authorised to delete quests on this campaign');

            const { title, description, giverName, characters, milestones } = req.body;

            if (title) quest.title = title;
            if (description) quest.description = description;
            if (giverName) quest.giverName = giverName;
            if (characters) {
                // characters must be valid
                if (!Array.isArray(characters) || characters.length === 0) {
                    return res.status(400).send('Characters cannot be an empty list');
                }
                // get all characters that belong to this campaign so we can validate that these characters are in the list
                const campaignCharacters = await Character.find({ 'campaignId': campaign._id }).lean();
                // further checks to make sure that character IDs are valid, they exist, and belong to the given campaign
                for (const character of characters) {
                    if (!mongoose.Types.ObjectId.isValid(character)) {
                        return res.status(400).send(`Character ID ${character} is not valid`);
                    }
                    const foundCharacter = campaignCharacters.find(campaignCharacter => campaignCharacter._id.equals(mongoose.Types.ObjectId(character)));
                    if (!foundCharacter) {
                        return res.status(400).send(`Character ID ${character} does not exist on the given campaign`);
                    }
                }
                // by this point everything must be valid so update the characters
                quest.characters = characters;
            }
            if (milestones) {
                // if this is an empty array, return an error
                if (!Array.isArray(milestones) || milestones.length === 0) {
                    return res.status(400).send('Milestones must not be an empty list');
                }
                // checks to make sure that the milestones have a name and also check that any new milestones
                // have a complete property of false
                for (const milestone of milestones) {
                    if (!milestone.hasOwnProperty('name')) {
                        return res.status(400).send('All milestones must have a name property');
                    }
                    if (milestone.hasOwnProperty('_id')) {
                        // this is an existing milestone, so check that the complete flag is the same
                        const questMilestone = await QuestMilestone.findById(milestone._id);
                        if (!questMilestone) return res.status(500).send('Quest milestone does not exist');
                        if (questMilestone.complete !== milestone.complete)
                            return res.status(400).send('Cannot update complete property of existing milestones');
                    } else {
                        // this is a new milestone so we need to check it has a complete property of false
                        if (!milestone.hasOwnProperty('complete')) {
                            return res.status(400).send('All milestones must have a complete property');
                        }
                        if (milestone.complete !== false) {
                            return res.status(400).send('All milestones complete property must be false');
                        }
                    }
                }
                // all is ok by this point so loop round again to perform updates
                // before updating or adding anything newm we need to check if a milestone is missing that is in the DB already
                // if so, the user wants to remove it
                const existingMilestones = await QuestMilestone.find({ questId: _id }).lean();
                for (const existingMilestone of existingMilestones) {
                    const foundMilestoneInList = milestones.find(milestone =>
                        mongoose.Types.ObjectId(milestone._id).equals(existingMilestone._id)
                    );
                    if (!foundMilestoneInList) {
                        await QuestMilestone.deleteOne({ '_id': existingMilestone._id });
                    }
                }

                for (const milestone of milestones) {
                    if (milestone.hasOwnProperty('_id')) {
                        // this is an existing milestone
                        const questMilestone = await QuestMilestone.findById(milestone._id);
                        questMilestone.name = milestone.name;
                        await questMilestone.save();
                    } else {
                        // this is a new milestone so create it
                        const newQuestMilestone = new QuestMilestone({
                            questId: _id,
                            name: milestone.name,
                            complete: milestone.complete
                        });
                        await newQuestMilestone.save();
                    }
                }
            }

            await quest.save();
            const newQuest = JSON.parse(JSON.stringify(quest));
            newQuest.milestones = await QuestMilestone.find({ 'questId': _id }).lean();

            res.status(200).send(newQuest);
        } catch (e) {
            res.status(404).send(e);
        }
    } else {
        res.status(401).send({});
    }
});

module.exports = router;