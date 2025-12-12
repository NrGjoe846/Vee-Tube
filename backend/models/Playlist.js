
const mongoose = require('mongoose');

const PlaylistSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    name: { type: String, required: true },
    description: { type: String },
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    isPublic: { type: Boolean, default: false },
    thumbnail: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Playlist', PlaylistSchema);
