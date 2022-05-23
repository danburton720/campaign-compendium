const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const SessionUpdate = require('../models/sessionUpdate');
const Campaign = require('../models/campaign');

// POST to create session update - /campaigns/:id/session-updates
// POST can only be performed by DM
// POST must relate to a campaign that exists
// date must be provided
router.post("/campaigns/:id/session-updates", async (req, res) => {
    if (req.user) {
        try {
            const _id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A campaign could not be found for the given ID');

            const campaign = await Campaign.findById(_id);
            if (!campaign) return res.status(404).send('A campaign could not be found for the given ID');

            // check if the user sending the request is the creator of this campaign
            if (!campaign.createdBy.equals(req.user._id)) return res.status(401).send('You are not authorised to create session updates on this campaign');

            const { sessionDate, content } = req.body;

            if (!sessionDate) return res.status(400).send('A session date is required');

            const sessionUpdate = new SessionUpdate({
                sessionDate,
                content,
                campaignId: _id
            });

            await sessionUpdate.save();
            res.status(201).send(sessionUpdate);
        } catch (e) {
            res.status(404).send(e);
        }
    } else {
        res.status(401).send({});
    }
});

// PATCH to update session date or content - /session-updates/:id
// PATCH can only be performed by DM
// PATCH can only be performed if session-update exists
router.patch("/session-updates/:id", async (req, res) => {
    if (req.user) {
        const _id = req.params.id;
        try {
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A session update could not be found for the given ID');

            const sessionUpdate = await SessionUpdate.findById(_id);

            if (!sessionUpdate) return res.status(404).send('A session update could not be found for the given id')

            const campaign = await Campaign.findById(sessionUpdate.campaignId);

            if (!campaign) return res.status(404).send('A campaign could not be found for the session update for the given id')
            if (!campaign.createdBy.equals(req.user._id)) {
                return res.status(401).send('You are not authorised to edit this session update');
            }

            if (req.body.hasOwnProperty('sessionDate')) sessionUpdate.sessionDate = req.body.sessionDate;
            if (req.body.hasOwnProperty('content')) sessionUpdate.content = req.body.content;
            await sessionUpdate.save();
            res.send(sessionUpdate);
        } catch (e) {
            res.status(400).send(e);
        }
    } else {
        res.status(401).send({});
    }
});


// GET to fetch all session-updates for a campaign - /campaigns/:id/session-updates
// available to all logged in users
router.get("/campaigns/:id/session-updates", async (req, res) => {
    if (req.user) {
        // get all session updates for the campaign
        try {
            const _id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A campaign could not be found for the given ID');

            const campaign = await Campaign.findById(_id);
            if (!campaign) return res.status(404).send('A campaign could not be found for the given ID');

            const sessionUpdates = await SessionUpdate.find({ 'campaignId': _id }).lean();
            res.status(200).send(sessionUpdates);
        } catch (e) {
            res.status(404).send(e);
        }
    } else {
        res.status(401).send({});
    }
});


// DELETE to remove session-update - /session-updates/:id
// DELETE can only be performed by DM
router.delete("/session-updates/:id", async (req, res) => {
    if (req.user) {
        const _id = req.params.id;
        try {
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A session update could not be found for the given ID');

            const sessionUpdate = await SessionUpdate.findById(_id);

            if (!sessionUpdate) return res.status(404).send('A session update could not be found for the given id')

            const campaign = await Campaign.findById(sessionUpdate.campaignId);

            if (!campaign) return res.status(404).send('A campaign could not be found for the session update for the given id')
            if (!campaign.createdBy.equals(req.user._id)) {
                return res.status(401).send('You are not authorised to edit this session update');
            }

            const deletedSessionUpdate = await SessionUpdate.deleteOne({ _id });
            res.send(deletedSessionUpdate);
        } catch (e) {
            res.status(400).send(e);
        }
    } else {
        res.status(401).send({});
    }
});