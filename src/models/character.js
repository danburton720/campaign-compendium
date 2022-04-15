const mongoose = require('mongoose');

const CharacterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true,
    },
    race: {
        type: String,
        required: true
    },
    class: {
        type: String,
        required: true,
    },
    externalLink: {
        type: String
    },
    chosenImage: {
        type: String
    },
    chosenColor: {
        type: String
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Campaign',
        required: true
    },
    status: {
        type: String,
        required: true
    },
    deletedAt: {
        type: String,
    }
});

module.exports = mongoose.model('Character', CharacterSchema);