const mongoose = require('mongoose');

const QuestSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    giverName: {
        type: String
    },
    campaignId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Campaign',
        required: true
    },
    characters: [{
        type: mongoose.Schema.Types.ObjectId, ref: 'Character',
        required: true
    }]
});

module.exports = mongoose.model('Quest', QuestSchema);