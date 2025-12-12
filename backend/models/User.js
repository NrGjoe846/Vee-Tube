
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    avatar: { type: String, default: '' },
    
    // Roles & Permissions
    isAdmin: { type: Boolean, default: false, required: true },
    isCreator: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false }, // Account suspension status
    
    // Subscription / Plan
    isPremium: { type: Boolean, default: false },
    planType: { type: String, enum: ['Free', 'Basic', 'Premium', 'VIP'], default: 'Free' },
    planExpiry: { type: Date },

    // Social
    subscribers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // People following me
    subscribedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], // Channels I follow
    
    // User Data
    watchlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Video' }],
    watchHistory: [{
        video: { type: mongoose.Schema.Types.ObjectId, ref: 'Video' },
        progress: { type: Number, default: 0 }, 
        lastWatched: { type: Date, default: Date.now }
    }],
    notifications: [{
        message: { type: String },
        type: { type: String, enum: ['system', 'alert', 'promo', 'social'], default: 'system' },
        read: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
    }],

    // New Features
    searchHistory: [{
        query: { type: String },
        searchedAt: { type: Date, default: Date.now }
    }],
    preferences: {
        genres: [{ type: String }],
        languages: [{ type: String }]
    },
    
    // Studio / Live
    streamKey: { type: String, select: false } // Hidden by default
}, { timestamps: true });

UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

UserSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);
