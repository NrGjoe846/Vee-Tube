
const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    thumbnailUrl: { type: String },
    coverUrl: { type: String },
    videoUrl: { type: String }, 
    duration: { type: String },
    year: { type: Number },
    genre: [{ type: String }],
    tags: [{ type: String }], // SEO tags
    language: { type: String, default: 'English' }, // Language filter
    rating: { type: String },
    
    // Flags
    isOriginal: { type: Boolean, default: false },
    isFeatured: { type: Boolean, default: false }, // For Hero Slider
    isTrending: { type: Boolean, default: false },

    // Status & Metadata
    status: { type: String, enum: ['Draft', 'Processing', 'Published'], default: 'Published' },
    quality: { type: String, enum: ['SD', 'HD', '4K'], default: 'HD' },

    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    category: { type: String, default: 'Uncategorized' },
    
    views: { type: Number, default: 0 },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    dislikes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

VideoSchema.index({ title: 'text', description: 'text', tags: 'text' }); // Text index for search

module.exports = mongoose.model('Video', VideoSchema);
