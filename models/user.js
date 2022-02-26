const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    displayName: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    image: {
        type: String
    }
});

module.exports = mongoose.model('User', userSchema);