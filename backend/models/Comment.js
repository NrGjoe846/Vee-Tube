
const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' }, // Optional if on a post
    post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },   // Optional if on a video
    text: { type: String, required: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null }, // For nested replies
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    isFlagged: { type: Boolean, default: false } // For moderation
}, { timestamps: true });

module.exports = mongoose.model('Comment', CommentSchema);
