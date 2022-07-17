const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const Quest = require('../models/quest');
const QuestMilestone = require('../models/questMilestone');
const Campaign = require('../models/campaign');

// POST to mark a quest milestone as complete
// POST can only be performed by DM
// quest milestone must already be complete = false
router.post("/quest-milestones/:id/complete", async (req, res) => {
    if (req.user) {
        try {
            const _id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(_id))
                return res.status(404).send('A quest milestone could not be found for the given ID');

            const questMilestone = await QuestMilestone.findById(_id);
            if (!questMilestone) return res.status(404).send('A quest milestone could not be found for the given ID');

            const quest = await Quest.findById(questMilestone.questId);
            if (!quest) return res.status(404).send('A quest could not be found for this milestone');

            const campaign = await Campaign.findById(quest.campaignId);
            if (!campaign) return res.status(404).send('A campaign could not be found this quest');

            // check if the user sending the request is the creator of this campaign
            if (!campaign.createdBy.equals(req.user._id))
                return res.status(401).send('You are not authorised to create quests on this campaign');

            if (questMilestone.complete === true)
                return res.status(400).send('You cannot set a complete quest to complete');

            const newQuestMilestone = await QuestMilestone.findOneAndUpdate({ '_id': _id }, { complete: true }, {
                new: true
            });

            res.status(200).send(newQuestMilestone);

        } catch (e) {
            res.status(404).send(e);
        }
    } else {
        res.status(401).send({});
    }
});

// POST to mark a quest milestone as incomplete
// POST can only be performed by DM
// quest milestone must already be complete = true
router.post("/quest-milestones/:id/incomplete", async (req, res) => {
    if (req.user) {
        try {
            const _id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(_id))
                return res.status(404).send('A quest milestone could not be found for the given ID');

            const questMilestone = await QuestMilestone.findById(_id);
            if (!questMilestone) return res.status(404).send('A quest milestone could not be found for the given ID');

            const quest = await Quest.findById(questMilestone.questId);
            if (!quest) return res.status(404).send('A quest could not be found for this milestone');

            const campaign = await Campaign.findById(quest.campaignId);
            if (!campaign) return res.status(404).send('A campaign could not be found this quest');

            // check if the user sending the request is the creator of this campaign
            if (!campaign.createdBy.equals(req.user._id))
                return res.status(401).send('You are not authorised to create quests on this campaign');

            if (questMilestone.complete === false)
                return res.status(400).send('You cannot set an incomplete quest to incomplete');

            const newQuestMilestone = await QuestMilestone.findOneAndUpdate({ '_id': _id }, { complete: false }, {
                new: true
            });

            res.status(200).send(newQuestMilestone);

        } catch (e) {
            res.status(404).send(e);
        }
    } else {
        res.status(401).send({});
    }
});

module.exports = router;