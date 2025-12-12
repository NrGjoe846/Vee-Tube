
const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    text: { type: String, required: true },
    type: { type: String, enum: ['text', 'poll', 'image'], default: 'text' },
    imageUrl: { type: String },
    
    // Poll Structure
    pollOptions: [{
        text: { type: String, required: true },
        votes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Users who voted for this option
    }],
    
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], 
    isPublic: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);
