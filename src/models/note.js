const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
    sessionDate: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    createdBy: {
        type: Schema.Types.Mixed,
        required: true,
    },
    createdAt: {
        type: String,
        required: true,
    }
});

module.exports = mongoose.model('Note', NoteSchema);