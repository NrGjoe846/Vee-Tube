
const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    thumbnailUrl: { type: String },
    coverUrl: { type: String },
    videoUrl: { type: String }, // Can be relative filename or full S3 URL
    duration: { type: String },
    year: { type: Number },
    genre: [{ type: String }],
    rating: { type: String },
    isOriginal: { type: Boolean, default: false },
    category: { type: String, default: 'Uncategorized' },
    views: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Video', VideoSchema);
