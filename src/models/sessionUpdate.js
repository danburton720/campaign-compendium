const mongoose = require('mongoose');

const SessionUpdateSchema = new mongoose.Schema({
    sessionDate: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Campaign',
        required: true
    },
});

module.exports = mongoose.model('SessionUpdate', SessionUpdateSchema);