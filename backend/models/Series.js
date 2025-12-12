
const mongoose = require('mongoose');

const SeriesSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    thumbnailUrl: { type: String },
    coverUrl: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    
    // Metadata
    cast: [{ type: String }],
    director: { type: String },
    genre: [{ type: String }],
    releaseYear: { type: Number },
    language: { type: String, default: 'English' },
    rating: { type: String, default: 'TV-14' },

    // Content Structure
    seasons: [{
        seasonNumber: { type: Number, required: true },
        title: { type: String }, // e.g., "Book One"
        episodes: [{
            episodeNumber: { type: Number, required: true },
            video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' } // Link to existing Video
        }]
    }],
    
    isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

SeriesSchema.index({ title: 'text', description: 'text' });

module.exports = mongoose.model('Series', SeriesSchema);
