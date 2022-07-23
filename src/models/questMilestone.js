const mongoose = require('mongoose');

const QuestMilestoneSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    complete: {
        type: Boolean,
        required: true
    },
    questId: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Quest',
        required: true
    }
});

module.exports = mongoose.model('QuestMilestone', QuestMilestoneSchema);