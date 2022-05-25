const express = require('express');
const router = new express.Router();
const mongoose = require('mongoose');
const Note = require('../models/note');
const Character = require('../models/character');
const Campaign = require('../models/campaign');

// POST
// POST endpoint to create a new note - /campaigns/:id/notes
// only the creator of a campaign can create a note, or a user who has a non-deleted character on the given campaign
router.post("/campaigns/:id/notes", async (req, res) => {
    if (req.user) {
        try {
            const _id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A campaign could not be found for the given ID');

            const campaign = await Campaign.findById(_id);
            if (!campaign) return res.status(404).send('A campaign could not be found for the given ID');

            const character = await Character.find({ 'campaignId': _id, 'userId': req.user._id, 'deletedAt': '' });
            // check if the user sending the request is the creator of this campaign OR has a non-deleted character on the given campaign
            if (!campaign.createdBy.equals(req.user._id) && (!character || character.length === 0)) return res.status(401).send('You are not authorised to add notes to this campaign');

            const { content, relatedCharacter } = req.body;

            if (!content) return res.status(400).send('Note content is required');
            const newRelatedCharacter = relatedCharacter || "DM";

            // if the related character is not the DM, check that this character exists on the campaign
            if (newRelatedCharacter !== "DM") {
                const campaignCharacter = await Character.find({ 'campaignId': _id, 'userId': req.user._id, 'deletedAt': '', '_id': newRelatedCharacter });
                if (!campaignCharacter || campaignCharacter.length === 0) return res.status(404).send('There is no character on this campaign for the given related character ID');
                if (campaignCharacter.status === 'invited') return res.status(400).send('Notes cannot be related to an invited character');
            }

            const note = new Note({
                content,
                relatedCharacter: newRelatedCharacter,
                createdAt: new Date().toISOString(),
                createdBy: req.user._id,
                campaignId: _id
            });

            await note.save();
            res.status(201).send(note);
        } catch (e) {
            res.status(404).send(e);
        }
    } else {
        res.status(401).send({});
    }
});


// GET - all notes
// GET endpoint to fetch all notes on a campaign - /campaigns/:id/notes
// only the DM is authorised to this endpoint
// paginated
// param options so DM can specify the character(s) to filter on (including themselves with the string "DM")
// also date range from and to params to filter between a date range
router.get("/campaigns/:id/notes", async (req, res) => {
    if (req.user) {
        // get all session updates for the campaign
        try {
            const _id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A campaign could not be found for the given ID');

            const campaign = await Campaign.findById(_id);
            if (!campaign) return res.status(404).send('A campaign could not be found for the given ID');

            if (!campaign.createdBy.equals(req.user._id)) {
                return res.status(401).send('You are not authorised to get all notes on this campaign');
            }

            // access query params
            const relatedCharactersParam = req.query.relatedCharacter; // will be a string or array of strings of character IDs potentially with "DM" in the mix | undefined
            const fromParam = req.query.from; // will be string of date ISO string | undefined
            const toParam = req.query.to; // will be string of date ISO string | undefined
            const page = parseInt(req.query.page, 10) || 1;
            const limit = 25;

            if (!page) return res.status(400).send('Param page is required');
            if (!fromParam) return res.status(400).send('Param fromParam is required');
            if (!toParam) return res.status(400).send('Param toParam is required');

            // if the param is already an array, use it, otherwise create an array
            let filterCharactersArray = [];
            if (relatedCharactersParam && Array.isArray(relatedCharactersParam)) filterCharactersArray = relatedCharactersParam;
            else if (relatedCharactersParam) filterCharactersArray = [relatedCharactersParam];

            // base conditions for the find query
            const conditions = [
                { campaignId: _id },
                { createdAt: { $gt: fromParam } },
                { createdAt: { $lt: toParam }}
            ];

            // if filterCharactersArray is empty then don't filter on characters, just get all notes in the date range
            if (filterCharactersArray.length > 0) conditions.push({ relatedCharacter: { $in: filterCharactersArray } });

            const notes = await Note.find({ $and: conditions })
                .sort({ createdAt: 'desc' })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();

            const notesWithCharacters = [];

            if (notes) {
                // we have notes so we need to get the character associated with the note
                for (const note of notes) {
                    const newNote = note;
                    if (note.relatedCharacter !== "DM") {
                        const noteCharacter = await Character.findById(note.relatedCharacter);
                        if (noteCharacter) newNote.character = noteCharacter;
                    }
                    notesWithCharacters.push(newNote);
                }
            }
            res.send(notesWithCharacters);

            res.status(200).send(notesWithCharacters);
        } catch (e) {
            res.status(404).send(e);
        }
    } else {
        res.status(401).send({});
    }
});


// GET - player notes
// GET endpoint to fetch only "my" notes on a campaign - /campaigns/:id/notes/created-by-me
// this just returns any notes created by the logged in user on the given campaign
// the logged in user must have a non-deleted character on the given campaign
// this is paginated
router.get("/campaigns/:id/notes/created-by-me", async (req, res) => {
    if (req.user) {
        // get all session updates for the campaign
        try {
            const _id = req.params.id;
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A campaign could not be found for the given ID');

            const campaign = await Campaign.findById(_id);
            if (!campaign) return res.status(404).send('A campaign could not be found for the given ID');

            const character = await Character.find({ 'campaignId': _id, 'userId': req.user._id, 'deletedAt': '' });
            if (!character || character.length === 0) return res.status(401).send('You do not have a character on this campaign');

            // access query params
            const page = parseInt(req.query.page, 10) || 1;
            const limit = 25;

            if (!page) return res.status(400).send('Param page is required');

            const notes = await Note.find({ 'campaignId': _id, 'createdBy': req.user._id })
                .sort({ createdAt: 'desc' })
                .skip((page - 1) * limit)
                .limit(limit)
                .lean();

            const notesWithCharacters = [];

            if (notes) {
                // we have notes so we need to get the character associated with the note
                for (const note of notes) {
                    const newNote = note;
                    if (note.relatedCharacter !== "DM") {
                        const noteCharacter = await Character.findById(note.relatedCharacter);
                        if (noteCharacter) newNote.character = noteCharacter;
                    }
                    notesWithCharacters.push(newNote);
                }
            }
            res.send(notesWithCharacters);

            res.status(200).send(notesWithCharacters);
        } catch (e) {
            res.status(404).send(e);
        }
    } else {
        res.status(401).send({});
    }
});

// PATCH
// PATCH endpoint so that the creator of a note can edit it - /notes/:id
// only the creator of the note can edit it
router.patch("/notes/:id", async (req, res) => {
    if (req.user) {
        const _id = req.params.id;
        try {
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A note could not be found for the given ID');

            const note = await Note.findById(_id);

            if (!note) return res.status(404).send('A note could not be found for the given id')

            if (!note.createdBy.equals(req.user._id)) {
                return res.status(401).send('You are not authorised to edit this note');
            }

            if (req.body.hasOwnProperty('relatedCharacter')) note.relatedCharacter = req.body.relatedCharacter;
            if (req.body.hasOwnProperty('content')) note.content = req.body.content;
            await note.save();
            res.send(note);
        } catch (e) {
            res.status(400).send(e);
        }
    } else {
        res.status(401).send({});
    }
});

// DELETE
// DELETE endpoint to delete a note - /notes/:id
// only the creator of the note can edit it
router.delete("/notes/:id", async (req, res) => {
    if (req.user) {
        const _id = req.params.id;
        try {
            if (!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('A note could not be found for the given ID');

            const note = await Note.findById(_id);

            if (!note) return res.status(404).send('A note could not be found for the given id')

            if (!note.createdBy.equals(req.user._id)) {
                return res.status(401).send('You are not authorised to delete this note');
            }

            const deletedNote = await Note.deleteOne({ _id });
            res.send(deletedNote);
        } catch (e) {
            res.status(400).send(e);
        }
    } else {
        res.status(401).send({});
    }
});

module.exports = router;
