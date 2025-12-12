
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Video = require('../models/Video');
const { protect } = require('../middleware/auth');
const bcrypt = require('bcryptjs');

// @route PUT /api/user/profile
router.put('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.avatar = req.body.avatar || user.avatar;
            
            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();
            res.json({
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                avatar: updatedUser.avatar,
                isPremium: updatedUser.isPremium,
                token: req.headers.authorization.split(' ')[1] 
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/user/channel/:id
// @desc Get public channel profile (user info + videos)
router.get('/channel/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('name avatar subscribers isCreator createdAt');
        if (!user) return res.status(404).json({ message: 'Channel not found' });

        const videos = await Video.find({ creator: req.params.id, status: 'Published' }).sort({ createdAt: -1 });

        res.json({
            profile: {
                _id: user._id,
                name: user.name,
                avatar: user.avatar,
                subscribersCount: user.subscribers.length,
                joinedAt: user.createdAt,
                isCreator: user.isCreator
            },
            videos
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/user/subscribe/:id
router.post('/subscribe/:id', protect, async (req, res) => {
    try {
        const channelToFollow = await User.findById(req.params.id);
        const currentUser = await User.findById(req.user._id);

        if (!channelToFollow) return res.status(404).json({ message: 'Channel not found' });
        if (req.params.id === req.user._id.toString()) return res.status(400).json({ message: 'Cannot subscribe to yourself' });

        if (currentUser.subscribedTo.includes(req.params.id)) {
            currentUser.subscribedTo = currentUser.subscribedTo.filter(id => id.toString() !== req.params.id);
            channelToFollow.subscribers = channelToFollow.subscribers.filter(id => id.toString() !== req.user._id.toString());
            await currentUser.save();
            await channelToFollow.save();
            return res.json({ message: 'Unsubscribed', isSubscribed: false });
        } else {
            currentUser.subscribedTo.push(req.params.id);
            channelToFollow.subscribers.push(req.user._id);
            channelToFollow.notifications.push({
                message: `${currentUser.name} started following you.`,
                type: 'social'
            });
            await currentUser.save();
            await channelToFollow.save();
            return res.json({ message: 'Subscribed', isSubscribed: true });
        }

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/user/subscriptions
router.get('/subscriptions', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('subscribedTo', 'name avatar isCreator');
        res.json(user.subscribedTo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- NOTIFICATION ROUTES ---

// @route GET /api/user/notifications
router.get('/notifications', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route PUT /api/user/notifications/read-all
router.put('/notifications/read-all', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.notifications.forEach(n => n.read = true);
        await user.save();
        res.json(user.notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route DELETE /api/user/notifications/:id
router.delete('/notifications/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.notifications = user.notifications.filter(n => n._id.toString() !== req.params.id);
        await user.save();
        res.json(user.notifications);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- WATCHLIST ROUTES ---

// @route GET /api/user/watchlist
router.get('/watchlist', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('watchlist');
        res.json(user.watchlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/user/watchlist/:id
router.post('/watchlist/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user.watchlist.includes(req.params.id)) {
            user.watchlist.push(req.params.id);
            await user.save();
        }
        const updatedUser = await User.findById(req.user._id).populate('watchlist');
        res.json(updatedUser.watchlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route DELETE /api/user/watchlist/:id
router.delete('/watchlist/:id', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.watchlist = user.watchlist.filter(id => id.toString() !== req.params.id);
        await user.save();
        const updatedUser = await User.findById(req.user._id).populate('watchlist');
        res.json(updatedUser.watchlist);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- WATCH HISTORY ROUTES ---

// @route GET /api/user/history
router.get('/history', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('watchHistory.video');
        res.json(user.watchHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route POST /api/user/history/:id
router.post('/history/:id', protect, async (req, res) => {
    const { progress } = req.body; 
    try {
        const user = await User.findById(req.user._id);
        user.watchHistory = user.watchHistory.filter(h => h.video.toString() !== req.params.id);
        user.watchHistory.unshift({
            video: req.params.id,
            progress: progress || 0,
            lastWatched: Date.now()
        });
        if (user.watchHistory.length > 50) user.watchHistory.pop();
        await user.save();
        res.json(user.watchHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route DELETE /api/user/history
router.delete('/history', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.watchHistory = [];
        await user.save();
        res.json({ message: 'History cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- SEARCH HISTORY ROUTES ---

// @route POST /api/user/search-history
// @desc Save a search query
router.post('/search-history', protect, async (req, res) => {
    try {
        const { query } = req.body;
        if (!query) return res.status(400).json({ message: 'Query is required' });

        const user = await User.findById(req.user._id);
        
        // Remove existing identical query to push it to the top
        user.searchHistory = user.searchHistory.filter(item => item.query.toLowerCase() !== query.toLowerCase());
        
        user.searchHistory.unshift({ query });
        
        // Limit history to last 10 items
        if (user.searchHistory.length > 10) {
            user.searchHistory = user.searchHistory.slice(0, 10);
        }

        await user.save();
        res.json(user.searchHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/user/search-history
router.get('/search-history', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        res.json(user.searchHistory);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route DELETE /api/user/search-history
router.delete('/search-history', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        user.searchHistory = [];
        await user.save();
        res.json({ message: 'Search history cleared' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- PREFERENCES ROUTES ---

// @route PUT /api/user/preferences
router.put('/preferences', protect, async (req, res) => {
    try {
        const { genres, languages } = req.body;
        const user = await User.findById(req.user._id);
        
        if (genres) user.preferences.genres = genres;
        if (languages) user.preferences.languages = languages;
        
        await user.save();
        res.json(user.preferences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
