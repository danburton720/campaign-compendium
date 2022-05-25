const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    relatedCharacter: {
        type: mongoose.Schema.Types.Mixed,
        required: true,
    },
    createdAt: {
        type: String,
        required: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId, ref: 'User',
        required: true
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Campaign',
        required: true
    }
});

module.exports = mongoose.model('Note', NoteSchema);