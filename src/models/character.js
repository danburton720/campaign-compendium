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
    }
});

module.exports = mongoose.model('Character', CharacterSchema);