const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
    matchId: {
        type: String,
        required: true,
        index: true
    },
    messages: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        text: {
            type: String,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }]
}, {
    timestamps: true
});

module.exports = mongoose.model('Chat', chatSchema);