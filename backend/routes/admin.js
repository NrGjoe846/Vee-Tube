
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Video = require('../models/Video');
const { protect, admin } = require('../middleware/auth');

// @route GET /api/admin/users
router.get('/users', protect, admin, async (req, res) => {
    try {
        const users = await User.find({}).select('-password');
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route PUT /api/admin/users/:id/ban
// @desc Ban or Unban a user
router.put('/users/:id/ban', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        // Prevent banning other admins for safety
        if (user.isAdmin) return res.status(400).json({ message: 'Cannot ban an admin' });

        user.isBanned = !user.isBanned; // Toggle status
        await user.save();
        
        res.json({ 
            message: user.isBanned ? 'User banned' : 'User unbanned',
            isBanned: user.isBanned 
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route DELETE /api/admin/users/:id
router.delete('/users/:id', protect, admin, async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (user) {
            await user.deleteOne();
            res.json({ message: 'User removed' });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route PUT /api/admin/videos/:id/feature
// @desc Toggle Featured/Trending status
router.put('/videos/:id/feature', protect, admin, async (req, res) => {
    try {
        const { isFeatured, isTrending } = req.body;
        const video = await Video.findById(req.params.id);
        
        if (video) {
            if (isFeatured !== undefined) video.isFeatured = isFeatured;
            if (isTrending !== undefined) video.isTrending = isTrending;
            
            await video.save();
            res.json(video);
        } else {
            res.status(404).json({ message: 'Video not found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/admin/dashboard
// @desc Get enhanced dashboard stats
router.get('/dashboard', protect, admin, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const videoCount = await Video.countDocuments();
        const premiumCount = await User.countDocuments({ isPremium: true });
        
        const videos = await Video.find({}).select('views likes createdAt');
        const totalViews = videos.reduce((acc, video) => acc + (video.views || 0), 0);
        const totalLikes = videos.reduce((acc, video) => acc + (video.likes.length || 0), 0);

        // Recent Activity
        const recentUsers = await User.find({}).sort({ createdAt: -1 }).limit(5).select('name email createdAt');
        const recentVideos = await Video.find({}).sort({ createdAt: -1 }).limit(5).select('title views createdAt');

        res.json({
            stats: {
                totalUsers: userCount,
                totalVideos: videoCount,
                totalViews,
                totalLikes,
                premiumUsers: premiumCount
            },
            recentUsers,
            recentVideos
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @route GET /api/admin/stats (Legacy support)
router.get('/stats', protect, admin, async (req, res) => {
    try {
        const userCount = await User.countDocuments();
        const videoCount = await Video.countDocuments();
        const premiumCount = await User.countDocuments({ isPremium: true });
        
        const videos = await Video.find({}).select('views');
        const totalViews = videos.reduce((acc, video) => acc + (video.views || 0), 0);

        res.json({
            users: userCount,
            videos: videoCount,
            views: totalViews,
            premiumUsers: premiumCount
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
